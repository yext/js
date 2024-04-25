import { convertFileUrl, fileUrlToDynString } from "./fileUrl.js";
import { convertPhotoUrl, photoUrlToDynString } from "./photoUrl.js";

export type Env = "prod" | "sbx" | "qa" | "dev";
export type Partition = "us" | "eu";

/**
 * Parses a raw a.mktgcdn.com type url and returns its corresponding dyn.mktgcdn.com version.
 * If the raw url cannot be parsed, it's simply returned as-is and used as a passthrough.
 */
export const getImageUrl = (rawUrl: string, width: number, height: number) => {
  if (!isValidHttpUrl(rawUrl)) {
    console.error(`Invalid image url: ${rawUrl}.`);
    return;
  }

  const parsedUrl = new URL(rawUrl);
  if (parsedUrl.pathname.startsWith("/p")) {
    const photoUrl = convertPhotoUrl(parsedUrl);
    if (photoUrl) {
      return photoUrlToDynString(photoUrl, width, height);
    }
  } else if (parsedUrl.pathname.startsWith("/f")) {
    const fileUrl = convertFileUrl(parsedUrl);
    if (fileUrl) {
      return fileUrlToDynString(fileUrl, width, height);
    }
  }

  return rawUrl;
};

export const isValidHttpUrl = (rawUrl: string) => {
  let url;

  try {
    url = new URL(rawUrl);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
