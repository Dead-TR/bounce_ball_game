import {
  ActiveDialog,
  DialogList,
  DialogProperties,
  IgnoredDialogs,
  Tweens,
} from "game/type";
import { Extensions } from ".";
import DefaultScene from "../Default";
import { settingsConfig } from "game/modules/game";

export class Dialog {
  scene: DefaultScene;
  extensions: Extensions;

  wrapper: Phaser.GameObjects.Container;
  tweens: Tweens;

  activeDialog: ActiveDialog | null = null;
  sceneDialogs: DialogList;
  sceneId: number;

  constructor(scene: DefaultScene, dialogs: DialogList, sceneId: number) {
    this.sceneId = sceneId;
    this.sceneDialogs = dialogs;
    this.scene = scene;
    this.extensions = scene.extensions;

    const { width, height } = scene.game.config;
    const sceneWidth = Number(width);

    const leftBGFrame = scene.add.sprite(0, 0, "dialogLeft").setOrigin(0, 0);
    const rightBGFrame = scene.add
      .sprite(sceneWidth, 0, "dialogRight")
      .setOrigin(0, 0);
    rightBGFrame.setPosition(
      rightBGFrame.x - rightBGFrame.width,
      rightBGFrame.y,
    );
    const { buttons } = settingsConfig.dialog;

    const nextButton = scene.add
      .sprite(
        sceneWidth - buttons.margin.right,
        buttons.margin.top,
        "dialogNextButton",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(1, 0);
    const skipButton = scene.add
      .sprite(
        sceneWidth - buttons.margin.right,
        buttons.margin.top * 2 + buttons.height,
        "dialogSkipButton",
      )
      .setInteractive()
      .setScrollFactor(0)
      .setOrigin(1, 0);
    // this.extensions.imgFit(nextButton, buttons.width, buttons.height); //fit img to config size
    // this.extensions.imgFit(skipButton, buttons.width, buttons.height); //fit img to config size

    const { nextDialog, dialogEnd } = this;
    const nextButtonClick = nextDialog.bind(this);
    const skipButtonClick = dialogEnd.bind(this, true);
    nextButton.on("pointerup", nextButtonClick);
    skipButton.on("pointerup", skipButtonClick);

    const centerBG = scene.add
      .tileSprite(
        leftBGFrame.width,
        0,
        sceneWidth - leftBGFrame.width - rightBGFrame.width,
        rightBGFrame.height,
        "dialogCenter",
      )
      .setOrigin(0, 0);

    this.wrapper = scene.add
      .container(0, 0)
      .add([leftBGFrame, rightBGFrame, centerBG, nextButton, skipButton])
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

    this.createDialogTriggers(scene.map);
  }

  tweensPlay(
    tween: Phaser.Tweens.Tween | Phaser.Tweens.Tween[],
    onComplete?: () => void,
  ) {
    let current: Phaser.Tweens.Tween;
    if (Array.isArray(tween)) current = tween[0];
    else current = tween;
    if (onComplete) {
      current.once("complete", () => {
        onComplete && onComplete();
      });
    }
    current.play();
  }

  showDialog(onComplete?: () => void) {
    if (this.activeDialog) {
      this.activeDialog.isActive = true;
    }

    this.tweensPlay(this.tweens.show, onComplete);
  }

  hideDialog(onComplete?: () => void) {
    if (this.activeDialog) {
      this.activeDialog.isActive = false;
    }
    this.tweensPlay(this.tweens.hide, onComplete);
  }

  createConversation(dialogId: number) {
    const activeDialog = this.sceneDialogs[dialogId];
    if (activeDialog) {
      this.activeDialog = {
        dialog: activeDialog,
        replica: 0,
        id: dialogId,
        objects: {},
      };

      const { name, portrait, replica } = activeDialog[0];
      this.createPortrait(portrait);
      this.createName(name);
      this.createText(replica);

      this.showDialog();
    }
  }

  createPortrait(imgName: string) {
    const { height, width, y } = settingsConfig.portraits;
    const firstFrame = this.wrapper.list[0];
    const portrait = this.scene.add
      //@ts-ignore
      .image(firstFrame.width || 25, y, imgName)
      .setOrigin(0);

    this.extensions.imgFit(portrait, width, height);

    this.wrapper.add(portrait);

    if (this.activeDialog) {
      this.activeDialog.objects.portrait = portrait;
    }
  }

  createName(name: string) {
    const { height, width } = settingsConfig.portraits;

    const text = this.scene.make.text({
      x: 0,
      y: 0,
      text: name,
      origin: { x: 0.5, y: 0 },
      style: {
        font: "25px Arial",
        color: settingsConfig.dialog.colors.names,
        wordWrap: {
          width: width,
          useAdvancedWrap: true,
        },
      },
    });

    text.x = 25 + width / 2;
    text.y = height + 30;

    this.wrapper.add(text);

    if (this.activeDialog) {
      this.activeDialog.objects.name = text;
    }
  }

  createText(replica: string) {
    const { y, width: portraitWidth } = settingsConfig.portraits;
    const { buttons, colors } = settingsConfig.dialog;
    const textMargin = 50;
    const text = this.scene.make.text({
      x: portraitWidth + textMargin,
      y: y * 2,
      text: replica,
      origin: { x: 0, y: 0 },
      style: {
        font: "bold 25px Arial",
        color: colors.text,
        wordWrap: {
          width:
            Number(this.scene.game.config.width) -
            textMargin * 2 -
            portraitWidth -
            buttons.width,
          useAdvancedWrap: true,
        },
      },
    });

    this.wrapper.add(text);

    if (this.activeDialog) {
      this.activeDialog.objects.text = text;
    }
  }

  clearDialog() {
    if (this.activeDialog) {
      const { objects } = this.activeDialog;

      objects.name?.destroy();
      objects.portrait?.destroy();
      objects.text?.destroy();
    }
  }

  nextDialog() {
    if (this.activeDialog) {
      const { dialog, replica } = this.activeDialog;
      const actualReplicaNumber = replica + 1;

      if (actualReplicaNumber < dialog.length) {
        const {
          name,
          portrait,
          replica: valueOfReplica,
        } = dialog[actualReplicaNumber];
        this.clearDialog();

        this.createPortrait(portrait);
        this.createName(name);
        this.createText(valueOfReplica);

        this.activeDialog.replica = actualReplicaNumber;
      } else {
        this.dialogEnd();
      }
    }
  }

  dialogEnd(isSkip?: boolean) {
    if (this.activeDialog) {
      const { dialog, replica, id: dialogId } = this.activeDialog;
      const actualReplicaElement = dialog[replica] || dialog[dialog.length - 1];
      actualReplicaElement.callback && actualReplicaElement.callback();
      this.closeDialog();

      if (isSkip && (dialogId || dialogId === 0)) {
        const ignoredDialogs: IgnoredDialogs = JSON.parse(
          localStorage.getItem("ignoredDialogs") || "[]",
        );
        const actualSceneIgnored = ignoredDialogs[this.sceneId] || [];
        actualSceneIgnored.push(dialogId);

        const newActualIgnored = [...new Set(actualSceneIgnored)];
        ignoredDialogs[this.sceneId] = newActualIgnored;

        localStorage.setItem("ignoredDialogs", JSON.stringify(ignoredDialogs));
      }
    }
  }

  closeDialog() {
    const { clearDialog } = this;
    this.hideDialog(clearDialog.bind(this));
  }

  createTrigger(x: number, y: number, width: number, height: number) {
    const debug = settingsConfig.dialog.triggerDebug;
    return this.scene.extensions.createRectangle(
      x,
      y,
      width,
      height,
      0x00ff00,
      debug ? 0.3 : 0,
    );
  }

  createDialogTriggers(map: Phaser.Tilemaps.Tilemap | null) {
    if (map) {
      const layer = map.getObjectLayer("dialogs");
      const triggerObjects = layer?.objects;

      triggerObjects?.forEach(
        ({ x = -100, y = -100, width = 32, height = 32, properties }) => {
          const props: DialogProperties[] = properties;
          const dialogId = Number(
            props.find((value) => value.name === "id")?.value,
          );

          const trigger = this.scene.add.zone(x, y, width, height).setOrigin(0);
          this.scene.physics.world.enable(trigger);
          //@ts-ignore
          trigger.body.setAllowGravity(false);

          //@ts-ignore
          trigger.body.moves = false;

          const { player } = this.scene;
          if (player?.playerBody) {
            this.scene.physics.add.overlap(player.playerBody, trigger, () => {
              this.createConversation(dialogId);
              trigger.destroy();
            });
          }
        },
      );
    }
  }
}
