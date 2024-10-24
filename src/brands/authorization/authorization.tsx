import { useUser } from "@/hooks/useSPEPollingAPIs";
import { AuthenticationPayload } from "@/types";
import { useCallback } from "react";
import BRAND from "..";

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

export enum ALL_FUTURES {
  "kyc-new" = "kyc-new",
  "login-no-mfa" = "login-no-mfa",
  "kyc-advance" = "kyc-advance",
}

type UserRoleTypes = keyof typeof ROLES;
type FeaturesTypes = keyof typeof ALL_FUTURES;

export const POLICIES = {
  "trade:spot": (user: AuthenticationPayload) => {
    if (user?.id) {
      return true;
    }

    return false;
  },
  "trade:future": (user: AuthenticationPayload) => {
    if (user?.isAdmin && user?.hasMfa) {
      return true;
    }
    return false;
  },
  "feature:show": (feature: FeaturesTypes | string) => {
    return BRAND.configs.APP_FEATURES.includes(feature);
  },
  "feature:show-kyc-advance": (feature: FeaturesTypes | string) => {
    // other logic check
    return BRAND.configs.APP_FEATURES.includes(feature);
  },
};

// Authorization
export const useAuthorization = () => {
  const user = useUser();

  // if (!user?.data?.id) {
  //   throw Error("User does not exist!");
  // }

  const checkAccess = useCallback(
    ({ allowedRoles }: { allowedRoles: UserRoleTypes[] }) => {
      if (allowedRoles && allowedRoles.length > 0) {
        // AS
        return Boolean(user.data?.id) || Boolean(user.data?.isAdmin);

        // Expected
        // return allowedRoles?.includes(
        //   user.data?.role as UserRoleTypes,
        // );
      }

      return true;
    },
    [user],
  );

  return { checkAccess, role: user.data?.role };
};

type RoleType =
  | {
      allowedRoles: UserRoleTypes[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    };
type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & RoleType;

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== "undefined") {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
