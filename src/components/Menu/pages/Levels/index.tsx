import React, { FC } from "react";

import { BG } from "components/BG";
import css from "./style.module.css";

interface Props {}

const levels = [0];

for (let i = 1; i <= 80; i++) {
  levels.push(i);
}

export const Levels: FC<Props> = ({}) => {
  return (
    <BG>
      <div className={css.root}> 

      <div className={css.levels}>
        {levels.map((level) => {
          return (
            <button className={css.button}>{level}</button>
            );
          })}
      </div>
          </div>
    </BG>
  );
};
