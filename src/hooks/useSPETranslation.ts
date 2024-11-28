import { getDictionary } from "@/services/languages";
import { t as _t } from "@/utils/utility";
import { useCallback } from "react";

const dictionary = getDictionary() || {};

export default function useSPETranslation(): (
  key?: string,
  ...args: (string | number)[]
) => string {
  const t = useCallback(
    (key?: string, ...args: (string | number)[]) => {
      return key ? _t(dictionary || {}, key, ...args) : "";
    },
    [],
  );
  return t;
}
