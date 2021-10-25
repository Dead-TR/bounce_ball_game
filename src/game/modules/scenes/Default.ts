import { Scene } from "phaser";
import { preloadData } from "../game/circle/preload";
import { PlayerController } from "../game/circle/types";
import { gameResourcesData } from "./assets/preloadData";
import { SmoothedHorionztalControl } from "./utils/SmothHorizontalControl";

export default class DefaultScene extends Scene {
  playerController: PlayerController | null = null;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  smoothedControls: typeof SmoothedHorionztalControl | null = null;

  preload() {
    preloadData.call(this, gameResourcesData);
  }
  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("platforms32x32", "platforms32x32");
    const layer = map.createLayer(0, tileset, 0, 0);

    layer.setCollisionByExclusion([-1], true);
    this.matter.world.convertTilemapLayer(layer);

    this.matter.world.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels,
      32
    );
    this.matter.world.createDebugGraphic();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.playerController = {
      matterBody: this.matter.add.sprite(100, 100, "playerBody", 4),
      matterSprite: this.add.sprite(100, 100, "playerSprite", 4).setAlpha(0),

      blocked: {
        left: false,
        right: false,
        bottom: false,
      },
      numTouching: {
        left: 0,
        right: 0,
        bottom: 0,
      },
      sensors: {
        bottom: null,
        left: null,
        right: null,
      },
      time: {
        leftDown: 0,
        rightDown: 0,
      },
      lastJumpedAt: 0,
      speed: {
        run: 10,
        jump: 10,
      },
    };
    const playerController = this.playerController;

    if (playerController) {
      this.smoothedControls = new SmoothedHorionztalControl(
        0.0005,
        playerController
      );

      playerController.matterBody.setAlpha(0);

      //@ts-ignore
      var M = Phaser.Physics.Matter.Matter;
      var w = playerController.matterBody.width;
      var h = playerController.matterBody.height;

      var sx = w / 2; // Розміщення фізики по центрі спрайту
      var sy = h / 2;

      // The player's body is going to be a compound body.
      var playerBody = M.Bodies.rectangle(sx, sy, w, h, {
        //створення фізики тіла для ГГ
        chamfer: {
          // налаштування основного тіла
          radius: sy, //радіус
          // quality: 1, // вершини. не дуже розумію на що впливає
          // qualityMin: 1,
          // qualityMax: 2,
        },
      });
      playerController.sensors.bottom = M.Bodies.rectangle(sx, h, sx, 5, {
        isSensor: true, // вказує, що тіло є сенсором: бачить зіткнення, але не реагує на них
      });
      playerController.sensors.left = M.Bodies.rectangle(
        sx - w * 0.45,
        sy,
        5,
        h * 0.25,
        { isSensor: true }
      );
      playerController.sensors.right = M.Bodies.rectangle(
        sx + w * 0.45,
        sy,
        5,
        h * 0.25,
        { isSensor: true }
      );
      var compoundBody = M.Body.create({
        // всі три тіла об'єднуютьяс
        parts: [
          playerBody,
          playerController.sensors.bottom,
          playerController.sensors.left,
          playerController.sensors.right,
        ],
        friction: 0.01, //тертя
        restitution: 0, // відпружинення
      });

      playerController.matterBody
        .setExistingBody(compoundBody)
        //@ts-ignore
        .setFixedRotation() // заборонити оберти
        .setPosition(100, 100);

      const cam = this.cameras.main; // камера
      cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      this.matter.world.on("beforeupdate", function () {
        // до оновлення -- задає дефолтні значення
        playerController.numTouching.left = 0;
        playerController.numTouching.right = 0;
        playerController.numTouching.bottom = 0;
      });
      this.matter.world.on("collisionactive", function (event: any) {
        // обробка всіх зіткнень !!! Активного кадру
        //@ts-ignore
        var playerBody = playerController.body;
        var left = playerController.sensors.left;
        var right = playerController.sensors.right;
        var bottom = playerController.sensors.bottom;

        for (var i = 0; i < event.pairs.length; i++) {
          var bodyA = event.pairs[i].bodyA;
          var bodyB = event.pairs[i].bodyB;

          if (bodyA === playerBody || bodyB === playerBody) {
            continue;
          } else if (bodyA === bottom || bodyB === bottom) {
            // Standing on any surface counts (e.g. jumping off of a non-static crate).
            playerController.numTouching.bottom += 1;
          } else if (
            (bodyA === left && bodyB.isStatic) ||
            (bodyB === left && bodyA.isStatic)
          ) {
            // Only static objects count since we don't want to be blocked by an object that we
            // can push around.
            playerController.numTouching.left += 1;
          } else if (
            (bodyA === right && bodyB.isStatic) ||
            (bodyB === right && bodyA.isStatic)
          ) {
            playerController.numTouching.right += 1;
          }
        }
      });
      this.matter.world.on("afterupdate", function () {
        // після оновлення
        playerController.blocked.right =
          playerController.numTouching.right > 0 ? true : false;
        playerController.blocked.left =
          playerController.numTouching.left > 0 ? true : false;
        playerController.blocked.bottom =
          playerController.numTouching.bottom > 0 ? true : false;
      });
    }
  }
  update(time: number, delta: number) {
    const matterBody = this.playerController?.matterBody;
    const matterSprite = this.playerController?.matterSprite;
    let oldVelocityX;
    let targetVelocityX;
    let newVelocityX;

    if (matterBody && matterSprite) {
      matterSprite?.setPosition(matterBody.x, matterBody.y);

      if (this.cursors?.left.isDown && !this.playerController?.blocked.left) {
        this.smoothedControls.moveLeft(delta);

        // Lerp the velocity towards the max run using the smoothed controls. This simulates a
        // player controlled acceleration.
        oldVelocityX = matterBody.body.velocity.x;
        targetVelocityX = this.playerController
          ? -this.playerController.speed.run
          : 0;
        newVelocityX = Phaser.Math.Linear(
          oldVelocityX || 0,
          targetVelocityX,
          -this.smoothedControls.value
        );

        matterBody.setVelocityX(newVelocityX);
      } else if (
        this.cursors?.right.isDown &&
        !this.playerController?.blocked.right
      ) {
        this.smoothedControls.moveRight(delta);

        // Lerp the velocity towards the max run using the smoothed controls. This simulates a
        // player controlled acceleration.
        oldVelocityX = matterBody.body.velocity.x;
        targetVelocityX = this.playerController?.speed.run;
        newVelocityX = Phaser.Math.Linear(
          oldVelocityX || 0,
          targetVelocityX || 0,
          this.smoothedControls.value
        );

        matterBody.setVelocityX(newVelocityX);
      } else {
        this.smoothedControls.reset();
      }

      if (this.playerController) {
        var canJump = time - this.playerController.lastJumpedAt > 50;
        if (this.cursors?.up.isDown && canJump) {
          if (this.playerController.blocked.bottom) {
            matterBody.setVelocityY(-this.playerController.speed.jump);
            this.playerController.lastJumpedAt = time;
          } else if (this.playerController.blocked.left) {
            // Jump up and away from the wall
            matterBody.setVelocityY(-this.playerController.speed.jump);
            matterBody.setVelocityX(this.playerController.speed.run);
            this.playerController.lastJumpedAt = time;
          } else if (this.playerController.blocked.right) {
            // Jump up and away from the wall
            matterBody.setVelocityY(-this.playerController.speed.jump);
            matterBody.setVelocityX(-this.playerController.speed.run);
            this.playerController.lastJumpedAt = time;
          }
        }
      }

      if (matterBody.body.velocity.x > 0) {
        matterSprite.setAngle(matterSprite.angle + 10);
      } else if (matterBody.body.velocity.x < 0) {
        matterSprite.setAngle(matterSprite.angle - 10);
      }
    }
  }
}
