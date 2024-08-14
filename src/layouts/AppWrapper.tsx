import appStore from "@/store/app";
import { SPELoading } from "@/ui/SPEMisc";
import React from "react";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = appStore();

  return (
    <div style={{ width: "100vw" }}>
      {loading && <SPELoading />}
      {children}
    </div>
  );
}
