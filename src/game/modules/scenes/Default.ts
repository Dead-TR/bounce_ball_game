import { Scene } from "phaser";

import { preloadData } from "../game";
import { assets, dialogs, gameResourcesData } from "./assets";
import { Dialog, Extensions, Level, Player } from "./modules";

export default class DefaultScene extends Scene {
  player: Player | null = null;
  extensions!: Extensions;
  dialog: Dialog | null = null;
  map: Phaser.Tilemaps.Tilemap | null = null;
  world: Phaser.Tilemaps.TilemapLayer | null = null;

  private levelName: string;

  constructor(levelName: string) {
    super({ key: levelName });

    this.levelName = levelName;
  }

  preload() {
    this.extensions = new Extensions(this);
    preloadData.call(this, [
      ...gameResourcesData,
      {
        method: "tilemapTiledJSON",
        data: [["map", assets + `levels/${this.levelName}.json`]],
      },
    ]);
  }

  create() {
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage(
      "platforms32x32",
      "platforms32x32",
    );
    this.world = this.map.createLayer(0, tileset, 0, 0);

    this.player = new Player(this);
    this.dialog = new Dialog(this, dialogs, 0);
    const level = new Level(this);
  }

  update(time: number, delta: number) {
    this.player?.update(time, delta, this.dialog?.activeDialog?.isActive);
  }
}
