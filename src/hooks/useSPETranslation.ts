import { LanguageContext } from "@/context/LanguageContext";
import { t as _t } from "@/utils/utility";
import { useCallback, useContext } from "react";

export default function useSPETranslation(): (
  key?: string,
  ...args: (string | number)[]
) => string {
  const { dictionary } = useContext(LanguageContext);
  const t = useCallback(
    (key?: string, ...args: (string | number)[]) => {
      return key ? _t(dictionary, key, ...args) : "";
    },
    [dictionary],
  );
  return t;
}
