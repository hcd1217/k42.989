import { useEffect } from "react";
import { AppRouter } from "./router";
import { AppProvider } from "./router/provider";

export default function App() {
  useEffect(() => {
    // 6e77fd811bdc9befbc4cede7cc1655ab8d53713da5fcc4163958139b069ce24e
    // service-stopped-may-25-001
    const key = "6e77fd8";
    const value = "11bdc9b";
    if (localStorage.getItem(key) !== value) {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(key, value);
    }
  }, []);

  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
