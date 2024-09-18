import { Application, Dictionary } from "@/common/types";
import EN from "./configs/en.json";
import JA from "./configs/ja.json";

export enum Language {
  EN = "EN",
  JA = "JA",
}

function loadDictionaries(lang: Language) {
  try {
    const information = JSON.parse(localStorage.__INFORMATION__) as Application;
    const dictionaries = information.applications.lang?.dictionaries;
    return {
      [Language.EN]: { ...dictionaries?.en, ...EN },
      [Language.JA]: { ...dictionaries?.ja, ...JA },
    }[lang] as Dictionary;
  } catch (e) {
    delete localStorage.__INFORMATION__;
  }
  return {};
}

export function getDictionary() {
  switch (localStorage.__LANGUAGE__) {
    case Language.EN:
      return loadDictionaries(Language.EN);
    case Language.JA:
      return loadDictionaries(Language.JA);
    default:
      return loadDictionaries(Language.EN);
  }
}
