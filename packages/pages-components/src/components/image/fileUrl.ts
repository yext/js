import { Env, Partition } from "./url.js";

// FileURL is a URL for a file stored in the Yext CDN.
//
// A FileURL always starts with 'a' subdomain, e.g. 'a.mktgcdn.com' or 'a.eu.mktgcdn.com', and the
// path starts with '/f[-env]/'. This is followed by an optional account id segment (older URLs have
// one, newer ones don't), and finally the content hash and extension.
//
// Examples:
//
//	US Production: https://a.mktgcdn.com/f/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf
//	US Production: https://a.mktgcdn.com/f/1234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf
//	EU Production: https://a.eu.mktgcdn.com/f/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf
//	EU Production: https://a.eu.mktgcdn.com/f/100001234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf
//	US Sandbox: https://a.mktgcdn.com/f-sandbox/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf
//	US Sandbox: https://a.mktgcdn.com/f-sandbox/1234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf
//	EU QA: https://a.eu.mktgcdn.com/f-qa/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf
//	EU QA: https://a.eu.mktgcdn.com/f-qa/100001234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf
export type FileUrl = {
  // Scheme is 'http' or 'https'.
  //
  // All files are served equivalently under both http and https; the scheme is retained from the
  // parsed input.
  scheme: string;

  // Partition is the Yext partition of the URL, as defined by the site definition.
  //
  // Valid values currently include: 'us', 'eu'.
  //
  // Partitions other than the US add a subdomain after 'a', e.g. 'a.eu.mktgcdn.com'.
  partition: string;

  // Env is the Yext environment of the URL.
  //
  // The environment defines the suffix appended to the path root '/f':
  // - yext.EnvProd: /f/
  // - yext.EnvSandbox: /f-sandbox/
  // - yext.EnvQA: /f-qa/
  // - yext.EnvDev: /f-dev/
  //
  // Note that the string value of yext.EnvSandbox is 'sbx' but the in the path it's 'sandbox'.
  env: Env;

  // AccountID is an optional segment inserted between the root path segment and the object id.
  //
  // For instance, '/f/1234/[id]' has an account id of 1234.
  accountId?: number;

  // ContentHash is the content hash segment of the URL.
  contentHash: string;

  // Extension is the file extension (including the leading .), or an empty string if none.
  extension: string;
};

export const parseFileUrl = (rawUrl: string) => {
  if (!URL.canParse(rawUrl)) {
    console.error(`Invalid image url: ${rawUrl}.`);
    return;
  }

  return convertFileUrl(new URL(rawUrl));
};

export const convertFileUrl = (parsedUrl: URL): FileUrl | undefined => {
  const scheme = parsedUrl.protocol.slice(0, -1); // trim colon
  if (scheme !== "http" && scheme !== "https") {
    console.error(`Invalid scheme: ${parsedUrl}`);
    return;
  }

  const host = parsedUrl.hostname;
  let partition: Partition;
  if (host === "a.mktgcdn.com") {
    partition = "us";
  } else {
    const urlPartition = host.replace("a.", "").replace(".mktgcdn.com", "");
    if (urlPartition !== "eu") {
      console.error(`Invalid host: ${parsedUrl}`);
      return;
    }
    partition = "eu";
  }

  if (!parsedUrl.pathname.startsWith("/f")) {
    console.error(`Invalid path: ${parsedUrl}`);
    return;
  }

  const pathParts = parsedUrl.pathname.replace(/^\//, "").split("/");
  if (pathParts.length < 2 || pathParts.length > 3) {
    console.error(`Invalid path: ${parsedUrl}`);
    return;
  }

  let env: Env;
  if (pathParts[0] === "f") {
    env = "prod";
  } else {
    switch (pathParts[0].replace("f-", "")) {
      case "sandbox": {
        env = "sbx";
        break;
      }
      case "qa": {
        env = "qa";
        break;
      }
      case "dev": {
        env = "dev";
        break;
      }
      default: {
        console.error(`Invalid path: ${parsedUrl}`);
        return;
      }
    }
  }

  if (partition === "eu" && (env === "dev" || env === "sbx")) {
    console.error(`Invalid path: ${parsedUrl}`);
    return;
  }

  let accountId;
  if (pathParts.length === 3) {
    accountId = parseInt(pathParts[1]);
    if (Number.isNaN(accountId)) {
      console.error(`Invalid account id: ${parsedUrl}`);
      return;
    }
  }

  const extAndContentHash = pathParts[pathParts.length - 1].split(".");
  const extension =
    extAndContentHash.length === 2 ? `.${extAndContentHash[1]}` : "";
  const contentHash = extAndContentHash[0];

  return {
    scheme,
    partition,
    env,
    accountId,
    contentHash,
    extension,
  };
};

export const fileUrlToDynString = (
  fileUrl: FileUrl,
  width: number,
  height: number
) => {
  const dynUrl = `https://dyn${
    fileUrl.partition === "us" ? "" : `.${fileUrl.partition}`
  }.mktgcdn.com`;

  let bucket = "f";
  switch (fileUrl.env) {
    case "prod": {
      break;
    }
    case "sbx": {
      bucket += "-sandbox";
      break;
    }
    default: {
      bucket += `-${fileUrl.env.toString()}`;
    }
  }

  const accountId = fileUrl.accountId ? `${fileUrl.accountId}/` : "";

  return `${dynUrl}/${bucket}/${accountId}${fileUrl.contentHash}${
    fileUrl.extension
  }/width=${Math.round(width)},height=${Math.round(height)}`;
};
