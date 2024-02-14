import React, { FC } from "react";

import { ReactComponent as Close } from "assets/close.svg";
import { ReactComponent as Play } from "assets/play.svg";

import css from "./style.module.css";

interface Props {
  onClose: () => void;
  levelId: string;
  doors: number;

  onPlay: () => void;
}

export const CurrentLevelWindow: FC<Props> = ({
  onClose,
  levelId,
  doors,
  onPlay,
}) => {
  return (
    <div className={css.root}>
      <div className={css.header}>
        <div className={css.headerContent}>
          <button className={css.close} onClick={onClose}>
            <Close />
          </button>
          <span className={css.levelName}>Рівень: {levelId}</span>
        </div>
      </div>

      <div className={css.menu}>
        <div className={css.top}>Переходи: {doors}</div>
        <button className={css.playBtn} onClick={onPlay}>
          <Play className={css.playIcon} />
        </button>
      </div>
    </div>
  );
};
