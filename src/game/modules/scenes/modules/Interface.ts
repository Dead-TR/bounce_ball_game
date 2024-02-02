import { progressManager } from "managers";
import DefaultScene from "../Default";

const config = {
  x: 5,
  y: 5,
  width: 16,
  height: 100,
};

export class GameInterface {
  constructor(scene: DefaultScene) {
    this.scene = scene;

    this.prevHpValue = scene.player?.HP || 100;
    this.createHPBar();
  }
  private scene: DefaultScene;
  private hpBar?: Phaser.GameObjects.Sprite;

  private createHPBar() {
    const { height, width, x, y } = config;
    const recGraph = this.scene.add
      .graphics()
      .fillStyle(0xffffff)
      .fillRect(0, 0, width, height);
    recGraph.generateTexture("hpLine", width, height);
    recGraph.destroy();

    this.hpBar = this.scene.add
      .sprite(x, y, "hpLine")
      .setTint(0xff0000)
      .setOrigin(0, 0)
      .setScrollFactor(0);
  }

  private hitId: NodeJS.Timer | null = null;
  private hitTween?: Phaser.Tweens.Tween;
  private hit() {
    let i = 0;

    if (this.hitId === null) {
      const hp = this.scene.player!.HP;
      this.hitId = setInterval(() => {
        const isBlink = !!(i % 2);
        i++;
        this.hpBar?.setTint(isBlink ? 0xffffff : 0xff0000);
        if (i >= 10) {
          this.hpBar?.setTint(0xff0000);
          clearInterval(this.hitId!);
          this.hitId = null;

          this.prevHpValue = hp;
        }
      }, 50);

      const percent = hp / progressManager.getters.hp();
      console.log("🚀 ~ GameInterface ~ hit ~ percent:", percent, hp, progressManager.getters.hp())

      const bridgeAnimation = this.scene.tweens.add({
        targets: this.hpBar,
        scaleY: percent,
        ease: "linear",
        duration: 300,
      });
    }
  }

  private prevHpValue = 100;
  update = () => {
    if (!this.scene.player) return;

    if (this.scene.player?.HP !== this.prevHpValue) {
      this.hit();
    }
  };
}
