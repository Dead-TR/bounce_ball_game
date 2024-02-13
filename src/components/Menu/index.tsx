import React, { FC } from "react";

import { PathProvider } from "providers";

import { Route } from "./components";
import css from "./style.module.css";

interface Props {}

export const Main: FC<Props> = ({}) => {
  return (
    <>
      <PathProvider>
        <Route />
      </PathProvider>
    </>
  );
};

export * from "./routes";
