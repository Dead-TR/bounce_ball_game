import { PathList } from "components";
import { Location, NavigateFunction } from "react-router";

export interface PathContextType {
  page: {
    path: string;
    navigate: NavigateFunction;
    to: (path: PathList) => void;
    isHavePrevHistory: boolean;
  };

  defaultLocation: Location;
}
