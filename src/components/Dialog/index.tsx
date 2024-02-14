import React, { FC } from "react";

import css from "./style.module.css";

interface Props {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Dialog: FC<Props> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className={css.dialog}>
      <div className={css.curtain} onClick={onClose} />
        {children}
    </div>
  );
};
