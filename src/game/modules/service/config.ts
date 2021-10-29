import DefaultScene from "../scenes/Default";

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-box",
  height: 720,
  width: 1280,
  scene: [DefaultScene],
  backgroundColor: 0x14003b,
  // transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
};
