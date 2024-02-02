import { settingsConfig } from "../game/settingsConfig";
import { Level } from "../levels";

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-box",
  height: 720,
  width: 1280,
  scene: [Level],
  backgroundColor: 0x14003b,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: settingsConfig.gravity },
      // debug: true,
    },
  },
};
