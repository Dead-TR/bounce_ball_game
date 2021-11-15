import createGuard from "../../../../utils/createGuard";
import {
  BridgetProps,
  ButtonsProps,
  ObjectWithCorners,
} from "../../game/circle/types";
import { settingsConfig } from "../../game/settingsConfig";
import DefaultScene from "../Default";

const arcadeBodyGuard = createGuard<Phaser.Physics.Arcade.Body>("setVelocity");
const { duration, ease } = settingsConfig.bridges.animation;

export class Level {
  scene: DefaultScene;
  constructor(scene: DefaultScene) {
    this.scene = scene;

    const map = scene.map;
    const player = scene.player?.playerBody;

    if (map && player) {
      this.createButtons(scene, map, player);
    }
  }

  createButtons(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    const layer = map.getObjectLayer("buttons");
    const buttonsList = layer.objects;

    const textures = scene.textures.get("buttons").getFrameNames();

    buttonsList.forEach(
      ({ x = -100, y = -100, width = -100, height = -100, properties }, i) => {
        const props: ButtonsProps =
          scene.extensions.getPropsFromObject(properties);

        const button = scene.add
          .tileSprite(
            x,
            y,
            width,
            height,
            "buttons",
            props.tileName || textures[0]
          )
          .setOrigin(0, 1);
        scene.physics.world.enable(button);

        if (arcadeBodyGuard(button.body)) {
          button.body.setAllowGravity(false);
          // button.body.setVelocity(50, 0);
        }

        scene.physics.add.overlap(player, button, () => {
          button.destroy();
          this.createBridge(scene, map, player, props.bridgetId);
        });
      }
    );
  }

  createBridge(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    id?: string | number
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
              props.tileName || textures[0]
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
      }
    );

    setTimeout(() => {
      const { upLeftX, upLeftY, rectWidth, rectHeight } =
        scene.extensions.findCorners(bridgeSprites);
      const bridgeBody = scene.add
        .zone(upLeftX, upLeftY, rectWidth, rectHeight)
        .setOrigin(0, 1);
      this.scene.physics.world.enable(
        bridgeBody,
        Phaser.Physics.Arcade.STATIC_BODY
      );

      if (arcadeBodyGuard(bridgeBody.body)) {
        bridgeBody.body.setAllowGravity(false).setImmovable().setFriction(0, 0);
        bridgeBody.body.moves = false;
      }

      scene.physics.add.collider(player, bridgeBody, () => {});
    }, duration);
  }
}
