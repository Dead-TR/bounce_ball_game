import React, { FC, useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  NavigateOptions,
  To,
  NavigateFunction,
} from "react-router";

import { Context } from "./context";

interface Props {
  children?: React.ReactNode;
}

interface PathState {
  pagePath: string;
}

const modalSplitter = "/modal/";

export const PathProvider: FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPath = () => {
    const { pathname } = location;

    const [pagePath] = pathname.split(modalSplitter) as [string?];

    return {
      pagePath: pagePath || "/",
    };
  };

  const [state, setState] = useState<PathState>({
    ...getPath(),
  });

  useEffect(() => {
    setState((old) => ({
      ...old,
      ...getPath(),
    }));
  }, [location.pathname]);

  const setPath = (to: To, options?: NavigateOptions) => {
    if (location.pathname !== to) {
      if (typeof to === "string") {
        navigate(to, options);
      } else {
        if (location.key === "default") {
          navigate("/", options);
        } else {
          navigate(to, options);
        }
      }
    }
  };

  return (
    <Context.Provider
      value={{
        page: {
          path: state.pagePath,
          navigate: setPath as NavigateFunction,
          to: (path) => setPath(path),
          isHavePrevHistory: location.key !== "default",
        },

        defaultLocation: location,
      }}>
      {children}
    </Context.Provider>
  );
};
