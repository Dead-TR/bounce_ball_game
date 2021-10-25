import DefaultScene from "../scenes/Default";

export const config = {
  type: Phaser.AUTO,
  parent: "game-box",
  height: 720,
  width: 1280,
  scene: [DefaultScene],
  backgroundColor: 0x14003b,
  // transparent: true,
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 1 },
      enableSleep: false,
      debug: true,
    },
  },
};
