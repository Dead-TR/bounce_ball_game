import { EventEmitter } from "events";

export type PhysicTypeObject = "circle" | "square" | "bridge";

const events = {
  CHANGE_TYPE: "CHANGE_TYPE",
};

class Emitter {
  constructor() {}

  private emitter = new EventEmitter();

  changeType = (type: PhysicTypeObject) => {
    this.emitter.emit(events.CHANGE_TYPE, type);
  };
  listenType = (callback: (type: PhysicTypeObject) => void) => {
    this.emitter.addListener(events.CHANGE_TYPE, callback);

    return () => {
      this.emitter.removeListener(events.CHANGE_TYPE, callback);
    };
  };
}

export const physicsEmitter = new Emitter();
