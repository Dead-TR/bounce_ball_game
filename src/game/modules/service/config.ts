import { settingsConfig } from "../game/settingsConfig";
import { Level_0, Level_1 } from "../levels";

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  parent: "game-box",
  height: 720,
  width: 1280,
  scene: [Level_1, Level_0],
  backgroundColor: 0x14003b,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: settingsConfig.gravity },
      debug: true,
    },
  },
};
