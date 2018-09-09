import { userStore } from '@store/user-store';
import { observer } from "@store";

observer({
  _needUpdateUserInfo: true,

  props: {
    userStore
  }
});
