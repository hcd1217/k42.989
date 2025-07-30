import BN from "./big-number";
import { ONE_HOUR } from "./constants";
import { GenericObject, SPENumber } from "./types";

// Simple seeded random number generator for deterministic output
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    // Convert string seed to number using a simple hash
    this.seed = this.hashString(seed);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Linear Congruential Generator for deterministic randomness
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

export function randomDeterministicKeyPairs(
  uid: string,
  xKey: string,
) {
  const rng = new SeededRandom(uid + xKey);
  const charset =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const generateKey = (prefix: string, keyLength = 64): string => {
    // Use prefix to create different seeds for apiKey vs secretKey
    const keyRng = new SeededRandom(xKey + prefix);
    let result = "";
    for (let i = 0; i < keyLength; i++) {
      const randomIndex = Math.floor(keyRng.next() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  };
  const apiKey = 'xrh2jH' + generateKey("__api1", 26) + uid + generateKey("__api2", 32 - uid.length);
  const secretKey = generateKey("__secret1", 32) + xKey + generateKey("__secret2", 32 - xKey.length);
  return {
    apiKey,
    secretKey,
  };
}

export function randomAddress(chain?: string) {
  let list = "0123456789abcdef".split("");
  let length = 40;
  let prefix = "0x";
  if (chain === "Bitcoin") {
    list =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
        "",
      );
    prefix = "3";
    length = 33;
  }
  if (chain === "TRON network") {
    list =
      "456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
        "",
      );
    prefix = "T";
    length = 33;
  }

  return (
    prefix +
    new Array(length)
      .fill(0)
      .map(() => list[Math.floor(Math.random() * list.length)])
      .join("")
  );
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomString() {
  return (Math.random() + 1).toString(36).substring(7);
}

export function cleanObj<T extends Record<string, unknown>>(obj: T) {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

export function code(length = 6) {
  const list =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
      "",
    );
  return new Array(length)
    .fill(0)
    .map(() => list[Math.floor(Math.random() * list.length)])
    .join("");
}

export function last<T>(arr: T[] = []) {
  return arr.length ? arr[arr.length - 1] : undefined;
}

export function shuffle<T>(arr: T[]) {
  if (arr.length < 2) {
    return arr;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

export function unique<T>(arr: T[]) {
  return [...new Set(arr)];
}

export function chunk<T>(arr: T[], size: number) {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export function buildContentFromTemplate(
  template: string,
  params: Record<string, string | number | boolean>,
) {
  return Object.entries(params).reduce((content, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    return content.replace(regex, value.toString());
  }, template);
}

export function buildOptions<T extends GenericObject>(
  arr: T[],
  key: string,
  value: string,
) {
  return arr.map((item) => ({
    label: item[key] as string,
    value: item[value] as string,
  }));
}

export function freeAmount({
  amount,
  locked,
}: {
  amount?: number | string;
  locked?: number | string;
}) {
  return BN.sub(amount || 0, locked || 0);
}

export function masking(text: string): string {
  if (text.includes("@")) {
    const [username, domain] = text.split("@");
    if (username.length > 6) {
      return `${username.slice(0, 3)}***@${masking(domain)}`;
    }
    return `${username.slice(0, 1)}***@${masking(domain)}`;
  }
  return text.replace(/.(?=.{4})/g, "*");
}

export function priceDisplay(val?: string | number) {
  const _v = Number(val?.toString() || "0");
  return {
    lt: _v > 0,
    isZero: _v === 0,
    sub: _v > 0 ? "+" : _v < 0 ? "" : "",
    color: _v > 0 ? "green" : _v < 0 ? "red" : "",
  };
}

export function groupBy<T extends GenericObject>(
  arr: T[],
  key: string,
): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const group = item[key] as string;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function buildMap<T extends { [s: string]: unknown }>(
  arr: T[],
  key: string,
): Map<string, T> {
  return new Map(arr.map((item) => [item[key] as string, item]));
}

export function buildArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

export function cleanEmpty<T>(arr: (T | undefined | null)[]) {
  return arr.filter((item) => !!item) as T[];
}

export function roundNumber(value: SPENumber, k: number) {
  if (isNaN(Number(value))) {
    return 0;
  }
  return Number(Number(value).toFixed(k));
}

export function endOfMonth(now = 0, timezoneOffset = 9) {
  const offset = timezoneOffset * ONE_HOUR;
  const today = new Date((now || Date.now()) + offset);
  today.setUTCDate(1);
  today.setUTCMonth(today.getUTCMonth() + 1);
  today.setUTCHours(0, 0, 0, 0);
  return today.getTime() - offset - 1;
}

export function beginOfMonth(now = 0, timezoneOffset = 9) {
  const offset = timezoneOffset * ONE_HOUR;
  const today = new Date((now || Date.now()) + offset);
  today.setUTCDate(1);
  today.setUTCHours(0, 0, 0, 0);
  return today.getTime() - offset;
}
