import AuthWrapper from "@/layouts/AuthWrapper";
import GuestWrapper from "@/layouts/GuestWrapper";
import { RouteConfig } from "@/types";
import { lazy } from "react";

type GenericProps = Record<string, unknown>;
type RFC = (props?: GenericProps) => React.JSX.Element;
type NoPropsRFC = () => React.JSX.Element;
type Wrapper = React.LazyExoticComponent<RFC>;
type LazyExoticComponent = React.LazyExoticComponent<NoPropsRFC>;
type Config = {
  path: string;
  authOnly?: boolean;
  guestOnly?: boolean;
  element: string | (() => JSX.Element);
  wrapper?: string;
};

// prettier-ignore
export const wrapperMap: Record<string, Wrapper> = {
  HistoryWrapper: lazy(() => import("@/layouts/HistoryWrapper")) as Wrapper,
  ServiceWrapper: lazy(() => import("@/layouts/ServiceWrapper")) as Wrapper,
  TradeWrapper: lazy(() => import("@/layouts/TradeWrapper")) as Wrapper,
  AssetWrapper: lazy(() => import("@/layouts/AssetWrapper")) as Wrapper,
  CopyTradeWrapper: lazy(() => import("@/layouts/CopyTradeWrapper")) as Wrapper,
};

// prettier-ignore
const componentMap: Record<string, LazyExoticComponent> = {
  BlankPage: lazy(() => import("@/routes/blank-page")),
  SendMail: lazy(() => import("@/routes/send-mail")),
  TopPage: lazy(() => import("@/routes/top-page")),
  TopPageInvest: lazy(() => import("@/routes/top-page-invest")),
  PrivacyPolicy: lazy(() => import("@/routes/privacy-policy")),
  About: lazy(() => import("@/routes/about")),
  TermsConditions: lazy(() => import("@/routes/terms-service-conditions")),
  RiskDisclosure: lazy(() => import("@/routes/terms-service-risk-disclosure")),
  CopyTradeInvest: lazy(() => import("@/routes/copy-trade-invest")),
  CopyTradeDetailInvest: lazy(() => import("@/routes/copy-trade-detail-invest")),
  SpotTrade: lazy(() => import("@/routes/spot")),
  FutureTrade: lazy(() => import("@/routes/future")),
  Wallet: lazy(() => import("@/routes/wallet")),
  FiatDeposit: lazy(() => import("@/routes/wallet/history/fiat-deposit")),
  SwapHistory: lazy(() => import("@/routes/wallet/history/swap")),
  DepositHistory: lazy(() => import("@/routes/wallet/history/deposit")),
  WithdrawHistory: lazy(() => import("@/routes/wallet/history/withdraw")),
  OthersHistory: lazy(() => import("@/routes/wallet/history/others")),
  Login: lazy(() => import("@/routes/login")),
  SignUp: lazy(() => import("@/routes/sign-up")),
  ResetPassword: lazy(() => import("@/routes/reset-password")),
  ForgotPassword: lazy(() => import("@/routes/forgot-password")),

  MasterPositions: lazy(() => import("@/routes/copy/master-positions")),
  FollowerPositions: lazy(() => import("@/routes/copy/followers-positions")),
  MasterOrders: lazy(() => import("@/routes/copy/master-orders")),
  MasterTransactions: lazy(() => import("@/routes/copy/master-transactions")),
  MyTraders: lazy(() => import("@/routes/copy/my-traders")),
  MyPositions: lazy(() => import("@/routes/copy/my-positions")),
  MyOrders: lazy(() => import("@/routes/copy/my-orders")),
  MyTransactions: lazy(() => import("@/routes/copy/my-transactions")),

  User: lazy(() => import("@/routes/user")),
  BindGA: lazy(() => import("@/routes/user-bind-ga")),
  ReBindGA: lazy(() => import("@/routes/user-rebind-ga")),
  KYC: lazy(() => import("@/routes/user-kyc")),
  ModifyPassword: lazy(() => import("@/routes/user-modify-password")),
  Inquiry: lazy(() => import("@/routes/inquiry")),
  CopyTradingReferrals: lazy(() => import("@/routes/crypto-copy-invest-information/induction")),
  ReferralProgram: lazy(() => import("@/routes/crypto-copy-invest-information/referral-program"))
};

