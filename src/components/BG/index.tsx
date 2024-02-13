import React, { FC } from "react";

import css from "./style.module.css";

interface Props {
  children?: React.ReactNode;
}

export const BG: FC<Props> = ({ children }) => {
  return <div className={css.bg}>{children}</div>;
};
