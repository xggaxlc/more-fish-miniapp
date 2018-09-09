import { userStore } from '@store';
import { autoLoading } from '@utils';

Component({
  externalClasses: ['button-class'],
  properties: {
    title: {
      type: String,
      value: '提交'
    },
    userInfoUpdated: {
      type: Boolean,
      value: false
    }
  },

  methods: {

    handleTriggerSubmit() {
      this.triggerEvent('submit');
    },

    async handleGetUserInfo(e) {
      try {
        const { userInfo } = e.detail;
        if (userInfo) {
          await autoLoading(userStore.updateUser(userInfo));
          this.handleTriggerSubmit();
        }
      } catch (e) {
        throw e;
      }
    }
  }
});
