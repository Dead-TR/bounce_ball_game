import { Scene } from "phaser";
import { PreloadTypes } from "game/type";

export function preloadData(this: Scene, data: PreloadTypes) {
  Object.keys(data).forEach((key) => {
    const method = key as keyof PreloadTypes;
    const assets = data[method];

    assets?.forEach((content) => {
      // @ts-ignore: Unreachable code error
      const result = this.load[method](...content);
    });
  });
}
