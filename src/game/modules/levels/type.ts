import DefaultScene from "../scenes/Default";

export interface MenuLevelState {
  level: typeof DefaultScene;
  name: string;
  id: string;

  doors: number | string;
  isAvailable?: boolean;
}

export interface OnFinishState {
  onFinish?: () => void;
}
