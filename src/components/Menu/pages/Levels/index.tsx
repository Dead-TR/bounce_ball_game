import React, { FC, useEffect, useState } from "react";

import { BG } from "components/BG";
import css from "./style.module.css";
import { levels } from "game/modules/levels";
import { MenuLevelState } from "game/modules/levels/type";
import { Dialog } from "components/Dialog";
import { CurrentLevelWindow } from "./components";
import { PlayWindow } from "./components/PlayWindow";
import { savesNames } from "managers/config";
import clsx from "clsx";
import { progressManager } from "managers";

interface Props {}

export const Levels: FC<Props> = ({}) => {
  const [levelsList, setLevelsList] = useState(levels);
  const [preparedLevel, setPreparedLevel] = useState<null | MenuLevelState>(
    null,
  );
  const [playedLevel, setPlayedLevel] = useState<null | MenuLevelState>(null);
  const [showLevelAnimation, setShowLevelAnimation] = useState<string | number>(
    -1,
  );

  const handleClearLevel = () => {
    setPreparedLevel(null);
  };

  useEffect(() => {
    const rm = progressManager.listeners.onFinish((id) => {
      let nextLevel: string | number = "";
      const newLevels = levels.map((level) => {
        if (level.id === id) {
          level.isAvailable = true;
          nextLevel = level.id;
        }
        return level;
      });

      try {
        localStorage.setItem(savesNames.levels, JSON.stringify(newLevels));
      } catch (error) {
        console.error("1", error);
      }

      setLevelsList(newLevels);
      if (nextLevel) setShowLevelAnimation(nextLevel);

      setPlayedLevel(null);
    });

    return () => {
      rm();
    };
  }, []);

  return (
    <BG>
      <div className={css.root}>
        <div className={css.levels}>
          {levelsList.map((state) => {
            const { level, name, id, isAvailable } = state;
            return (
              <button
                key={name + id}
                className={clsx(
                  css.button,
                  !isAvailable && css.disabled,
                  id === showLevelAnimation && css.show,
                )}
                onClick={() => {
                  setPreparedLevel(state);
                }}
                onAnimationEnd={() => {
                  if (id === showLevelAnimation) {
                    setPreparedLevel(state);
                  }
                }}>
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog isOpen={!!preparedLevel} onClose={handleClearLevel}>
        <CurrentLevelWindow
          onClose={handleClearLevel}
          levelId={preparedLevel?.name || ""}
          doors={1}
          onPlay={() => {
            setPlayedLevel(preparedLevel);
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
