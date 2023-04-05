import { Scene } from "phaser";
import {
  ObjectWithCorners,
  TiledObjectProperties,
  UnpackedTiledObjectProperties,
} from "../../game";

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
    alpha: number,
  ) {
    return this.scene.add
      .graphics()
      .fillStyle(color, alpha)
      .fillRect(x, y, width, height);
  }

  getPropsFromObject(props: TiledObjectProperties[]) {
    return props.reduce<UnpackedTiledObjectProperties>(
      (acm, { name, value }) => {
        return {
          ...acm,
          [name]: value,
        };
      },
      {},
    );
  }

  findCorners(list: ObjectWithCorners[]) {
    const upLeftX = Math.min.apply(
      null,
      list.reduce((acm: number[], { x }) => {
        acm.push(x);
        return acm;
      }, []),
    );
    const upLeftY = Math.min.apply(
      null,
      list.reduce((acm: number[], { y }) => {
        acm.push(y);
        return acm;
      }, []),
    );

    const upRightX = Math.max.apply(
      null,
      list.reduce((acm: number[], { x, width }) => {
        acm.push(x + width);
        return acm;
      }, []),
    );
    const upRightY = Math.max.apply(
      null,
      list.reduce((acm: number[], { y, height }) => {
        acm.push(y + height);
        return acm;
      }, []),
    );

    const maxY = Math.max.apply(
      null,
      list.reduce((acm: number[], { y }) => {
        acm.push(y);
        return acm;
      }, []),
    );

    const rectWidth = upRightX - upLeftX;
    const rectHeight = upRightY - upLeftY;
    const x = upLeftX;
    const y = maxY;

    return {
      x,
      y,
      rectWidth,
      rectHeight,
    };
  }
}
