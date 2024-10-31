import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { AppRouter } from "./router";
import { AppProvider } from "./router/provider";
import useAuthStore from "./store/auth";

export default function App() {
  const { mutate } = useSWRConfig();
  const { me } = useAuthStore();
  useEffect(() => {
    mutate(() => true, undefined, false);
  }, [mutate, me?.id]);

  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
