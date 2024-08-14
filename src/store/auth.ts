import { AuthenticationPayload } from "@/common/types";
import { masking } from "@/common/utils";
import { avatarUrl } from "@/utils/utility";
import { create } from "zustand";

interface AuthState {
  token?: string;
  isLogin: boolean;
  me?: AuthenticationPayload;
  displayName?: string;
  avatar?: string;
  logout: (_?: boolean) => void;
  setMe: (me: AuthenticationPayload) => void;
}

const authStore = create<AuthState>((set) => ({
  isLogin: false,
  token: localStorage.__TOKEN__ || undefined,
  setMe: (me: AuthenticationPayload) => {
    set({
      me,
      avatar: avatarUrl(me?.avatar),
      isLogin: Boolean(me?.id),
      displayName:
        me?.nickName || masking(me?.email || me?.mobile || ""),
    });
  },
  logout: (reload = true) => {
    delete localStorage.__TOKEN__;
    delete sessionStorage.__TOKEN__;
    sessionStorage.clear();
    set((state) => ({ ...state, token: undefined, me: undefined }));
    reload && window.location.reload();
  },
}));

export default authStore;
