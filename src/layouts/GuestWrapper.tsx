import BRAND from "@/brands";
import { Head } from "@/components/seo";
import { useUser } from "@/hooks/useSPEPollingAPIs";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GuestWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (data?.id) {
      navigate("/", {
        replace: true,
      });
    }
  }, [data?.id, navigate]);
  return (
    <>
      <Head title={`${BRAND.configs.APP_NAME}`} />
      {children}
    </>
  );
};

export default GuestWrapper;
