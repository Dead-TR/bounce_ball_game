import React, { FC, useEffect, useState } from "react";

import { BG } from "components";
import { usePath } from "providers";

import Play from "assets/play.svg";
import Shop from "assets/shop.svg";

import css from "./style.module.css";
import { progressManager } from "managers";

interface Props {}

export const MainMenu: FC<Props> = ({}) => {
  const { page } = usePath();
  const [coins, setCoins] = useState(() => progressManager.getters.coins());

  useEffect(() => {
    const rm = progressManager.listeners.coins((v) => setCoins(v));
    return () => rm();
  }, []);

  return (
    <BG>
      <div className={css.root}>
        <div className={css.top}>
          <span className={css.coins}>
          Coins: {coins}
          </span>
        </div>

        <div className={css.center}>
          <div className={css.left}>
            <button onClick={() => page.to("shop")}>
              <img src={Shop} alt={"Shop"} />
            </button>

            <button onClick={() => page.to("play")}>
              <img src={Play} alt={"Play"} />
            </button>
          </div>

          <div className={css.right}></div>
        </div>
      </div>
    </BG>
  );
};
