import React, { FC, useState } from "react";

import { BG } from "components/BG";
import css from "./style.module.css";
import { levels } from "game/modules/levels";
import { MenuLevelState } from "game/modules/levels/type";
import { Dialog } from "components/Dialog";
import { CurrentLevelWindow } from "./components";
import { PlayWindow } from "./components/PlayWindow";

interface Props {}

export const Levels: FC<Props> = ({}) => {
  const [currentLevel, setCurrentLevel] = useState<null | MenuLevelState>(null);
  const [playedLevel, setPlayedLevel] = useState<null | MenuLevelState>(null);

  const handleClearLevel = () => {
    setCurrentLevel(null);
  };

  return (
    <BG>
      <div className={css.root}>
        <div className={css.levels}>
          {levels.map((state) => {
            const { level, name } = state;
            return (
              <button
                className={css.button}
                onClick={() => {
                  setCurrentLevel(state);
                }}>
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog isOpen={!!currentLevel} onClose={handleClearLevel}>
        <CurrentLevelWindow
          onClose={handleClearLevel}
          levelId={currentLevel?.name || ""}
          doors={1}
          onPlay={() => {
            setPlayedLevel(currentLevel);
            handleClearLevel();
          }}
        />
      </Dialog>

      <Dialog isOpen={!!playedLevel} onClose={() => {}}>
        <PlayWindow level={playedLevel!} />
      </Dialog>
    </BG>
  );
};
