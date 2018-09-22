import { observer, userStore } from "@store";
import { pullDownRefresh } from '@utils';

observer({
  _needUpdateUserInfo: true,
  _needCurrentBookId: true,

  props: {
    userStore
  },

  onPullDownRefresh() {
    return pullDownRefresh(userStore.fetchData());
  },
});
