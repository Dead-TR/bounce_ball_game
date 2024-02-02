import { Scene } from "phaser";

import { preloadData } from "../game";
import { assets, dialogs, gameResourcesData, tileSets } from "./assets";
import { Dialog, Extensions, Level, Player, GameInterface } from "./modules";

export default class DefaultScene extends Scene {
  player: Player | null = null;
  dialog: Dialog | null = null;
  level: Level | null = null;
  interface: GameInterface | null = null;
  extensions!: Extensions;

  map: Phaser.Tilemaps.Tilemap | null = null;
  world: Phaser.Tilemaps.TilemapLayer | null = null;
  visual: Phaser.Tilemaps.TilemapLayer | null = null;

  levelName: string;

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
    console.log("🚀 ~ DefaultScene ~ create ~ this.map:", this.map);
    const layersTilesets = tileSets
      .map((name) => {
        return this.map?.addTilesetImage(name, name);
      })
      .filter((v) => !!v) as Phaser.Tilemaps.Tileset[];

    if (!layersTilesets.length)
      throw `wrong tileset data: ${JSON.stringify(layersTilesets)}`;

    this.world = this.map.createLayer("level", layersTilesets, 0, 0);
    this.visual = this.map.createLayer("visual", layersTilesets, 0, 0);

    this.player = new Player(this);
    this.dialog = new Dialog(this, dialogs, 0);
    this.level = new Level(this);
    this.interface = new GameInterface(this);
  }

  private restart = false;
  dead() {
    if (this.restart) return;

    this.restart = true;
    this.tweens.add({
      targets: this.cameras.main,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        setTimeout(() => {
          this.restart = false;
          this.scene.restart();
        }, 500);
      },
    });
  }

  update(time: number, delta: number) {
    this.player?.update(
      time,
      delta,
      this.dialog?.activeDialog?.isActive ||
        this.level?.overlap ||
        this.restart,
    );

    this.interface?.update();
  }
}
