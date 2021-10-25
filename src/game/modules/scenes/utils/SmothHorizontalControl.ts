import { PlayerController } from "../../game/circle/types";

//@ts-ignore
export const SmoothedHorionztalControl = new Phaser.Class({
  initialize: function SmoothedHorionztalControl(
    speed: number,
    playerController: PlayerController
  ) {
    this.msSpeed = speed;
    this.value = 0;
    this.playerController = playerController;
  },

  moveLeft: function (delta: number) {
    if (this.value > 0) {
      this.reset();
    }
    this.value -= this.msSpeed * delta;
    if (this.value < -1) {
      this.value = -1;
    }
    this.playerController.time.rightDown += delta;
  },

  moveRight: function (delta: number) {
    if (this.value < 0) {
      this.reset();
    }
    this.value += this.msSpeed * delta;
    if (this.value > 1) {
      this.value = 1;
    }
  },

  reset: function () {
    this.value = 0;
  },
});
