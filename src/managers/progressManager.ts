import { EventEmitter } from "events";
import { events, saves } from "./config";
import { createListener } from "utils";

class ProgressManager {
  constructor() {
    this.getSavedValues();
  }

  private state = {
    coins: 0,
    hp: 100,
  };
  private emitter = new EventEmitter();

  private async getSavedValues() {
    try {
      const coins =
        Number(JSON.parse(localStorage.getItem(saves.coinStorageAmt) || "0")) ||
        0;

      if (coins) this.state.coins = coins;
    } catch (error) {}
  }

  //#region Listeners
  private coinsListener = (callBack: () => void) =>
    createListener(this.emitter, events.CHANGE_COIN_AMT, callBack);
  private setCoins = (v: number) => {
    this.state.coins = v;

    localStorage.setItem(
      saves.coinStorageAmt,
      JSON.stringify(this.state.coins),
    );
    this.emitter.emit(events.CHANGE_COIN_AMT, this.state.coins);
  };

  listeners = {
    coins: this.coinsListener,
  } as const;
  setters = {
    coins: this.setCoins,
  } as const;
  getters = {
    coins: () => this.state.coins,
    hp: () => this.state.hp,
  };
  //#endregion Listeners
  addCoin = () => {
    this.setCoins(this.state.coins + 1);
  };
}

export const progressManager = new ProgressManager();
