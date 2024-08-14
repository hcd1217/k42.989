import { PROFILE_IMAGE_PREFIX } from "@/common/configs";
import logger from "@/services/logger";
import { format, subDays } from "date-fns";
import debounce from "lodash/debounce";

export function reloadWindow(delay = 500) {
  setTimeout(() => {
    window.location.reload();
  }, delay);
}

export function splitAndFormatString(str: string) {
  str = str.replace(/^linkTo/, "");
  str = str.replace(/^click/, "");
  str = str.replace(/^check/, "");
  let result = str.replace(/([a-z])([A-Z])/g, "$1 $2");
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
}

export function debounceBuilder(
  fn: (...args: any[]) => void, // eslint-disable-line
  delay: number,
) {
  return debounce(fn, delay);
}

export function extractPhoneNumber({
  phoneLocale,
  mobile,
}: {
  phoneLocale?: string;
  mobile?: string;
} = {}) {
  logger.trace("extractPhoneNumber", phoneLocale, mobile);
  const region = `+${parseInt(phoneLocale || "1")}`;
  return `${region}${(mobile || "").replace(/^0/g, "")}`;
}

export function extractSuffix(obj: unknown) {
  return (obj as { suffix?: string })?.suffix || "USDT";
}

export function generateUri2FA(
  // cspell:disable
  type: "hotp" | "totp",
  label: string,
  secret: string,
  issuer: string,
  counter: string,
) {
  let s = `otpauth://${type}/${encodeURIComponent(
    label,
  )}?secret=${secret.replace(/ /g, "")}`;

  if (issuer !== "") {
    s += `&issuer=${encodeURIComponent(issuer)}`;
  }
  if (type === "hotp") {
    s += `&counter=${counter || "30"}`;
  }
  // if (advanced_options_checked) {
  //   s += `&algorithm=${algorithm}&digits=${digits}`;
  //   if (type === "totp") {
  //     s += `&period=${period || "30"}`;
  //   }
  // }
  return s;
  // cspell:enable
}

export function isBlur() {
  // eslint-disable-next-line
  // @ts-ignore
  const isBlur = window.__BLUR;
  return isBlur?.toString() === "true";
}

export function valueColor(value: number) {
  if (value === 0) {
    return "";
  }
  return value > 0 ? "green" : "red";
}

export function maskPhone(phone: string) {
  if (!phone) {
    return "";
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

export function maskEmail(email: string) {
  if (!email) {
    return "";
  }
  const [username, domain] = email.split("@");
  const maskedUsername =
    username[0] +
    "*".repeat(username.length - 2) +
    username[username.length - 1];
  const maskedEmail = `${maskedUsername}@${domain}`;
  return maskedEmail;
}

export function avatarUrl(avatar?: string) {
  if (!avatar) {
    return undefined;
  }
  if (avatar.startsWith("http")) {
    return avatar;
  }
  return `${PROFILE_IMAGE_PREFIX}/${avatar}`;
}
export function convertToInternationalFormatPhoneNumber({
  phone,
  phoneLocale,
}: {
  phone?: string;
  phoneLocale: string;
}): string | undefined {
  if (!phone) {
    return undefined;
  }

  const countryCode = phoneLocale.split(" ")[0];

  const formattedPhone = phone.startsWith("0")
    ? phone.slice(1)
    : phone;

  return `${countryCode}${formattedPhone}`;
}

export function getDatesArray(time: number, total: number) {
  const dates = [];
  const currentDate = new Date(time);
  const excludedDates = [format(subDays(currentDate, 2), "dd/MM")];

  for (let i = 0; i < total; i++) {
    const newDate = subDays(currentDate, i);
    const formattedDate = format(newDate, "dd/MM");

    if (!excludedDates.includes(formattedDate)) {
      dates.unshift(formattedDate);
    }
  }

  return dates;
}

export function fmtDate(ts: number) {
  return new Date(ts).toLocaleString("ja-JP");
}
