import Phaser from "phaser";
import { config } from "./modules/service/config";

export const renderGame = (w: number) => {
  const newConfig = { ...config, width: w, height: w * 0.5625 };
  return new Phaser.Game(newConfig);
};
