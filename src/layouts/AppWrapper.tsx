import React from "react";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
