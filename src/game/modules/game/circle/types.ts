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
