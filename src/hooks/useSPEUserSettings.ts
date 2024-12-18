// cspell:ignore totp
import { generateMfaApi, updateUserApi } from "@/services/apis";
import logger from "@/services/logger";
import authStore from "@/store/auth";
import { GenerateMfaLink, UserUpdateType } from "@/types";
import { error, success } from "@/utils/notifications";
import { generateUri2FA } from "@/utils/utility";
import { UseFormReturnType } from "@mantine/form";
import { useInterval } from "@mantine/hooks";
import { omit } from "lodash";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import useSPETranslation from "./useSPETranslation";

const SECONDS = 60;

type FormType = `${UserUpdateType}`;

const INITIAL_DATA: Record<string, string[]> = {
  [UserUpdateType.ADD_EMAIL]: [
    "Bind Email Successful",
    "Bind Email Has Been Changed successfully.",
    "Bind Email Setup Failed",
    "We couldn't set up your Bind Email. Ensure you have followed the steps correctly and try again.",
  ],
  [UserUpdateType.UPDATE_PASSWORD]: [
    "Password Successfully Changed",
    "Your password has been successfully changed. You can now use your new password to log in.",
    "Password Change Failed",
    "Password modification failed. Please make sure all fields are filled out correctly and that your current password is accurate. If the problem persists, contact support.",
  ],
  [UserUpdateType.UPDATE_ANTI_PHISHING_CODE]: [
    "Anti - Phishing Code Setup Successful",
    "Anti-Phishing Code set up successfully.",
    "Anti-Phishing Code Setup Failed",
    "We couldn't set up your Anti-Phishing Code. Ensure you have followed the steps correctly and try again.",
  ],
  [UserUpdateType.ADD_MFA]: [
    "Google Authenticator Setup Successful",
    "Google Authenticator setup is complete. Please use the app to generate codes and enter them during login for added security.",
    "Google Authenticator Binding Failed",
    "An error occurred while trying to bind Google Authenticator. Please verify the setup instructions and try again.",
  ],
  [UserUpdateType.UPDATE_MFA]: [
    "Google Authenticator update Successful",
    "Google Authenticator update is complete. Please use the app to generate codes and enter them during login for added security.",
    "Google Authenticator Binding Failed",
    "An error occurred while trying to bind Google Authenticator. Please verify the setup instructions and try again.",
  ],
  [UserUpdateType.KYC_DATA]: [
    "KYC Update Successful",
    "Your KYC information has been successfully updated. Please wait for the system to verify your details.",
    "KYC Update Failed",
    "An error occurred while updating your KYC information. Please review your details and try again. If the issue persists, contact support for assistance.",
  ],
};

const useSPEUserSettings = <T>(
  type: FormType,
  onSuccess?: () => void,
) => {
  const t = useSPETranslation();
  const [loading, setLoading] = useState(false);
  const [seconds1, setSeconds1] = useState(SECONDS);
  const [seconds2, setSeconds2] = useState(SECONDS);
  const [linkMfa, setLinkMfa] = useState<GenerateMfaLink>();

  const interval1 = useInterval(
    () =>
      setSeconds1((s) => {
        if (s == 0) {
          interval1.stop();
          return 0;
        }
        return s - 1;
      }),
    1000,
  );
  const interval2 = useInterval(
    () =>
      setSeconds2((s) => {
        if (s == 0) {
          interval2.stop();
          return 0;
        }
        return s - 1;
      }),
    1000,
  );

  const { me } = authStore();
  const navigate = useNavigate();
  const otpAuth = useMemo(() => {
    const secret = linkMfa?.secret ?? ""; // cspell: disable-line
    const label = linkMfa?.label ?? "";
    return {
      value: generateUri2FA(
        "totp",
        label,
        secret,
        localStorage.__APP_NAME__ || "",
        "100",
      ),
      secret,
      label,
    };
  }, [linkMfa]);

  useEffect(() => {
    return () => {
      interval2.stop();
      interval1.stop();
    };
  }, [interval1, interval2]);

  const startSending1 = useCallback((cb: () => void) => {
    setSeconds1(SECONDS);
    cb();
  }, []);
  const startSending2 = useCallback((cb: () => void) => {
    setSeconds2(SECONDS);
    cb();
  }, []);

  const generateMfaLink = useCallback(() => {
    generateMfaApi().then((result) => {
      setLinkMfa(result);
    });
  }, []);

  const onSubmit = useCallback(
    ({
      form,
      values,
    }: {
      form?: UseFormReturnType<T>;
      values?: Record<string, unknown>;
    }) => {
      const [titleS, msgS, titleF, msgF] = (
        INITIAL_DATA[type] || []
      ).map((el) => t(el));
      const formData =
        values ??
        omit((form?.getValues() || {}) as Record<string, unknown>);

      setLoading(true);
      updateUserApi(type as UserUpdateType, formData)
        .then((res) => {
          if (res.data?.result?.success) {
            success(t(titleS), t(msgS));
            form?.setValues(form.values);
            // setTimeout(() => {
            //   window.location.href = "/user";
            // }, 1000);
            navigate("/user");
            onSuccess?.();
          } else {
            error(t(titleF), t(msgF));
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [t, type, onSuccess, navigate],
  );

  const submit = useCallback(
    (
      e: FormEvent,
      form: UseFormReturnType<T>,
      values?: Record<string, unknown>,
    ) => {
      logger.debug("submit", form, values);
      e.preventDefault();
      form.validate();
      if (form.isValid() === false) {
        return false;
      }
      onSubmit({ form, values });
    },
    [onSubmit],
  );

  const submitKycData = useCallback(
    (e: FormEvent, form?: UseFormReturnType<T>) => {
      e.preventDefault();
      form?.validate();
      if (form?.isValid()) {
        const kycData = {
          ...(me?.kycData ?? {}),
          ...form.getValues(),
        };
        if (kycData.dateOfBirth) {
          const dob = `${kycData.dateOfBirth} 12:00:00 GMT+9`;
          kycData.dateOfBirth = new Date(dob)
            .toISOString()
            .slice(0, 10);
        }
        if (kycData?.isRejectedVerification === true) {
          delete kycData["isRejectedVerification"];
          kycData["isPendingVerification"] = true;
        }
        onSubmit({ values: { kycData } });
      }
    },
    [onSubmit, me?.kycData],
  );

  return {
    loading,
    setLoading,
    seconds1,
    setSeconds1,
    seconds2,
    setSeconds2,
    startSending1,
    startSending2,
    submit,
    submitKycData,
    type,
    me,
    SECONDS,
    interval1,
    interval2,
    t,
    generateMfaLink,
    linkMfa,
    otpAuth,
  };
};

export default useSPEUserSettings;
