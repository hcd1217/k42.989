import { Language } from "@/services/languages";
import logger from "@/services/logger";
import { create } from "zustand";

type AppStore = {
  language: Language;
  loading: boolean;
  toggleLoading: (_?: boolean) => void;
};

let timer: NodeJS.Timeout;

const appStore = create<AppStore>((set, get) => ({
  loading: true,
  language: Language.EN,
  toggleLoading: (value?: boolean) => {
    if (timer) {
      clearTimeout(timer);
    }
    logger.trace("Toggling loading", value);
    set((state) => ({ loading: value ?? !state.loading }));
    timer = setTimeout(() => {
      if (get().loading) {
        set({ loading: false });
      }
    }, 5e3);
  },
}));

export default appStore;
