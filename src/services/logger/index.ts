import { IS_DEV } from "@/domain/config";

const logIt = IS_DEV || localStorage.__LOG_IT__ === "true";

export default {
  error,
  debug,
  trace,
};
const isTrace = false;

function error(...args: unknown[]) {
  // eslint-disable-next-line no-console
  if (logIt) {
    // eslint-disable-next-line no-console
    console.error(`[${new Date().toISOString()}]`, ...args);
  } else {
    // notify to dev
  }
}

function debug(...args: unknown[]) {
  if (logIt) {
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}]`, ...args);
  } else {
    // notify to dev
  }
}

function trace(...args: unknown[]) {
  if (logIt) {
    isTrace &&
      console.trace(`[${new Date().toISOString()}]`, ...args); // eslint-disable-line no-console
  } else {
    // notify to dev
  }
}
