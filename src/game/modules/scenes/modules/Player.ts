import { PlayerParamsConfig } from "game/type";
import { settingsConfig } from "../../game";
import DefaultScene from "../Default";
import { progressManager } from "managers";

const localName = "coordinates_";
export class Player {
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  playerBody!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  playerVisual!: Phaser.GameObjects.Sprite;
  playerWhite!: Phaser.GameObjects.Sprite;
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
  HP = progressManager.getters.hp();

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
    world: Phaser.Tilemaps.TilemapLayer,
  ) {
    const { playerBounce } = settingsConfig;
    const layer = map.getObjectLayer("player");
    const playerData = layer?.objects[0];

    this.playerBody = scene.physics.add
      .sprite(playerData?.x || 0, playerData?.y || 0, "playerBody")
      .setAlpha(0);

    this.playerVisual = scene.add.sprite(
      this.playerBody.x,
      this.playerBody.y,
      "playerVisual",
    );
    this.playerWhite = scene.add
      .sprite(this.playerBody.x, this.playerBody.y, "playerWhite")
      .setAlpha(0)
      .setDepth(Infinity);

    this.playerBody
      .setBounce(playerBounce)
      .setCircle(this.playerBody.width / 2);
    scene.physics.add.collider(this.playerBody, world);
    this.playerBody.body.setCollideWorldBounds(true);
    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    world.setCollisionByExclusion([-1], true);

    this.cursors = scene.input.keyboard?.createCursorKeys();

    const setDefaultCoordinates = () => {
      this.coordinates = {
        x: this.playerBody.x || 0,
        y: this.playerBody.y || 0,
      };
    };

    try {
      const id = scene.levelName;
      const storeData = localStorage.getItem(`${localName}${id}`);
      if (!storeData) setDefaultCoordinates();
      else {
        const coordinates = JSON.parse(storeData) as Player["coordinates"];
        this.coordinates = coordinates;
      }
    } catch (error) {
      setDefaultCoordinates();
    }
  }

  createCamera(
    scene: DefaultScene,
    map: Phaser.Tilemaps.Tilemap,
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    this.camera = scene.cameras.main;
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.smoothMoveCameraTowards(player);
  }

  smoothMoveCameraTowards(
    target: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null,
    smoothFactor?: number,
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
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    const { x: startX, y: startY } = this.coordinates;
    const { width, height } = player;

    const playerSprite = scene.add.sprite(startX, startY, "playerVisual");
    playerSprite.setAlpha(0.5);
    const fx = playerSprite.preFX?.addDisplacement("diplace", 1, 0.5);
    const createAnchor = scene.add.particles(0, 0, "spark", {
      speed: { min: 0, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.7, end: 0 },
      tint: 0xff00ff,
      blendMode: "ADD",
      lifespan: 250,
      rotate: { min: -180, max: 180 },
      emitting: false,
    });

    const createTeleport = scene.add.particles(0, 0, "spark", {
      speed: { min: 0, max: 250 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      alpha: {
        start: 1,
        end: 0,
        ease: Phaser.Math.Easing.Quadratic.InOut,
      },
      tint: 0x008489,
      blendMode: "ADD",
      lifespan: 400,
      rotate: { min: -180, max: 180 },
      emitting: false,
    });

    scene.tweens.add({
      targets: fx,
      x: -1,
      y: 0.25,
      yoyo: true,
      loop: -1,
      duration: 5000,
      ease: "sine.inout",
    });

    scene.tweens.add({
      targets: playerSprite,
      angle: -360,
      loop: -1,
      duration: 2000,
      ease: "linear",
    });

    scene.tweens.add({
      targets: playerSprite,
      alpha: 0.25,
      loop: -1,
      duration: 3500,
      yoyo: true,
      ease: "sine.inout",
    });

    scene.input.keyboard?.on("keydown-ENTER", () => {
      this.coordinates = {
        x: player.x || 0,
        y: player.y || 0,
      };

      const { x, y } = this.coordinates;
      playerSprite.setPosition(x, y);
      createAnchor.explode(100, x, y);

      try {
        const id = scene.levelName;
        localStorage.setItem(
          `${localName}${id}`,
          JSON.stringify(this.coordinates),
        );
      } catch (error) {}
    });

    scene.input.keyboard?.on("keydown-SPACE", () => {
      const { x, y } = this.coordinates;
      if (player) {
        player.x = x;
        player.y = y;
      }

      createTeleport.explode(300, x, y);
    });
  }

  update(time: number, delta: number, isBlocked?: boolean) {
    this.control(delta, time, isBlocked);
    this.resetBlockMove(time);
    this.controlPlayerBody(delta);
    this.smoothMoveCameraTowards(this.playerBody, 0.9);

    const { x, y } = this.playerVisual;
    this.playerWhite.setPosition(x, y);
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
      this.cursors?.left.isDown &&
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
      this.cursors?.right.isDown &&
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
    if (this.cursors?.up.isDown && !isBlocked) {
      if (this.playerBody.body.blocked.left) {
        this.setBlockMove("left", time);
        this.playerBody.setVelocityX(Math.max(wallJumpXVelocity, oldVelocityX));
        this.playerBody.setVelocityY(-wallJumpYVelocity);
      } else if (this.playerBody.body.blocked.right) {
        this.setBlockMove("right", time);
        this.playerBody.setVelocityX(
          Math.min(-wallJumpXVelocity, oldVelocityX),
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
