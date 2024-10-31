import { AppRouter } from "./router";
import { AppProvider } from "./router/provider";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
