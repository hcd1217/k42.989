import BRAND from "@/brands";
import { Head } from "@/components/seo";
import React, { useEffect } from "react";

const GuestWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (localStorage.__TOKEN__) {
      window.location.href = "/";
    }
  }, []);
  return (
    <>
      <Head title={`${BRAND.configs.APP_NAME}`} />
      {children}
    </>
  );
};

export default GuestWrapper;
