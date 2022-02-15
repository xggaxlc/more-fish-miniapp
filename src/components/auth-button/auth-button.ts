import { userStore } from '@store';
import { autoLoading, wxPromise } from '@utils';

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

    async handleGetUserInfo() {
      const { userInfo } = await wxPromise.getUserProfile({ desc: '用于完善用户资料' });
      if (userInfo) {
        await autoLoading(userStore.updateUser(userInfo));
        this.handleTriggerSubmit();
      }
    }
  }
});
