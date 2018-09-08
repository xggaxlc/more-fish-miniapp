import { userStore } from '@store/user-store';
import { observer } from "@store";

observer({
  props: {
    userStore
  },

  onLoad() {
    return userStore.fetchData();
  }
});
