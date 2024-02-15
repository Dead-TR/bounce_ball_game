import { EventEmitter } from "events";
import { events, savesNames } from "./config";
import { createListener } from "utils";
import { ProgressState } from "./type";

class ProgressManager {
  constructor() {
    this.getSavedValues();
  }

  private state: ProgressState = {
    coins: 0,
    hp: 100,
    keys: [],
  };
  private emitter = new EventEmitter();

  private async getSavedValues() {
    try {
      const coins =
        Number(
          JSON.parse(localStorage.getItem(savesNames.coinStorageAmt) || "0"),
        ) || 0;

      const hp = Number(localStorage.getItem(savesNames.currentHp));
      const keys = JSON.parse(
        localStorage.getItem(savesNames.keysList) || "[]",
      ) as ProgressState["keys"];

      if (coins) this.state.coins = coins;
      if (hp) this.state.hp = hp;
      if (keys?.length) this.state.keys = keys;
    } catch (error) {}
  }

  //#region Listeners
  private coinsListener = (callBack: (v: number) => void) =>
    createListener(this.emitter, events.CHANGE_COIN_AMT, callBack);
  private setCoins = (v: number) => {
    this.state.coins = v;

    localStorage.setItem(
      savesNames.coinStorageAmt,
      JSON.stringify(this.state.coins),
    );
    this.emitter.emit(events.CHANGE_COIN_AMT, this.state.coins);
  };
  private hpListener = (callBack: (v: number) => void) =>
    createListener(this.emitter, events.CHANGE_CURRENT_HP, callBack);
  private setHP = (v: number) => {
    this.state.hp = v;

    localStorage.setItem(savesNames.currentHp, JSON.stringify(this.state.hp));
    this.emitter.emit(events.CHANGE_CURRENT_HP, this.state.hp);
  };
  private keysListener = (callBack: (v: string[]) => void) =>
    createListener(this.emitter, events.CHANGE_KEYS, callBack);
  private setKey = (v: string | string[]) => {
    if (Array.isArray(v)) {
      this.state.keys = v;
    } else {
      this.state.keys.push(v);
    }

    localStorage.setItem(savesNames.keysList, JSON.stringify(this.state.keys));
    this.emitter.emit(events.CHANGE_KEYS, this.state.keys);
  };

  private onFinishListener = (callBack: (nextLevelId: string) => void) =>
    createListener(this.emitter, events.ON_FINISH, callBack);
  private onFinishSetter = (nextLevelId: string) => {
    this.emitter.emit(events.ON_FINISH, nextLevelId);
  };

  listeners = {
    coins: this.coinsListener,
    keys: this.keysListener,
    hp: this.hpListener,

    onFinish: this.onFinishListener,
  } as const;
  setters = {
    coins: this.setCoins,
    keys: this.setKey,
    hp: this.setHP,

    onFinish: this.onFinishSetter,
  } as const;
  getters = {
    coins: () => this.state.coins,
    keys: () => this.state.keys,
    hp: () => this.state.hp,
  };

  //#endregion Listeners
  addCoin = () => {
    this.setCoins(this.state.coins + 1);
  };
}

export const progressManager = new ProgressManager();
