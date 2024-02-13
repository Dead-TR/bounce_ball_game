import React, { FC } from "react";
import { Routes as Switch, Route as Nav, Navigate } from "react-router";

import { usePath } from "providers";
import { createRoute } from "components/Menu/utils";

const { pages } = createRoute();

interface Props {
  children?: React.ReactNode;
}
export const Route: FC<Props> = ({}) => {
  const { page } = usePath();
  return (
    <>
      <Switch location={page.path}>
        {pages.map(({ pathName, data }, i) => {
          const { component: Component, redirect } = data;

          const isRedirect = !Component || redirect;

          return (
            <Nav
              key={`routes/${pathName}_${i}`}
              path={pathName}
              element={
                !isRedirect ? <Component /> : <Navigate to={redirect || "/"} />
              }
            />
          );
        })}
      </Switch>
    </>
  );
};
