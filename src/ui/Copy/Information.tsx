import { useLocation } from "react-router-dom";
import { FollowerInformation } from "./FollowerInformation";
import { MaterInformation } from "./MaterInformation";

export function CopyInformation() {
  const { pathname } = useLocation();
  return (
    <>
      {pathname.includes("master") ? (
        <MaterInformation />
      ) : (
        <FollowerInformation />
      )}
    </>
  );
}
