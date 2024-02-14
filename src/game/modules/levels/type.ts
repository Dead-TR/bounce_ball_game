import DefaultScene from "../scenes/Default";

export interface MenuLevelState {
  level: typeof DefaultScene;
  name: string;

  doors: number;
}
