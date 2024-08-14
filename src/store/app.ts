import { Language } from "@/services/languages";
import logger from "@/services/logger";
import { create } from "zustand";

type AppStore = {
  language: Language;
  loading: boolean;
  toggleLoading: (_?: boolean) => void;
};

const appStore = create<AppStore>((set) => ({
  loading: true,
  language: Language.EN,
  toggleLoading: (value?: boolean) => {
    logger.trace("Toggling loading", value);
    set((state) => ({ loading: value ?? !state.loading }));
  },
}));

export default appStore;
