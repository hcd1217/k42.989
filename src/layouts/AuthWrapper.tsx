import BRAND from "@/brands";
import { Head } from "@/components/seo";
import React, { useEffect } from "react";

const AuthWrapper = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  useEffect(() => {
    if (!localStorage.__TOKEN__) {
      const currentPath =
        window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(
        currentPath,
      )}`;
    }
  }, []);
  return (
    <>
      <Head title={`${BRAND.configs.APP_NAME} | Authentication`} />
      {children}
    </>
  );
};

export default AuthWrapper;
