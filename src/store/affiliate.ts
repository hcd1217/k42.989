import {
  referralDetail as _referralDetail,
  rebate,
} from "@/services/apis";
import { RebateDetail, Referral } from "@/types";
import { create } from "zustand";

interface AffiliateState {
  rebate: {
    overview: {
      rebate: string;
      fee: string;
      ratio: number;
      user: number;
    };
    referrals: Referral[];
  };
  fetch: () => void;
  fetchDetail: (
    depositCode: string,
    from: number,
    to: number,
  ) => Promise<RebateDetail[]>;
}

export const affiliateStore = create<AffiliateState>((set) => ({
  rebate: {
    overview: {
      rebate: "",
      fee: "",
      ratio: 0,
      user: 0,
    },
    referrals: [],
  },
  referralDetail: [],

  async fetch() {
    const _referrals = await rebate();
    set({ rebate: _referrals });
  },

  async fetchDetail(depositCode: string, from: number, to: number) {
    return await _referralDetail(depositCode, from, to);
  },
}));
