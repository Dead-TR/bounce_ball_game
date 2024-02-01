import { Scene } from "phaser";

import { preloadData } from "../game";
import { assets, dialogs, gameResourcesData } from "./assets";
import { Dialog, Extensions, Level, Player } from "./modules";

export default class DefaultScene extends Scene {
  player: Player | null = null;
  dialog: Dialog | null = null;
  level: Level | null = null;
  extensions!: Extensions;

  map: Phaser.Tilemaps.Tilemap | null = null;
  world: Phaser.Tilemaps.TilemapLayer | null = null;

  private levelName: string;

  constructor(levelName: string) {
    super({ key: levelName });

    this.levelName = levelName;
  }

  preload() {
    this.extensions = new Extensions(this);
    preloadData.call(this, {
      ...gameResourcesData,
      tilemapTiledJSON: [
        //@ts-ignore
        ...gameResourcesData.tilemapTiledJSON,
        ["map", assets + `levels/${this.levelName}.json`],
      ],
    });
  }

  create() {
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage(
      "platforms32x32",
      "platforms32x32",
    );
    if (!tileset) throw `wrong tileset data: ${JSON.stringify(tileset)}`;
    this.world = this.map.createLayer(0, tileset, 0, 0);

    this.player = new Player(this);
    this.dialog = new Dialog(this, dialogs, 0);
    this.level = new Level(this);
  }

  update(time: number, delta: number) {
    this.player?.update(
      time,
      delta,
      this.dialog?.activeDialog?.isActive || this.level?.overlap,
    );
  }
}
