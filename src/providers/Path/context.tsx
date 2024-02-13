import React from "react";

import { PathContextType } from "./type";

const defaultValues: PathContextType = {
  page: {
    path: "",
    navigate: () => {},
    to: () => {},
    isHavePrevHistory: false,
  },

  defaultLocation: {
    hash: "",
    key: "",
    pathname: "",
    search: "",
    state: {},
  },
};

export const Context = React.createContext<PathContextType>(defaultValues);
