export type ButtonTexture = "default" | "pushed";

type Loader = Phaser.Loader.LoaderPlugin
export type PreloadTypes = {
  //@ts-ignore
  [K in keyof Loader]?: Parameters<Loader[K]>[];
};

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
  show: Phaser.Tweens.Tween | Phaser.Tweens.Tween[];
  hide: Phaser.Tweens.Tween | Phaser.Tweens.Tween[];
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
  value: string | number | boolean;
};

export interface UnpackedTiledObjectProperties {
  [name: string]: TiledObjectProperties["value"];
}

export interface ButtonProps {
  id?: string;
  is_wall?: boolean;
  invisible?: boolean;
}

export interface BridgetProps {
  from_top: boolean;
  id?: string | number;
}

export interface ObjectWithCorners {
  [key: string]: any;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type LevelState = Record<
  number | string,
  {
    bridges: {
      sprite: Phaser.GameObjects.TileSprite;
      props: BridgetProps;
    }[];
    body: Phaser.GameObjects.Zone;
  }
>;
