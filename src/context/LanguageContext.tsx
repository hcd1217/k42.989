import {
  Dictionary,
  Language,
  loadDictionaries,
} from "@/services/languages";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

type LanguageContextType = {
  language?: Language;
  dictionary: Dictionary;
  onChangeLanguage?: (selected: Language) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: localStorage.__LANGUAGE__ || Language.EN,
  dictionary: {},
});

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const onChangeLanguage = useCallback(async (language: Language) => {
    localStorage.__LANGUAGE__ = language;
    const dictionary = await loadDictionaries(language);
    setProvider((prev) => ({ ...prev, language, dictionary }));
    // TODO: Add a toast to notify the user that the language has been changed
  }, []);

  const [provider, setProvider] = useState<LanguageContextType>({
    dictionary: {},
    onChangeLanguage,
  });

  useEffect(() => {
    onChangeLanguage(localStorage.__LANGUAGE__ || Language.EN);
  }, [onChangeLanguage]);

  return (
    <LanguageContext.Provider value={provider}>
      {children}
    </LanguageContext.Provider>
  );
}
