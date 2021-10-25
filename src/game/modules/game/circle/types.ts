export interface PreloadTypes {
  method: keyof Phaser.Loader.LoaderPlugin;
  data: any[];
}

export interface PlayerController {
  matterBody: Phaser.Physics.Matter.Sprite;
  matterSprite: Phaser.GameObjects.Sprite;
  blocked: {
    left: boolean;
    right: boolean;
    bottom: boolean;
  };
  numTouching: {
    left: number;
    right: number;
    bottom: number;
  };
  sensors: {
    bottom: null;
    left: null;
    right: null;
  };
  time: {
    leftDown: number;
    rightDown: number;
  };
  lastJumpedAt: number;
  speed: {
    run: number;
    jump: number;
  };
}
