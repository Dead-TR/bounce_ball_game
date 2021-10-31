import { Scene } from "phaser";
import { preloadData } from "../game/circle/preload";
import { gameResourcesData } from "./assets/preloadData";
import { Player } from "./modules";
import { Dialog } from "./modules/Dialog";
import { Extensions } from "./modules/Extensions";

export default class DefaultScene extends Scene {
  player: Player | null = null;
  extensions!: Extensions;
  dialog: Dialog | null = null;

  preload() {
    this.extensions = new Extensions(this);
    preloadData.call(this, gameResourcesData);
  }
  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("platforms32x32", "platforms32x32");
    const world = map.createLayer(0, tileset, 0, 0);

    this.player = new Player(this, map, world);
    this.dialog = new Dialog(this);

    this.input.keyboard.on("keydown-W", () => {
      this.dialog?.hideDialog();
    });
    this.input.keyboard.on("keydown-Q", () => {
      this.dialog?.showDialog();
    });
  }

  update(time: number, delta: number) {
    this.player?.update(time, delta);
  }
}
