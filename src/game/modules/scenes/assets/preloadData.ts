import { PreloadTypes } from "game/type";
import { storyConfig } from "../../game/storyConfig";

export const assets = "assets/";

const { tal } = storyConfig.characters;

export const tileSets = ["platforms32x32"];

export const gameResourcesData: PreloadTypes = {
  image: [
    ...(tileSets.map((name) => [
      name,
      `${assets}/levelTiles/${name}.png`,
    ]) as any),
    ["playerBody", assets + "player/body.png"],
    ["playerVisual", assets + "player/ball.png"],
    ["playerWhite", assets + "player/ball_white.png"],

    ["spark", assets + "env/spark.png"],
    ["diplace", assets + "noise.png"],

    ["dialogCenter", assets + "ui/dialog-2.png"],
    ["dialogLeft", assets + "ui/dialog-1.png"],
    ["dialogRight", assets + "ui/dialog-3.png"],
    ["dialogNextButton", assets + "ui/dialog-button-next.png"],
    ["dialogSkipButton", assets + "ui/dialog-button-skip.png"],

    //portraits
    [tal.PORTRAIT, assets + "portraits/TAL/portrait.png"],
  ],
  spritesheet: [
    [
      "coin",
      assets + "env/coin.png",
      { frameWidth: 32, frameHeight: 32, endFrame: 9 },
    ],
  ],
  atlas: [
    ["buttons", assets + "buttons.png", assets + "buttons.json"],
    ["bridges", assets + "bridget.png", assets + "bridget.json"],
    ["button", assets + "env/button.png", assets + "env/button.json"],
  ],
  tilemapTiledJSON: [],
};
