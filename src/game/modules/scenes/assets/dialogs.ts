import { DialogList } from "game/type";
import { storyConfig } from "../../game/storyConfig";

const { tal } = storyConfig.characters;

export const dialogs: DialogList = [
  [
    {
      portrait: tal.PORTRAIT,
      name: tal.NAME,
      replica: "Dialog #1",
    },
    {
      portrait: tal.PORTRAIT,
      name: tal.NAME,
      replica: "Dialog #2",
    },
    {
      portrait: tal.PORTRAIT,
      name: tal.NAME,
      replica:
        "Dialog #3 (long): ----------- ############# ---------------------------- +++++++++++++++++++++++++++++++++++ $$$$$$$$$$$$$$$$$$$$ #################### ######################## ##########################",
    },
    {
      portrait: tal.PORTRAIT,
      name: tal.NAME,
      replica: "Dialog #4",
    },
  ],
];
