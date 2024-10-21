import BRAND from "@/brands";
import { Head } from "@/components/seo";
import React from "react";

const AuthWrapper = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <>
      <Head title={`${BRAND.configs.APP_NAME} | Authentication`} />
      {children}
    </>
  );
};

export default AuthWrapper;
