import { Scene } from "phaser";
import { preloadData } from "../game/circle/preload";
import { PlayerParamsConfig } from "../game/circle/types";
import { gameResourcesData } from "./assets/preloadData";

export default class DefaultScene extends Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;
  playerBody: Phaser.GameObjects.Sprite | null = null;
  coordinates = {
    x: 0,
    y: 0,
  };
  playerParamsConfig: PlayerParamsConfig = {
    blockMove: {
      left: {
        blocked: false,
        time: 0,
      },
      right: {
        blocked: false,
        time: 0,
      },
    },
  };

  camera: Phaser.Cameras.Scene2D.Camera | null = null;

  preload() {
    preloadData.call(this, gameResourcesData);
  }
  create() {
    this.anims.create({
      key: "teleportAnimation",
      frames: "teleport",
      frameRate: 20,
      repeat: 0,
    });

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("platforms32x32", "platforms32x32");
    const layer = map.createLayer(0, tileset, 0, 0);

    layer.setCollisionByExclusion([-1], true);

    this.player = this.physics.add.sprite(100, 100, "playerSprite").setAlpha(0);
    this.playerBody = this.add.sprite(
      this.player.x,
      this.player.y,
      "playerBody"
    );
    this.player.setBounce(0).setCircle(this.player.width / 2);

    this.physics.add.collider(this.player, layer); // створити колізію між ГГ і ігровим оточенням
    this.player.body.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.camera = this.cameras.main; // камера
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.smoothMoveCameraTowards(this.player);

    this.input.keyboard.on("keydown-ENTER", () => {
      this.coordinates = {
        x: this.player?.x || 0,
        y: this.player?.y || 0,
      };
    });

    this.input.keyboard.on("keydown-SPACE", () => {
      const { x, y } = this.coordinates;
      if (this.player) {
        this.player.x = x;
        this.player.y = y;
      }

      const sprite = this.add
        .sprite(x, y, "teleport")
        .play("teleportAnimation")
        .on("complete", () => {
          sprite.destroy();
        });
    });
  }

  control(delta: number, time: number) {
    const maxVelocity = 1000;
    const startedVelocity = 150;
    const flyVelocity = 1;
    const inertion = 80;

    if (this.player?.body && this.cursors) {
      const { velocity } = this.player.body;
      const oldVelocityX = velocity.x;

      ///---- Left
      if (
        this.cursors.left.isDown &&
        !this.playerParamsConfig.blockMove.left.blocked
      ) {
        if (!this.player.body.blocked.none) {
          if (oldVelocityX === 0) {
            velocity.x = -startedVelocity;
          } else if (oldVelocityX > 0) {
            velocity.x = oldVelocityX * -1;
          } else if (velocity.x > maxVelocity * -1) {
            velocity.x -= delta / 2.5;
          }
        } else {
          velocity.x -= flyVelocity;
        }

        ///---- Right
      } else if (
        this.cursors.right.isDown &&
        !this.playerParamsConfig.blockMove.right.blocked
      ) {
        if (!this.player.body.blocked.none) {
          if (oldVelocityX === 0) {
            velocity.x = startedVelocity;
          } else if (oldVelocityX < 0) {
            velocity.x = oldVelocityX * -1;
          } else if (velocity.x < maxVelocity) {
            velocity.x += delta / 2.5;
          }
        } else {
          velocity.x += flyVelocity;
        }
        ///---- None
      } else {
        if (this.player.body.blocked.down) {
          if (velocity.x > inertion) {
            velocity.x -= delta * 2;
          } else if (velocity.x < -inertion) {
            velocity.x += delta * 2;
          } else {
            velocity.x = 0;
          }
        } else {
          if (velocity.x > inertion) {
            velocity.x *= delta * 0.06;
          } else if (velocity.x < -inertion) {
            velocity.x *= delta * 0.06;
          } else {
            velocity.x = 0;
          }
        }
      }

      ///---- Up
      if (this.cursors.up.isDown) {
        if (this.player.body.blocked.left) {
          this.setBlockMove("left", time);
          this.player.setVelocityX(1000);
          this.player.setVelocityY(-500);
        } else if (this.player.body.blocked.right) {
          this.setBlockMove("right", time);
          this.player.setVelocityX(-1000);
          this.player.setVelocityY(-500);
        } else if (!this.player.body.blocked.none) {
          this.player.setVelocityY(-300);
        }
      }
    }
  }

  setBlockMove(direction: keyof PlayerParamsConfig["blockMove"], time: number) {
    const { blockMove } = this.playerParamsConfig;
    blockMove[direction].blocked = true;
    blockMove[direction].time = time;
  }

  resetBlockMove(time: number) {
    const blockWhile = 500; //ms
    const { left, right } = this.playerParamsConfig.blockMove;

    const canLeftMove = time - left.time > blockWhile;

    const canRightMove = time - right.time > blockWhile;

    if (canLeftMove) {
      left.blocked = false;
    }

    if (canRightMove) {
      right.blocked = false;
    }
  }

  controlPlayerBody(delta: number) {
    if (this.player && this.playerBody) {
      this.playerBody.x = this.player.x;
      this.playerBody.y = this.player.y;

      if (this.player.body.velocity.x) {
        this.playerBody.angle += delta * 0.003 * this.player.body.velocity.x;
      }
    }
  }

  update(time: number, delta: number) {
    this.control(delta, time);
    this.resetBlockMove(time);
    this.controlPlayerBody(delta);
    // const matterBody = this.playerController?.matterBody;
    // const matterSprite = this.playerController?.matterSprite;
    // if (matterBody && matterSprite && this.playerController) {
    //   matterSprite?.setPosition(matterBody.x, matterBody.y);
    //   let oldVelocityX = 0;
    //   let targetVelocityX = 0;
    //   let newVelocityX = 0;

    //   if (this.cursors?.left.isDown && !this.playerController.blocked.left) {
    //     this.smoothedControls.moveLeft(delta);
    //     // Lerp the velocity towards the max run using the smoothed controls. This simulates a
    //     // player controlled acceleration.
    //     oldVelocityX = matterBody.body.velocity.x;
    //     targetVelocityX = -this.playerController.speed.run;
    //     newVelocityX = Phaser.Math.Linear(
    //       oldVelocityX,
    //       targetVelocityX,
    //       -this.smoothedControls.value
    //     );
    //     matterBody.setVelocityX(newVelocityX);
    //   } else if (
    //     this.cursors?.right.isDown &&
    //     !this.playerController?.blocked.right
    //   ) {
    //     this.smoothedControls.moveRight(delta);
    //     // Lerp the velocity towards the max run using the smoothed controls. This simulates a
    //     // player controlled acceleration.
    //     oldVelocityX = matterBody.body.velocity.x;
    //     targetVelocityX = this.playerController?.speed.run;
    //     newVelocityX = Phaser.Math.Linear(
    //       oldVelocityX,
    //       targetVelocityX,
    //       this.smoothedControls.value
    //     );
    //     matterBody.setVelocityX(newVelocityX);
    //   } else {
    //     this.smoothedControls.reset();
    //   }
    //   var canJump = time - this.playerController.lastJumpedAt > 250; //як часто можна повторювати стрибок
    //   if (this.cursors?.up.isDown && canJump) {
    //     if (this.playerController.blocked.bottom) {
    //       matterBody.setVelocityY(-this.playerController.speed.jump);
    //       this.playerController.lastJumpedAt = time;
    //     } else if (this.playerController.blocked.left) {
    //       // Jump up and away from the wall
    //       matterBody.setVelocityY(-this.playerController.speed.jump);
    //       matterBody.setVelocityX(this.playerController.speed.run);
    //       this.playerController.lastJumpedAt = time;
    //     } else if (this.playerController.blocked.right) {
    //       // Jump up and away from the wall
    //       matterBody.setVelocityY(-this.playerController.speed.jump);
    //       matterBody.setVelocityX(-this.playerController.speed.run);
    //       this.playerController.lastJumpedAt = time;
    //     }
    //   }
    //   if (matterBody.body.velocity.x > 0) {
    //     matterSprite.setAngle(matterSprite.angle + 10);
    //   } else if (matterBody.body.velocity.x < 0) {
    //     matterSprite.setAngle(matterSprite.angle - 10);
    //   }
    this.smoothMoveCameraTowards(this.player, 0.9);
    // }
  }

  smoothMoveCameraTowards(
    target: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null,
    smoothFactor?: number
  ) {
    if (this.camera && target) {
      if (smoothFactor === undefined) {
        smoothFactor = 0;
      }
      this.camera.scrollX =
        smoothFactor * this.camera.scrollX +
        (1 - smoothFactor) * (target.x - this.camera.width * 0.5);
      this.camera.scrollY =
        smoothFactor * this.camera.scrollY +
        (1 - smoothFactor) * (target.y - this.camera.height * 0.5);
    }
  }
}
