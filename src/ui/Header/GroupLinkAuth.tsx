import useSPETranslation from "@/hooks/useSPETranslation";
import AppButton from "../Button/AppButton";

export default function GroupLinkAuth() {
  const t = useSPETranslation();

  return (
    <>
      <AppButton
        instancetype="Ghost"
        color="white"
        component="a"
        href="/login"
      >
        {t("Log In")}
      </AppButton>
      <AppButton component="a" href="/register">
        {t("Sign Up")}
      </AppButton>
    </>
  );
}
