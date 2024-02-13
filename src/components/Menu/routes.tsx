import { MainMenu, Levels } from "./pages";

import { ExtendedPage } from "./type";

const setGame = (data: ExtendedPage) => data;

export const routes = {
  "/": setGame({
    data: {
      component: MainMenu,
    },
  }),
  levels: setGame({
    data: {
      component: Levels,
    },
  }),
  shop: setGame({
    data: {
      component: MainMenu,
    },
  }),

  "*": setGame({
    data: {
      component: MainMenu,
    },
  }),
} as const;

export type PathList = keyof typeof routes;
