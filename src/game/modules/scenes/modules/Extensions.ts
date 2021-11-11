import { Scene } from "phaser";

export class Extensions {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  imgFit(img: Phaser.GameObjects.Image, maxWidth: number, maxHeight: number) {
    const widthScale = maxWidth / img.width;
    const heightScale = maxHeight / img.height;

    const scale = Math.min(widthScale, heightScale, 1);

    img.setScale(scale);
  }

  createRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    alpha: number
  ) {
    return this.scene.add
      .graphics()
      .fillStyle(color, alpha)
      .fillRect(x, y, width, height);
  }
}
