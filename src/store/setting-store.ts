import { observable, action, computed } from 'mobx';
import * as dayjs from 'dayjs';

class SettingStore {
  DATEPICKER_FORMAT = 'YYYY-MM';

  @observable timestamp: number;
  @observable datePicker = dayjs().format(this.DATEPICKER_FORMAT);

  @action
  updateDatePicker(value = dayjs().set('year', this.currentYear).set('month', this.currentMonth).format(this.DATEPICKER_FORMAT)) {
    this.datePicker = dayjs(value).format(this.DATEPICKER_FORMAT);
  }

  @action
  updateTimestamp(timestamp: number) {
    this.timestamp = timestamp;
  }

  @computed
  get datePickerParams() {
    const $time = dayjs(this.datePicker);
    return {
      start_at: $time.startOf('month').toISOString(),
      end_at: $time.endOf('month').toISOString()
    }
  }

  @computed
  get currentYear() {
    return dayjs(this.timestamp).year();
  }

  @computed
  get currentMonth() {
    return dayjs(this.timestamp).month();
  }

  @computed
  get datePickerYear() {
    return dayjs(this.datePicker).year();
  }

  @computed
  get datePickerMonth() {
    return dayjs(this.datePicker).month();
  }
}

export const settingStore = new SettingStore;
