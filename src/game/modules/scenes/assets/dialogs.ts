import { storyConfig } from "game/modules";
import { DialogList } from "game/modules/game/circle/types";

const { tal } = storyConfig.characters;

export const dialogs: DialogList = [
  [
    {
      portrait: tal.PORTRAIT,
      name: tal.NAME,
      replica: "Hi, my friend",
    },
    {
      portrait: tal.PORTRAIT,
      name: tal.NAME,
      replica: "This is our first dialog",
    },
    {
      portrait: tal.PORTRAIT,
      name: tal.NAME,
      replica:
        "test string: lalalalalala ababagalamaga -sdfdsf -dfsd f -hhfghfgh-jopikdsf ojeo sdfdsf -dfsd f -hhfghfgh-jopikdsf ojeo -*/ s d f dsf -dfsd f -hhfghfgh-jopikdsf ojeo /* sdfdsf -dfsd f -hhfghfgh-jopikdsf ojeo sdfdsf -dfsd f -hhfghfgh-jopikdsf ojeo sdfdsf -dfsd f -hhfghfgh-jopikdsf ojeo sdfdsf -dfsd f -hhfghfgh-jopikdsf ojeo",
    },
    {
      portrait: tal.PORTRAIT,
      name: tal.NAME,
      replica: "Hope you fun",
    },
  ],
];
