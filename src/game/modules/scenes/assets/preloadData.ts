import { PreloadTypes } from "game/type";
import { storyConfig } from "../../game/storyConfig";

export const assets = "assets/";

const { tal } = storyConfig.characters;

export const gameResourcesData: PreloadTypes = {
  image: [
    ["platforms32x32", assets + "platforms32x32.png"],
    ["playerSprite", assets + "body.png"],
    ["playerBody", assets + "ball.png"],
    ["spark", assets + "env/spark.png"],

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
    ["teleport", assets + "teleport.png", assets + "teleport_atlas.json"],
    ["buttons", assets + "buttons.png", assets + "buttons.json"],
    ["bridges", assets + "bridget.png", assets + "bridget.json"],
    ["button", assets + "env/button.png", assets + "env/button.json"],
  ],
  tilemapTiledJSON: [],
};
