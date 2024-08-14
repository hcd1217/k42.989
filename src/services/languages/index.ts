import { delay } from "@/utils";
import EN from "./configs/en.json";
import JA from "./configs/ja.json";

export enum Language {
  EN = "EN",
  JA = "JA",
}

export type Dictionary = Record<string, string>;

export async function loadDictionaries(lang: Language) {
  await delay(10);
  return {
    [Language.EN]: EN,
    [Language.JA]: JA,
  }[lang] as Dictionary;
}

export function getDictionary() {
  switch (localStorage.__LANGUAGE__) {
    case Language.EN:
      return EN;
    case Language.JA:
      return JA;
    default:
      return EN;
  }
}
