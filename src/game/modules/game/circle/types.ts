export interface PreloadTypes {
  method: keyof Phaser.Loader.LoaderPlugin;
  data: any[];
}

interface BlockMoveKey {
  blocked: boolean;
  time: number;
}

export interface PlayerParamsConfig {
  blockMove: {
    left: BlockMoveKey;
    right: BlockMoveKey;
  };
}

export interface Tweens {
  show: Phaser.Tweens.Tween;
  hide: Phaser.Tweens.Tween;
}

export interface DialogReplica {
  portrait: string;
  name: string;
  replica: string;
  callback?: () => void;
}

export type Dialog = DialogReplica[];
export type DialogList = Dialog[];
export interface ActiveDialog {
  dialog: Dialog;
  replica: number;
  id?: number;
  isActive?: boolean;

  objects: {
    portrait?: Phaser.GameObjects.Image;
    name?: Phaser.GameObjects.Text;
    text?: Phaser.GameObjects.Text;
  };
}

export type IgnoredDialogs = number[][];

export interface DialogProperties {
  name: "id";
  type: "string";
  value: string;
}

export type TiledObjectProperties = {
  type: "string";
  name: string;
  value: string;
};

export interface UnpackedTiledObjectProperties {
  [name: string]: string;
}

export interface ButtonsProps {
  bridgetId?: string;
  tileName?: string;
}

export interface BridgetProps extends ButtonsProps {
  from?: "bottom" | "top";
}

export interface ObjectWithCorners {
  [key: string]: any;
  x: number;
  y: number;
  width: number;
  height: number;
}
