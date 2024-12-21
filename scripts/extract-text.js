/*
node scripts/extract-text.js
*/

/* eslint-disable no-console */
// cspell:disable
const fs = require("fs");
const { resolve } = require("path");

const ignores_text = Object.fromEntries(
  [
    "Content-Type",
    "API Call",
    "API Key",
    "#",
    "$1",
    "%s",
    "-",
    "/",
    "1.2M",
    "12B",
    "1M+",
    "2.4M",
    "404 - Not Found",
    "@mantine/core",
    "@tabler/icons-react",
    "a",
    "absolute",
    "accounts",
    "actions",
    "ADMIN",
    "api-key",
    "api-secret",
    "application/json",
    "asc",
    "auth:only",
    "auto",
    "auto_enable_symbol_labels",
    "averageClosePrice",
    "averageEntryPrice",
    "averagePrice",
    "Axios Error",
    "balance",
    "balances",
    "BINANCE",
    "black",
    "blue",
    "BNB",
    "bold",
    "bottom",
    "bottom-center",
    "bottom-left",
    "bottom-right",
    "BTC",
    "BTCUSDT",
    "BYBIT",
    "capitalize",
    "center",
    "chartView",
    "closedPnL",
    "closedVolume",
    "coin",
    "column",
    "crypto",
    "D",
    "dark",
    "dashed 1px light-dark(rgba(0, 0, 0, 0.4), gray)",
    "desc",
    "dimmed",
    "easeInOut",
    "ellipsis",
    "email",
    "EN",
    "en",
    "en-US",
    "end",
    "entryPrice",
    "equity",
    "Equity:",
    "Etc/UTC",
    "ETH",
    "ETHUSDT",
    "exchange",
    "Exchange",
    "Features",
    "filledVolume",
    "first",
    "fit-content",
    "flex",
    "FOK",
    "form",
    "green",
    "group",
    "GTC",
    "head",
    "header",
    "header_screenshot",
    "header_symbol_search",
    "hidden",
    "IBM Plex Sans,-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif",
    "JA",
    "json",
    "key",
    "left",
    "left_toolbar",
    "lg",
    "light",
    "margin",
    "market",
    "maxVolume",
    "md",
    "memo",
    "name",
    "none",
    "nowrap",
    "openOrders",
    "orderBook",
    "orders",
    "orderType",
    "PAPER",
    "password",
    "payload",
    "pointer",
    "positions",
    "postOnly",
    "price",
    "Pricing",
    "primary",
    "primary.5",
    "queryFn",
    "queryKey",
    "recentTrade",
    "red",
    "red.5",
    "redirect",
    "reduceOnly",
    "relative",
    "req",
    "resize-complex-example",
    "right",
    "root",
    "rotate(45deg)",
    "row",
    "S3cr3tP@ssw0rd",
    "Sample 1",
    "Secret Key",
    "secret",
    "SegmentedControl-sb",
    "selected tab_item",
    "side",
    "sidebar",
    "sm",
    "space-between",
    "start",
    "status",
    "string",
    "success",
    "SUPER_ADMIN",
    "symbol",
    "symbol_info",
    "symbollist_context_menu",
    "tab_item",
    "tertiary.5",
    "text",
    "timestamp",
    "top-center",
    "top-left",
    "top-right",
    "tradeStatus",
    "tradingview_chart",
    "transparent",
    "true",
    "type",
    "uncontrolled",
    "undefined",
    "unrealizedPnL",
    "unset",
    "user",
    "USER",
    "values",
    "volume",
    "white",
    "widget_logo",
    "wrap",
    "xl",
    "xs",
    "xxx",
    "?",
    ".",
    ")",
    "(",
    ":",
    ",",
    "goNext",
    "goPrev",
    "",
    "=",
    "&",
    "%",
    "http",
    "ja-JP",
    "100vh",
    "mfaCode",
    "idType",
    "sync...",
    "hoverlink",
    "0 0 50%",
    "--",
    "5px 10px",
    "#root",
    "[${new Date().toISOString()}]",
    "HH:mm:ss",
    "data-feed",
    "+81 Japan",
    "月",
    "1,9444.23",
    "106K+",
    "(+3.61%)",
    "*	*	※",
    "****",
    "...reload tabs",
    ".apexcharts-datalabel-label",
    "app-carousel ${props.className}",
    "deposit.address.${params.chain}",
    "fetchAndCache.${key}",
    "fetching open positions",
    "filter...",
    "increase counter...",
    "market.information.${symbol}",
    "md_${item.value}_mn",
    "mine/information",
    "orderbook.${symbol}",
    "table-root ${status}",
    "table-row table-row-default",
    "table-row table-row-default",
    "table-row table-row-reverse",
    "traders:${masterAccountId}",
    "お振込みの際は4桁のコード番号を振込人名義の前にご入力ください【 4桁のコード番号＋振込人名】：",
    "この決済方法は日本国外の銀行からの送金には対応しておりません。",
    "フクカワ（ド",
    "マネーロンダリングを防止するため、入金から1週間が経過し、少なくとも1回の取引が行われない限り、出金手続きは行われません。",
    "京葉銀行",
    "以下の手続きにご注意ください:",
    "普通 9698701",
    "最低入金額は10 USDTです。この金額を下回る入金額は入金されません。",
    "月",
    "<=${triggerPrice}(Last)",
    "船橋 (店番：111)",
    "資金は1営業日以内に入金されます。",
    "{{${key}}}",
    "<=${triggerPrice}(Last)",
  ].map((text) => [text, true]),
);

