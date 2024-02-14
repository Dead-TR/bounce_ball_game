import Phaser from "phaser";

import DefaultScene from "./modules/scenes/Default";
import { settingsConfig } from "./modules";

const isDebug = !!localStorage.getItem("debug");

const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-box",
  height: 720,
  width: 1280,
  // scene: Level,
  backgroundColor: 0x14003b,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: settingsConfig.gravity },
      debug: isDebug,
    },
  },
  pixelArt: true,
  roundPixels: true,
};

export const createGame = (level: typeof DefaultScene) => {
  const config = {
    ...phaserConfig,
    scene: level,
  };
  return new Phaser.Game(config);
};
