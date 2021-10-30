export const settingsConfig = {
  gravity: 500,
  maxXVelocity: 800,
  startedXVelocity: 250,
  flyXVelocity: 2,
  jumpVelocity: 300,
  inertia: 100,

  wallJumpXVelocity: 500,
  wallJumpYVelocity: 400,

  moveBlockTime: 500, //ms
  playerBounce: 0.2,

  playerAcceleration: (delta: number) => delta / 2,
};
