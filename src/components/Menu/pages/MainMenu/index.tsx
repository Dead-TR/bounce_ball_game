import React, { FC } from "react";

import { BG } from "components";
import { usePath } from "providers";

import Play from "../../assets/play.svg";
import Shop from "../../assets/shop.svg";

import css from "./style.module.css";

interface Props {}

export const MainMenu: FC<Props> = ({}) => {
  const { page } = usePath();
  return (
    <BG>
      <div className={css.root}>
        <div className={css.top}></div>

        <div className={css.center}>
          <div className={css.left}>
            <button onClick={() => page.to("shop")}>
              <img src={Shop} alt={"Shop"} />
            </button>

            <button onClick={() => page.to("levels")}>
              <img src={Play} alt={"Play"} />
            </button>
          </div>

          <div className={css.right}></div>
        </div>
      </div>
    </BG>
  );
};
