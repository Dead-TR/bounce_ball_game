import Phaser from "phaser";
import { config } from "./modules/service/config";

export const renderGame = (w: number) => {
  return new Phaser.Game(config);
};
