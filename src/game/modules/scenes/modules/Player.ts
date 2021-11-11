import { Scene } from "phaser";
import { PlayerParamsConfig } from "../../game/circle/types";
import { settingsConfig } from "../../game/settingsConfig";
import DefaultScene from "../Default";

export class Player {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  playerBody!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  playerVisual!: Phaser.GameObjects.Sprite;
  camera!: Phaser.Cameras.Scene2D.Camera;
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
  coordinates = {
    x: 0,
    y: 0,
  };

  constructor(scene: DefaultScene) {
    const { world, map } = scene;

    if (map && world) {
      this.createPlayer(scene, map, world);
      this.createCamera(scene, map, this.playerBody);
    }
    this.createTeleport(scene, this.playerBody);
  }

  createPlayer(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    world: Phaser.Tilemaps.TilemapLayer
  ) {
    const { playerBounce } = settingsConfig;
    const layer = map.getObjectLayer("player");
    const playerData = layer.objects[0];

    this.playerBody = scene.physics.add
      .sprite(playerData.x || 0, playerData.y || 0, "playerSprite")
      .setAlpha(0);
    this.playerVisual = scene.add.sprite(
      this.playerBody.x,
      this.playerBody.y,
      "playerBody"
    );
    this.playerBody
      .setBounce(playerBounce)
      .setCircle(this.playerBody.width / 2);
    scene.physics.add.collider(this.playerBody, world);
    this.playerBody.body.setCollideWorldBounds(true);
    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    world.setCollisionByExclusion([-1], true);

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  createCamera(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    this.camera = scene.cameras.main;
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.smoothMoveCameraTowards(player);
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

  createTeleport(
    scene: DefaultScene,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    scene.anims.create({
      key: "teleportAnimation",
      frames: "teleport",
      frameRate: 20,
      repeat: 0,
    });
    scene.input.keyboard.on("keydown-ENTER", () => {
      this.coordinates = {
        x: player.x || 0,
        y: player.y || 0,
      };
    });

    scene.input.keyboard.on("keydown-SPACE", () => {
      const { x, y } = this.coordinates;
      if (player) {
        player.x = x;
        player.y = y;
      }

      const sprite = scene.add
        .sprite(x, y, "teleport")
        .play("teleportAnimation")
        .on("complete", () => {
          sprite.destroy();
        });
    });
  }

  update(time: number, delta: number, isBlocked?: boolean) {
    this.control(delta, time, isBlocked);
    this.resetBlockMove(time);
    this.controlPlayerBody(delta);
    this.smoothMoveCameraTowards(this.playerBody, 0.9);
  }

  controlPlayerBody(delta: number) {
    this.playerVisual.x = this.playerBody.x;
    this.playerVisual.y = this.playerBody.y;

    if (this.playerBody.body.velocity.x) {
      this.playerVisual.angle +=
        delta * 0.003 * this.playerBody.body.velocity.x;
    }
  }

  control(delta: number, time: number, isBlocked?: boolean) {
    const {
      maxXVelocity,
      startedXVelocity,
      flyXVelocity,
      wallJumpXVelocity,
      wallJumpYVelocity,
      jumpVelocity,
      inertia,
      playerAcceleration,
    } = settingsConfig;

    const { velocity } = this.playerBody.body;
    const oldVelocityX = velocity.x;

    ///---- Left
    if (
      this.cursors.left.isDown &&
      !this.playerParamsConfig.blockMove.left.blocked &&
      !isBlocked
    ) {
      if (!this.playerBody.body.blocked.none) {
        if (oldVelocityX === 0) {
          velocity.x = -startedXVelocity;
        } else if (oldVelocityX > 0) {
          velocity.x = oldVelocityX * -1;
        } else if (velocity.x > maxXVelocity * -1) {
          velocity.x -= playerAcceleration(delta);
        } else if (velocity.x >= maxXVelocity * -1) {
          velocity.x = maxXVelocity * -1;
        }
      } else {
        velocity.x -= flyXVelocity;
      }

      ///---- Right
    } else if (
      this.cursors.right.isDown &&
      !this.playerParamsConfig.blockMove.right.blocked &&
      !isBlocked
    ) {
      if (!this.playerBody.body.blocked.none) {
        if (oldVelocityX === 0) {
          velocity.x = startedXVelocity;
        } else if (oldVelocityX < 0) {
          velocity.x = oldVelocityX * -1;
        } else if (velocity.x < maxXVelocity) {
          velocity.x += playerAcceleration(delta);
        } else if (velocity.x >= maxXVelocity) {
          velocity.x = maxXVelocity;
        }
      } else {
        velocity.x += flyXVelocity;
      }
      ///---- None
    } else {
      if (this.playerBody.body.blocked.down) {
        if (velocity.x > inertia) {
          velocity.x -= delta * 2;
        } else if (velocity.x < -inertia) {
          velocity.x += delta * 2;
        } else {
          velocity.x = 0;
        }
      }
    }

    ///---- Up
    if (this.cursors.up.isDown && !isBlocked) {
      if (this.playerBody.body.blocked.left) {
        this.setBlockMove("left", time);
        this.playerBody.setVelocityX(Math.max(wallJumpXVelocity, oldVelocityX));
        this.playerBody.setVelocityY(-wallJumpYVelocity);
      } else if (this.playerBody.body.blocked.right) {
        this.setBlockMove("right", time);
        this.playerBody.setVelocityX(
          Math.min(-wallJumpXVelocity, oldVelocityX)
        );
        this.playerBody.setVelocityY(-wallJumpYVelocity);
      } else if (this.playerBody.body.blocked.down) {
        this.playerBody.setVelocityY(-jumpVelocity);
      }
    }
  }
  setBlockMove(direction: keyof PlayerParamsConfig["blockMove"], time: number) {
    const { blockMove } = this.playerParamsConfig;
    blockMove[direction].blocked = true;
    blockMove[direction].time = time;
  }

  resetBlockMove(time: number) {
    const { moveBlockTime } = settingsConfig; //ms
    const { left, right } = this.playerParamsConfig.blockMove;

    const canLeftMove = time - left.time > moveBlockTime;

    const canRightMove = time - right.time > moveBlockTime;

    if (canLeftMove) {
      left.blocked = false;
    }

    if (canRightMove) {
      right.blocked = false;
    }
  }
}
