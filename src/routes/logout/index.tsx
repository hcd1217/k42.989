import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    delete localStorage.__TOKEN__;
    delete sessionStorage.__TOKEN__;
    sessionStorage.clear();
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }, []);
  return <></>;
}
