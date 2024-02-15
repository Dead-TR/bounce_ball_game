import React, { FC, useLayoutEffect } from "react";
import { MenuLevelState, createGame } from "game";

import css from "./style.module.css";

interface Props {
  level: MenuLevelState;
}


export const PlayWindow: FC<Props> = ({ level }) => {
  useLayoutEffect(() => {
    const { level: LevelScene } = level;
    const game = createGame(LevelScene);

    return () => {
      game.destroy(true);
    };
  }, [level]);

  return (
    <div className={css.root}>
      <div className={css.game} id="game-box" />
    </div>
  );
};
