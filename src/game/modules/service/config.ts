import DefaultScene from "../scenes/Default";

const width = 1280;

export const config = {
  type: Phaser.AUTO,
  parent: "game-box",
  width: width,
  height: width * 0.5625,
  scene: [DefaultScene],
  backgroundColor: 0x14003b,
  // transparent: true
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
};
