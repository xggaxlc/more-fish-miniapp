import { observable, action } from "mobx";
import * as dayjs from "dayjs";

class SettingStore {
  timestamp: number;
  @observable currentYear = dayjs().year();
  @observable currentMonth = dayjs().month() + 1;

  @action
  setTimestamp(timestamp: number) {
    this.timestamp = timestamp;
    this.currentYear = dayjs(timestamp).year();
    this.currentMonth = dayjs(timestamp).month() + 1;
  }
}

export const settingStore = new SettingStore;
