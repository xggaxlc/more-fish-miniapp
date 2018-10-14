import { settingStore } from '@store';
import { reaction } from 'mobx';

Component({
  properties: {
    start: {
      type: String,
      value: '',
    },
    end: {
      type: String,
      value: '',
    }
  },

  data: {
    value: ''
  },

  attached() {
    this.setData({ value: settingStore.datePicker });
    this.dispose = reaction(
      () => settingStore.datePicker,
      this.triggerChange.bind(this)
    );
  },

  detached() {
    this.dispose && this.dispose();
  },

  methods: {
    triggerChange(value) {
      this.setData({ value });
      this.triggerEvent('change', value);
    },
    handleDateChange(e) {
      const value = e.detail.value;
      settingStore.updateDatePicker(value);
    }
  }
});
