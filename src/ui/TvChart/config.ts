import { ONE_DAY, ONE_MINUTE } from "@/utils";
import { ResolutionString } from "public/tv/charting_library/charting_library";

export const supported_resolutions = [
  "1",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "360",
  "720",
  "1D",
  "1W",
] as ResolutionString[];

export const intervals: Record<string, string> = {
  "1": "1m",
  "5": "5m",
  "15": "15m",
  "30": "30m",
  "60": "1h",
  "120": "2h",
  "240": "4h",
  "360": "6h",
  "720": "12h",
  "1D": "1d",
  "1W": "1w",
};

export const steps: Record<string, number> = {
  "1": ONE_MINUTE,
  "5": 5 * ONE_MINUTE,
  "15": 15 * ONE_MINUTE,
  "30": 30 * ONE_MINUTE,
  "60": 60 * ONE_MINUTE,
  "120": 120 * ONE_MINUTE,
  "240": 240 * ONE_MINUTE,
  "360": 360 * ONE_MINUTE,
  "720": 720 * ONE_MINUTE,
  "1D": ONE_DAY,
  "1W": ONE_DAY,
};
