import { PreloadTypes } from "../../game/circle/types";

const assets = "assets/";

export const gameResourcesData: PreloadTypes[] = [
  {
    method: "image",
    data: [
      ["platforms32x32", assets + "platforms/platforms32x32.png"],
      ["playerSprite", assets + "player/body.png"],
      ["playerBody", assets + "player/ball.png"],

      ["dialogCenter", assets + "ui/dialog-2.png"],
      ["dialogLeft", assets + "ui/dialog-1.png"],
      ["dialogRight", assets + "ui/dialog-3.png"],
    ],
  },

  {
    method: "tilemapTiledJSON",
    data: [["map", assets + "levels/default_level.json"]],
  },

  {
    method: "atlas",
    data: [
      [
        "teleport",
        assets + "effects/teleport.png",
        assets + "effects/teleport_atlas.json",
      ],
    ],
  },
];
