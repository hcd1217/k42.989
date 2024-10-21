import { useUser } from "@/hooks/useSPEPollingAPIs";
import { SPELoading } from "@/ui/SPEMisc";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const { data, isLoading } = useUser();
  if (isLoading) {
    return <SPELoading />;
  }
  if (!data?.id) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(
          location.pathname,
        )}`}
        replace
      />
    );
  }

  return children;
};
