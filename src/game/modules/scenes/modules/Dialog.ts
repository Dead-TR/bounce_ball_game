import { Scene } from "phaser";
import { Tweens } from "../../game/circle/types";
import { settingsConfig } from "../../game/settingsConfig";

export class Dialog {
  wrapper: Phaser.GameObjects.Container;

  tweens: Tweens;

  constructor(scene: Scene) {
    const { width, height } = scene.game.config;

    const sceneWidth = Number(width);

    const leftBGFrame = scene.add.sprite(0, 0, "dialogLeft").setOrigin(0, 0);

    const rightBGFrame = scene.add
      .sprite(sceneWidth, 0, "dialogRight")
      .setOrigin(0, 0);
    rightBGFrame.setPosition(
      rightBGFrame.x - rightBGFrame.width,
      rightBGFrame.y
    );

    const centerBG = scene.add
      .tileSprite(
        leftBGFrame.width,
        0,
        sceneWidth - leftBGFrame.width - rightBGFrame.width,
        rightBGFrame.height,
        "dialogCenter"
      )
      .setOrigin(0, 0);

    this.wrapper = scene.add
      .container(0, 0)
      .add([leftBGFrame, rightBGFrame, centerBG])
      .setScrollFactor(0)
      .setPosition(0, -centerBG.height);

    const hideTween = scene.tweens.create({
      targets: this.wrapper,

      y: -centerBG.height,
      ease: "Quad.easeInOut",
      repeat: 0,
      duration: settingsConfig.dialogWrapperMoveTime,
    });

    const showTween = scene.tweens.create({
      targets: this.wrapper,
      y: 0,
      ease: "Quad.easeInOut",
      repeat: 0,
      duration: settingsConfig.dialogWrapperMoveTime,
    });

    this.tweens = {
      hide: hideTween,
      show: showTween,
    };
  }

  showDialog() {
    this.tweens.show.play();
  }

  hideDialog() {
    this.tweens.hide.play();
  }
}
