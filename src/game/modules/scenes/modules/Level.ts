import { createGuard, createTimeouts } from "utils";

import DefaultScene from "../Default";
import {
  ButtonProps,
  BridgetProps,
  ButtonTexture,
  LevelState,
  ObjectWithCorners,
  FinishProps,
} from "game/type";
import { settingsConfig } from "game/modules/game";
import { progressManager } from "managers";

const arcadeBodyGuard = createGuard<Phaser.Physics.Arcade.Body>("setVelocity");
const { duration, ease } = settingsConfig.bridges.animation;

export class Level {
  constructor(scene: DefaultScene) {
    this.scene = scene;

    const map = scene.map;
    const player = scene.player?.playerBody;

    if (map && player) {
      this.createButtons(scene, map, player);
      this.createWalls(scene, map, player);
      this.createCoins(scene, map, player);
      this.createTraps(scene, map, player);
      this.createFinish(scene, map, player);
    }
  }
  private scene: DefaultScene;
  private state: LevelState = {};
  overlap = false;

  private createButtons(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    const bridgetButtonsLayer = map.getObjectLayer("buttons");
    const bridgetButtonsList = bridgetButtonsLayer?.objects;

    const [defaultButton, pushedButton] = scene.textures
      .get("button")
      .getFrameNames() as ButtonTexture[];

    bridgetButtonsList?.forEach(
      ({ x = -100, y = -100, width = -100, height = -100, properties }, i) => {
        const props: ButtonProps =
          scene.extensions.getPropsFromObject(properties);

        const btnX = x + width / 2,
          btnY = y + height;
        const button = props.invisible
          ? null
          : scene.add
              .sprite(btnX, btnY, "button", defaultButton)
              .setOrigin(0.5, 1);

        const buttonZone = scene.add.zone(x, y, width, height).setOrigin(0, 0);
        scene.physics.world.enable(
          buttonZone,
          Phaser.Physics.Arcade.STATIC_BODY,
        );

        if (arcadeBodyGuard(buttonZone)) {
          buttonZone.setAllowGravity(false);
        }

        scene.physics.add.overlap(player, buttonZone, () => {
          const currentKey = props.key;
          const foundKey = progressManager.getters
            .keys()
            .find((key) => key === currentKey);
          if (currentKey && !foundKey) return;

          this.overlap = true;
          setTimeout(() => {
            this.overlap = false;
          }, 5);
          button?.setTexture("button", pushedButton);

          if (props.is_wall) this.activateWall(scene, map, player, props.id);
          else this.activateBridge(scene, map, player, props.id);
          buttonZone.destroy();
        });
      },
    );
  }

  private createFinish(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    const layer = map.getObjectLayer("finish");
    const finishList = layer?.objects;
    const texture = scene.textures.get("finish").getFrameNames();

    finishList?.forEach(
      ({ x = -100, y = -100, width = -100, height = -100, properties }) => {
        const props: FinishProps =
          scene.extensions.getPropsFromObject(properties);

        const finish = scene.add
          .tileSprite(x, y, width, height, "buttons", texture[0])
          .setOrigin(0, 1);
        scene.physics.world.enable(finish);
        if (arcadeBodyGuard(finish.body)) {
          finish.body.setAllowGravity(false);
        }

        scene.physics.add.overlap(player, finish, () => {
          // FINISH HERE
          const nextLevelId = props.nextLevelId;
          console.log("🚀 ~ ~ nextLevelId:", nextLevelId)
        });
      },
    );
  }

  private createCoins(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    scene.anims.create({
      key: "coinAnimation",
      frames: "coin",
      frameRate: 10,
      repeat: -1,
    });
    const fireworks = scene.add.particles(0, 0, "spark", {
      speed: { min: 0, max: 80 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0, end: 1 },
      blendMode: "ADD",
      lifespan: 500,
      rotate: { min: -180, max: 180 },
      emitting: false,
    });

    const coinsLayer = map.getObjectLayer("coins");

    const coins = coinsLayer?.objects.map(({ x = 0, y = 0, width, height }) => {
      const sprite = scene.add.sprite(x, y, "coin", 0).setOrigin(0, 1);
      sprite.play("coinAnimation");

      this.scene.physics.world.enable(
        sprite,
        Phaser.Physics.Arcade.STATIC_BODY,
      );

      scene.physics.add.overlap(player, sprite, () => {
        this.overlap = true;
        setTimeout(() => {
          this.overlap = false;
        }, 5);

        const { x, y, width, height } = sprite;
        fireworks.explode(100, x + width / 2, y - height / 2);
        sprite.destroy();
        // ADD +1 COIN HERE
        progressManager.addCoin();
      });
    });
  }

