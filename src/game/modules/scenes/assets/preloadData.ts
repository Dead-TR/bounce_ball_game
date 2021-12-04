import { storyConfig } from "game/modules";
import { PreloadTypes } from "game/modules/game/circle";

const assets = "assets/";

const { tal } = storyConfig.characters;

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
      ["dialogNextButton", assets + "ui/dialog-button-next.png"],
      ["dialogSkipButton", assets + "ui/dialog-button-skip.png"],

      //portraits
      [tal.PORTRAIT, assets + "characters/TAL/portrait.png"],

      //objects
      ["trap_h", assets + "enemies/fire.png"],
      ["trap_v", assets + "enemies/fire_2.png"],
    ],
  },

  {
    method: "tilemapTiledJSON",
    data: [["map", assets + "levels/default/level.json"]],
  },

  {
    method: "atlas",
    data: [
      [
        "teleport",
        assets + "effects/teleport.png",
        assets + "effects/teleport_atlas.json",
      ],
      [
        "buttons",
        assets + "buttons/buttons.png",
        assets + "buttons/buttons.json",
      ],
      [
        "bridges",
        assets + "bridges/bridget.png",
        assets + "bridges/bridget.json",
      ],
    ],
  },
];
