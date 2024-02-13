import { ComponentType, FC, LazyExoticComponent } from "react";

export interface PageData {
  component?: ComponentType<any> | LazyExoticComponent<ComponentType<any>>;
  redirect?: string;
}

type PageContent = {
  data?: PageData;
};

interface BreadCrumbsPage {
  [path: string]: ExtendedPage;
}

export type ExtendedPage = BreadCrumbsPage | PageContent;

export interface PagesRoute {
  [path: string]: ExtendedPage;
}
