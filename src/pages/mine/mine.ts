import { userStore } from '@store/user-store';
import { observer } from "@store";
import { pullDownRefresh } from '@utils';

observer({
  _needUpdateUserInfo: true,

  props: {
    userStore
  },

  onPullDownRefresh() {
    return pullDownRefresh(userStore.fetchData());
  },
});
