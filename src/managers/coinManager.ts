import { EventEmitter } from "events";
import { events, saves } from "./config";
import { createListener } from "utils";

class ProgressManager {
  constructor() {
    this.getSavedValues();
  }

  private coins = 0;
  private emitter = new EventEmitter();

  private async getSavedValues() {
    try {
      const coins =
        Number(JSON.parse(localStorage.getItem(saves.coinStorageAmt) || "0")) ||
        0;

      if (coins) this.coins = coins;
    } catch (error) {}
  }

  //#region Listeners
  private coinsListener = (callBack: () => void) =>
    createListener(this.emitter, events.CHANGE_COIN_AMT, callBack);
  private setCoins = (v: number) => {
    this.coins = v;

    localStorage.setItem(saves.coinStorageAmt, JSON.stringify(this.coins));
    this.emitter.emit(events.CHANGE_COIN_AMT, this.coins);
  };
  private getCoins = () => this.coins;

  listeners = {
    coins: this.coinsListener,
  } as const;
  setters = {
    coins: this.setCoins,
  } as const;
  getters = {
    coins: this.getCoins,
  };
  //#endregion Listeners
  addCoin = () => {
    this.setCoins(this.coins + 1);
  };
}

export const progressManager = new ProgressManager();
