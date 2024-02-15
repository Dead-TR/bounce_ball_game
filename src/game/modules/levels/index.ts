import { savesNames } from "managers/config";
import { Level_0 } from "./_0";
import { Level_1 } from "./_1";
import { Level_2 } from "./_2";
import { Level_3 } from "./_3";
import { MenuLevelState } from "./type";

const list: MenuLevelState[] = [
  {
    level: Level_0,
    name: "0",
    doors: 1,
    isAvailable: true,
    id: "0",
  },
  { level: Level_1, name: "1", doors: 1, id: "1" },
  { level: Level_2, name: "2", doors: 2, id: "2" },
  { level: Level_3, name: "3", doors: 3, id: "3" },
];

try {
  const savedLevels = localStorage.getItem(savesNames.levels);

  if (savedLevels) {
    const parsedLevels = JSON.parse(savedLevels) as MenuLevelState[];
    const savedLevelsData = parsedLevels.reduce(
      (acm, { name, isAvailable }) => {
        acm[name] = !!isAvailable;
        return acm;
      },
      {} as Record<string, boolean>,
    );

    list.forEach((level) => {
      if (savedLevelsData[level.name]) {
        level.isAvailable = savedLevelsData[level.name];
      }
    });
  }
} catch (error) {
  console.error("2", error);
}

export const levels = list;
