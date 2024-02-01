import React, { FC } from "react";
import { physicsEmitter } from "./createEmitter";

interface Props {}

export const Controller: FC<Props> = ({}) => {
  return (
    <div>
      <button
        onClick={() => {
          physicsEmitter.changeType("circle");
        }}>
        Circle
      </button>
      <button
        onClick={() => {
          physicsEmitter.changeType("square");
        }}>
        Square
      </button>
      <button
        onClick={() => {
          physicsEmitter.changeType("bridge");
        }}>
        Bridge
      </button>
    </div>
  );
};
