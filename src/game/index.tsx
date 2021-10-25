import { useEffect, useLayoutEffect, useState } from "react";

import { renderGame } from "./instance";
import css from "./style.module.css";

let game: Phaser.Game | null = null;

export const Game = () => {
  const [refBox, setRefBox] = useState<HTMLDivElement | null>(null);

  // useLayoutEffect(() => {
  //   if (refBox) {
  //     game = renderGame(refBox.offsetWidth);
  //   }
  // }, [refBox]);

  useEffect(() => {
    if (refBox) {
      setTimeout(() => {
        game = renderGame(refBox.offsetWidth);
      }, 0);
    }

    return () => {
      game?.destroy(true, false);
    };
  });

  return (
    <div className={css.root}>
      <div
        className={css.game}
        id="game-box"
        ref={(ref) => {
          setRefBox(ref);
        }}
      />
    </div>
  );
};
