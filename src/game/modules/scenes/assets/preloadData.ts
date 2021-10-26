import { PreloadTypes } from "../../game/circle/types";

const assets = "assets/";

export const gameResourcesData: PreloadTypes[] = [
  {
    method: "image",
    data: [
      ["platforms32x32", assets + "platforms/platforms32x32.png"],
      ["playerBody", assets + "player/body.png"],
      ["playerSprite", assets + "player/ball.png"],
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
