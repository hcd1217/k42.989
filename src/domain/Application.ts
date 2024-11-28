import { Application, Menu } from "@/common/types";
import { get } from "lodash";
export type {
  Application,
  ApplicationFooter,
  Menu,
} from "@/common/types";

export type MenuType = "link" | "group" | "panel";

export function getLogo(data?: Application): string {
  return get(data, "applications.logo.pc") as string;
}

export function getHeaderMenu(data?: Application): Menu[] {
  return get(data, "applications.layout.header.common.menu", []);
}