  private createWalls(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    const layer = map.getObjectLayer("walls");
    const bridgesList = layer?.objects;
    const textures = scene.textures.get("bridges").getFrameNames();

    const bridges: Record<
      string,
      { sprite: Phaser.GameObjects.TileSprite; props: BridgetProps }[]
    > = {};

    bridgesList?.forEach(
      ({ x = -100, y = -100, width = 0, height = 0, properties }, i) => {
        const props: BridgetProps =
          scene.extensions.getPropsFromObject(properties);

        if (props.id === undefined) return;

        const block = scene.add
          .tileSprite(x, y + height, width, height, "bridges", textures[0])
          .setOrigin(0, 1);

        if (!bridges[props.id]) bridges[props.id] = [];

        bridges[props.id].push({ props, sprite: block });
      },
    );

    Object.entries(bridges).forEach(([id, blocks]) => {
      const { x, y, rectWidth, rectHeight } = scene.extensions.findCorners(
        blocks.map(({ sprite }) => sprite),
      );

      const bridgeBody = scene.add
        .zone(x, y, rectWidth, rectHeight)
        .setOrigin(0, 1);
      this.scene.physics.world.enable(
        bridgeBody,
        Phaser.Physics.Arcade.STATIC_BODY,
      );

      if (arcadeBodyGuard(bridgeBody.body)) {
        bridgeBody.body.setAllowGravity(false).setImmovable().setFriction(0, 0);
        bridgeBody.body.moves = false;
      }
      scene.physics.add.collider(player, bridgeBody, () => {});

      this.state[id] = {
        body: bridgeBody,
        bridges: blocks,
      };
    });
  }

  private activateBridge(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    id?: string | number,
  ) {
    if (id === undefined) {
      return;
    }

    const layer = map.getObjectLayer("bridges");
    const bridgesList = layer?.objects;
    const textures = scene.textures.get("bridges").getFrameNames();

    const gameHeight = Number(map.heightInPixels);
    const bridgeSprites: ObjectWithCorners[] = [];

    bridgesList?.forEach(
      ({ x = -100, y = -100, width = 0, height = 0, properties }, i) => {
        const props =
          scene.extensions.getPropsFromObject<BridgetProps>(properties);

        if (props.id === id) {
          const yFromDirection = props.from_top
            ? -height * 2
            : gameHeight + height * 2;

          const bridge = scene.add
            .tileSprite(
              x,
              yFromDirection,
              width,
              height,
              "bridges",
              textures[0],
            )
            .setOrigin(0, 0);

          bridgeSprites.push({ ...bridge, y });

          const bridgeAnimation = scene.tweens.add({
            targets: bridge,
            y,
            ease,
            duration,
            repeat: 0,
          });
        }
      },
    );

    setTimeout(() => {
      const { x, y, rectWidth, rectHeight } =
        scene.extensions.findCorners(bridgeSprites);
      const bridgeBody = scene.add
        .zone(x, y, rectWidth, rectHeight)
        .setOrigin(0, 0);
      this.scene.physics.world.enable(
        bridgeBody,
        Phaser.Physics.Arcade.STATIC_BODY,
      );

      if (arcadeBodyGuard(bridgeBody.body)) {
        bridgeBody.body.setAllowGravity(false).setImmovable().setFriction(0, 0);
        bridgeBody.body.moves = false;
      }

      scene.physics.add.collider(player, bridgeBody, () => {});
    }, duration);
  }
  private activateWall(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    id?: string | number,
  ) {
    if (!id) return;

    const gameHeight = Number(map.heightInPixels);

    const { body, bridges } = this.state[id];

    body.destroy();

    bridges.forEach(({ props, sprite }) => {
      const y = props.from_top
        ? -(sprite.height + 100)
        : Number(gameHeight) + sprite.height + 100;

      const animation = scene.tweens.add({
        targets: sprite,
        y,
        ease,
        duration,
        repeat: 0,
      });
    });
  }

  private invincible = false;
  private createTraps(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    const layer = map.getObjectLayer("traps");
    const traps = layer?.objects;

    traps?.forEach(({ x = -100, y = -100, width = 0, height = 0 }) => {
      const trap = scene.add.zone(x, y, width, height).setOrigin(0, 0);
      scene.physics.world.enable(trap, Phaser.Physics.Arcade.STATIC_BODY);

      scene.physics.add.overlap(player, trap, () => {
        player.setAlpha(0);
        if (!this.invincible) {
          this.invincible = true;
          const playerModule = scene.player;
          const white = scene.player?.playerWhite;
          if (!white || !playerModule) return;

          playerModule.HP -= 10;

          if (playerModule.HP <= 0) {
            scene.dead();
          }

          white.setAlpha(1);
          let i = 0;
          const id = setInterval(() => {
            const alpha = white.alpha === 1 ? 0 : 1;
            white.setAlpha(alpha);
            i++;
            if (i >= 5) {
              clearTimeout(id);
              this.invincible = false;
            }
          }, 100);
        }
      });
    });
  }
}
