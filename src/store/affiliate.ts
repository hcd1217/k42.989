import {
  referrals,
  referralDetail as _referralDetail,
} from "@/services/apis";
import { RebateDetail, Referral } from "@/types";
import { create } from "zustand";

interface AffiliateState {
  referrals: Referral[];
  fetch: () => void;
  fetchDetail: (
    depositCode: string,
    from: number,
    to: number,
  ) => Promise<RebateDetail[]>;
}

export const affiliateStore = create<AffiliateState>((set) => ({
  referrals: [],
  referralDetail: [],

  async fetch() {
    const _referrals = await referrals();
    set({ referrals: _referrals });
  },

  async fetchDetail(depositCode: string, from: number, to: number) {
    return await _referralDetail(depositCode, from, to);
  },
}));
