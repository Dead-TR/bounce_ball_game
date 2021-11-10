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

  objects: {
    portrait?: Phaser.GameObjects.Image;
    name?: Phaser.GameObjects.Text;
    text?: Phaser.GameObjects.Text;
  };
}

export type IgnoredDialogs = number[][];

const t = [[0, 1, 2]];
