import React, { useEffect } from "react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (!localStorage.__TOKEN__) {
      const currentPath =
        window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(
        currentPath,
      )}`;
    }
  }, []);
  return children;
};

export default AuthWrapper;
