import { CopyMasterDetail } from "@/common/types";
import { create } from "zustand";

interface CopyState {
  master?: {
    information: CopyMasterDetail;
  };
  // loadMaster: () => Promise<void>;
}

const copyStore = create<CopyState>(() => ({
  // loadMaster: async () => {
  //   const information = await fetchMyMasterDetail();
  //   set({ master: { information } });
  // },
}));

export default copyStore;