const _srcPath = resolve(__dirname, "../src/");

const ignore_files = [
  resolve(_srcPath, "routes/privacy-policy/index.tsx"),
  resolve(_srcPath, "routes/terms-service-agreement/index.tsx"),
  resolve(_srcPath, "routes/terms-service-conditions/index.tsx"),
  resolve(_srcPath, "routes/terms-service-risk-disclosure/index.tsx"),
  resolve(_srcPath, "ui/Wallet/TableCoins/FiatDepositModal.tsx"),
];

const ignore_dirs = [
  resolve(_srcPath, "routes/crypto-copy-invest-information/"),
  // resolve(__dirname, "../common"),
];

function extractText(sourceCode) {
  const textList = [];
  const functionCallRegex = /\b\w+\(\s*(['"`])((?:\\\1|.)*?)\1/g;

  const loggerFunctionRegex =
    /^\s*\b(debug|info|warn|error|trace)\s*\(\s*(['"`])/;

  let match;

  while ((match = functionCallRegex.exec(sourceCode)) !== null) {
    const functionCallText = match[2]
      .trim()
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ");

    if (!loggerFunctionRegex.test(match[0])) {
      textList.push(functionCallText);
    }
  }

  const jsxTextRegex =
    /<.*?>([^<>{}]+)<\/.*?>|{['"`]([^'"`]+)['"`]}/g;

  while ((match = jsxTextRegex.exec(sourceCode)) !== null) {
    const jsxText = match[1] || match[2];
    if (jsxText) {
      textList.push(_trim(jsxText));
    }
  }

  function _trim(text) {
    return text
      .trim()
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ");
  }

  return [...new Set(textList)];
}

function regexIgnore(text) {
  return (
    /^function\s+/i.test(text) || // Ignore function names
    /^const\s+/i.test(text) || // Ignore const variables
    /^import\s+/i.test(text) || // Ignore import statements
    /^interface\s+/i.test(text) || // Ignore interface
    /^type\s+/i.test(text) || // Ignore type
    /^#[0-9a-fA-F]{3,6}$/.test(text) || // Ignore hex color codes
    /^\d+(px|em|rem|%|vw|vh|vmin|vmax)$/.test(text) || // Ignore CSS units
    /^\d+$/.test(text) || // Ignore numeric strings
    /^rgb.*\)$/.test(text) || // Ignore rgb/rgba colors
    /calc\(/.test(text) || // Ignore calc() CSS function
    /max-width/.test(text) || // Ignore max-width CSS property
    /gray\./.test(text) || // Ignore "gray." prefix (e.g., gray.2)
    /^[A-Z0-9_]+$/.test(text) || // Ignore uppercase strings (ENUM or TRANSACTION_TYPES)
    /^https?:\/\/.*/i.test(text) || // Ignore URLs
    /^\/.*/.test(text) || // Ignore paths starting with /
    /^@.*/.test(text) || // Ignore paths starting with @
    /^\.\/.*/.test(text) || // Ignore paths starting with ./
    /^\$\{.*\}/.test(text) || // Ignore strings that start with `${`
    /solid/.test(text) || // Ignore strings that contain "solid"
    /^[a-z]+([A-Z][a-z]*)*$/.test(text) || // Ignore camelCase words
    /^\s*\/\/.*/.test(text) || // Ignore lines starting with //
    /^\s*\/\*/.test(text) || // Ignore lines starting with /*
    /^[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+$/.test(text) // Ignore object-like strings
  );
}

function shouldIgnore(text) {
  if (ignores_text[text]) {
    return true;
  }
  return regexIgnore(text);
}

async function extractTextFromFiles(directory) {
  const fileList = [];

  const files = await fs.promises.readdir(directory, {
    withFileTypes: true,
  });

  for (const file of files) {
    const filePath = resolve(directory, file.name);

    if (ignore_dirs.some((dir) => filePath.startsWith(dir))) {
      console.log(`Skipping file in ignored directory: ${filePath}`);
      continue;
    }

    if (ignore_files.includes(filePath)) {
      console.log(`Skipping file: ${filePath}`);
      continue;
    }

    if (file.isDirectory()) {
      const nestedFiles = await extractTextFromFiles(filePath);
      fileList.push(...nestedFiles);
    } else if (
      file.name.endsWith(".ts") ||
      file.name.endsWith(".tsx")
    ) {
      const fileContent = fs.readFileSync(filePath, "utf-8");

      const extractedText = extractText(fileContent);
      fileList.push({ file: filePath, text: extractedText });
    }
  }

  return fileList;
}

function readFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
async function updateJsonFiles(enJsonPath, jaJsonPath, bkFilePath) {
  try {
    const bkData = fs.readFileSync(bkFilePath, "utf-8");
    const enData = {};
    const jaData = {};

    bkData.split("\n").forEach((line) => {
      const [key, enValue = "NOT FOUND", jaValue = "NOT FOUND"] =
        line.split("\t");
      if (key?.trim()) {
        enData[key] = enValue;
        jaData[key] = jaValue;
      }
    });

    fs.writeFileSync(
      enJsonPath,
      JSON.stringify(enData, null, 2),
      "utf-8",
    );
    fs.writeFileSync(
      jaJsonPath,
      JSON.stringify(jaData, null, 2),
      "utf-8",
    );

    console.log("Updated en.json and ja.json successfully.");
  } catch (error) {
    console.error("Error updating JSON files:", error);
  }
}

async function main() {
  const enJsonPath = resolve(
    _srcPath,
    "services/languages/configs/en.json",
  );
  const jaJsonPath = resolve(
    _srcPath,
    "services/languages/configs/ja.json",
  );
  const outputPath = resolve(
    _srcPath,
    "services/languages/configs/output.bk.md",
  );

  const jaData = readFile(jaJsonPath);
  const results = await extractTextFromFiles(_srcPath);
  const allText = results
    .map(({ text }) => text.filter((t) => !shouldIgnore(t)))
    .flat()
    .sort();
  fs.writeFileSync(
    outputPath,
    [...new Set(allText)]
      .map((key) => [key, key, jaData[key]].join("\t"))
      .join("\n"),
    "utf-8",
  );
  console.log("Markdown file saved to:", outputPath);

  await updateJsonFiles(enJsonPath, jaJsonPath, outputPath);
}

main().catch((err) => console.error(err));
