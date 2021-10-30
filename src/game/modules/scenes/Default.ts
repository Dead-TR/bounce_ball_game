import { Scene } from "phaser";
import { preloadData } from "../game/circle/preload";
import { PlayerParamsConfig } from "../game/circle/types";
import { gameResourcesData } from "./assets/preloadData";
import { Player } from "./modules";

export default class DefaultScene extends Scene {
  playerClass: Player | null = null;

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
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("platforms32x32", "platforms32x32");
    const world = map.createLayer(0, tileset, 0, 0);

    this.playerClass = new Player(this, map, world);
  }

  update(time: number, delta: number) {
    this.playerClass?.update(time, delta);
  }
}
