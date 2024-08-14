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
  return children;
};

export default GuestWrapper;
