import { createGuard } from "utils";
import {
  BridgetProps,
  BridgetButtonProps,
  ObjectWithCorners,
  settingsConfig,
  WallButtonProps,
  WallProps,
  LevelState,
} from "game/modules/game";
import DefaultScene from "../Default";
import { Level_0 } from "game/modules/levels";

const arcadeBodyGuard = createGuard<Phaser.Physics.Arcade.Body>("setVelocity");
const { duration, ease } = settingsConfig.bridges.animation;

export class Level {
  private scene: DefaultScene;
  private state: LevelState = {};

  constructor(scene: DefaultScene) {
    this.scene = scene;

    const map = scene.map;
    const player = scene.player?.playerBody;

    if (map && player) {
      this.createButtons(scene, map, player);
      this.createWalls(scene, map, player);
      this.createFinish(scene, map, player);
    }
  }

  createFinish(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    const layer = map.getObjectLayer("finish");
    const finishList = layer.objects;
    const texture = scene.textures.get("finish").getFrameNames();

    finishList.forEach(
      ({ x = -100, y = -100, width = -100, height = -100, properties }) => {
        const finish = scene.add
          .tileSprite(x, y, width, height, "buttons", texture[0])
          .setOrigin(0, 1);
        scene.physics.world.enable(finish);
        if (arcadeBodyGuard(finish.body)) {
          finish.body.setAllowGravity(false);
        }



        scene.physics.add.overlap(player, finish, () => {
          // FINISH HERE
          // level.stop("ex_1");
          // level.remove("ex_1");
          // level.launch("ex_0");
          // level.pause();

          // level.remove('ex_1')
          // level.start('ex_0');
          // this.scene.scene.start("ex_0");
        });
      },
    );
  }

  createButtons(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    const bridgetButtonsLayer = map.getObjectLayer("buttons");
    const bridgetButtonsList = bridgetButtonsLayer.objects;

    const wallButtonsLayer = map.getObjectLayer("wallButtons");
    const wallButtonsList = wallButtonsLayer.objects;

    const buttonTextures = scene.textures.get("buttons").getFrameNames();

    bridgetButtonsList.forEach(
      ({ x = -100, y = -100, width = -100, height = -100, properties }, i) => {
        const props: BridgetButtonProps =
          scene.extensions.getPropsFromObject(properties);

        const button = scene.add
          .tileSprite(
            x,
            y,
            width,
            height,
            "buttons",
            props.tileName || buttonTextures[0],
          )
          .setOrigin(0, 1);
        scene.physics.world.enable(button);

        if (arcadeBodyGuard(button.body)) {
          button.body.setAllowGravity(false);
        }

        scene.physics.add.overlap(player, button, () => {
          button.destroy();
          this.createBridge(scene, map, player, props.bridgetId);
        });
      },
    );

    wallButtonsList.forEach(
      ({ x = -100, y = -100, width = -100, height = -100, properties }, i) => {
        const props: WallButtonProps =
          scene.extensions.getPropsFromObject(properties);

        const button = scene.add
          .tileSprite(
            x,
            y,
            width,
            height,
            "buttons",
            props.tileName || buttonTextures[0],
          )
          .setOrigin(0, 1);
        scene.physics.world.enable(button);

        if (arcadeBodyGuard(button.body)) {
          button.body.setAllowGravity(false);
        }

        const { height: gameHeight } = scene.game.config;

        scene.physics.add.overlap(player, button, () => {
          button.destroy();

          debugger;

          if (props.wallId !== undefined) {
            const { body, wall } = this.state[props.wallId];

            body.destroy();

            wall.forEach(({ props, sprite }) => {
              const y =
                props.direction === "top"
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
        });
      },
    );
  }

  createWalls(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    const layer = map.getObjectLayer("walls");
    const wallsList = layer.objects;
    const textures = scene.textures.get("bridges").getFrameNames();

    const sprites: Record<
      string,
      { sprite: Phaser.GameObjects.TileSprite; props: WallProps }[]
    > = {};

    wallsList.forEach(
      ({ x = -100, y = -100, width = 0, height = 0, properties }, i) => {
        const props: WallProps =
          scene.extensions.getPropsFromObject(properties);

        if (props.wallId === undefined) return;

        const wall = scene.add
          .tileSprite(
            x,
            y,
            width,
            height,
            "bridges",
            props.tileName || textures[0],
          )
          .setOrigin(0, 1);

        if (!sprites[props.wallId]) sprites[props.wallId] = [];

        sprites[props.wallId].push({ props, sprite: wall });
      },
    );

    Object.entries(sprites).forEach(([id, sprites]) => {
      const { x, y, rectWidth, rectHeight } = scene.extensions.findCorners(
        sprites.map(({ sprite }) => sprite),
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
        wall: sprites,
      };
    });
  }

  createBridge(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    id?: string | number,
  ) {
    if (!id) {
      return;
    }
    const layer = map.getObjectLayer("bridges");
    const bridgesList = layer.objects;
    const textures = scene.textures.get("bridges").getFrameNames();

    const { height } = scene.game.config;
    const gameHeight = Number(height);

    const bridgeSprites: ObjectWithCorners[] = [];

    bridgesList.forEach(
      ({ x = -100, y = -100, width = 0, height = 0, properties }, i) => {
        const props: BridgetProps =
          scene.extensions.getPropsFromObject(properties);

        if (props.bridgetId === id) {
          const yFromDirection =
            props.from === "bottom" ? -height * 2 : gameHeight + height * 2;

          const bridge = scene.add
            .tileSprite(
              x,
              yFromDirection,
              width,
              height,
              "bridges",
              props.tileName || textures[0],
            )
            .setOrigin(0, 1);

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
    }, duration);
  }
}
