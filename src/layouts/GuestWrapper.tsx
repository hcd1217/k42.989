import BRAND from "@/brands";
import { Head } from "@/components/seo";
import React from "react";

const GuestWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Head title={`${BRAND.configs.APP_NAME}`} />
      {children}
    </>
  );
};

export default GuestWrapper;