const configs: Config[] = [
  {
    path: "/",
    element: "TopPageInvest",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/copy-trading",
    element: "CopyTradeInvest",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/copy-trading/:id",
    element: "CopyTradeDetailInvest",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/trade/spot/:base/:quote",
    element: "SpotTrade",
    wrapper: "TradeWrapper",
  },
  {
    path: "/trade/futures/:base/:quote",
    element: "FutureTrade",
    wrapper: "TradeWrapper",
  },
  {
    path: "/wallet",
    element: "Wallet",
    wrapper: "AssetWrapper",
    authOnly: true,
  },
  {
    path: "/wallet/records/swap",
    element: "SwapHistory",
    wrapper: "HistoryWrapper",
    authOnly: true,
  },
  {
    path: "/wallet/records/deposit",
    element: "DepositHistory",
    wrapper: "HistoryWrapper",
    authOnly: true,
  },
  {
    path: "/wallet/records/fiat-deposit",
    element: "FiatDeposit",
    wrapper: "HistoryWrapper",
    authOnly: true,
  },
  {
    path: "/wallet/records/withdraw",
    element: "WithdrawHistory",
    wrapper: "HistoryWrapper",
    authOnly: true,
  },
  {
    path: "/wallet/records/others",
    element: "OthersHistory",
    wrapper: "HistoryWrapper",
    authOnly: true,
  },
  {
    path: "/login",
    element: "Login",
    guestOnly: true,
  },
  {
    path: "/register",
    element: "SignUp",
    guestOnly: true,
  },
  {
    path: "/reset-password",
    element: "ResetPassword",
    guestOnly: true,
  },
  {
    path: "/forgot-password",
    element: "ForgotPassword",
    guestOnly: true,
  },
  {
    path: "/copy/master/positions",
    element: "MasterPositions",
    wrapper: "CopyTradeWrapper",
    authOnly: true,
  },
  {
    path: "/copy/master/followers",
    element: "FollowerPositions",
    wrapper: "CopyTradeWrapper",
    authOnly: true,
  },
  {
    path: "/copy/master/orders",
    element: "MasterOrders",
    wrapper: "CopyTradeWrapper",
    authOnly: true,
  },
  {
    path: "/copy/master/transactions",
    element: "MasterTransactions",
    wrapper: "CopyTradeWrapper",
    authOnly: true,
  },
  {
    path: "/copy/mine/traders",
    element: "MyTraders",
    wrapper: "CopyTradeWrapper",
    authOnly: true,
  },
  {
    path: "/copy/mine/positions",
    element: "MyPositions",
    wrapper: "CopyTradeWrapper",
    authOnly: true,
  },
  {
    path: "/copy/mine/orders",
    element: "MyOrders",
    wrapper: "CopyTradeWrapper",
    authOnly: true,
  },
  {
    path: "/copy/mine/transactions",
    element: "MyTransactions",
    wrapper: "CopyTradeWrapper",
    authOnly: true,
  },
  {
    path: "/user",
    element: "User",
    wrapper: "TradeWrapper",
    authOnly: true,
  },
  {
    path: "/user/bind-ga",
    element: "BindGA",
    wrapper: "TradeWrapper",
    authOnly: true,
  },
  {
    path: "/user/rebind-ga",
    element: "ReBindGA",
    wrapper: "TradeWrapper",
    authOnly: true,
  },
  {
    path: "/user/kyc",
    element: "KYC",
    wrapper: "TradeWrapper",
    authOnly: true,
  },
  {
    path: "/user/modify-password",
    element: "ModifyPassword",
    wrapper: "TradeWrapper",
    authOnly: true,
  },

  {
    path: "/privacy-policy",
    element: "PrivacyPolicy",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/terms-conditions",
    element: "TermsConditions",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/risk-disclosure",
    element: "RiskDisclosure",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/about",
    element: "About",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/inquiry",
    element: "Inquiry",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/referer",
    element: "CopyTradingReferrals",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/referral-program",
    element: "ReferralProgram",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/cN9GE38RkCsh37p/send-mail",
    element: "SendMail",
    wrapper: "ServiceWrapper",
  },
  {
    path: "/*",
    element: "BlankPage",
  },
];

export default configs.map(_buildRouteConfig);

function _buildRouteConfig(config: Config): RouteConfig {
  const Component =
    typeof config.element === "string"
      ? componentMap[config.element]
      : config.element;
  const Wrapper = wrapperMap[config.wrapper || ""];
  let element = Wrapper ? (
    <Wrapper>
      <Component />
    </Wrapper>
  ) : (
    <Component />
  );
  if (config.authOnly) {
    element = <AuthWrapper>{element}</AuthWrapper>;
  } else if (config.guestOnly) {
    element = <GuestWrapper>{element}</GuestWrapper>;
  }
  return { path: config.path, element };
}
