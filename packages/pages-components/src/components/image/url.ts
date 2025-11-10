import { convertFileUrl, fileUrlToDynString } from "./fileUrl.js";
import { convertPhotoUrl, photoUrlToDynString } from "./photoUrl.js";
import { ImageTransformations } from "./types.js";

export type Env = "prod" | "sbx" | "qa" | "dev";
export type Partition = "us" | "eu";

/**
 * Checks if a hostname is a Yext CDN host.
 * Valid hosts include: a.mktgcdn.com, a.eu.mktgcdn.com, and other partition variants.
 */
const isYextCdnHost = (hostname: string): boolean => {
  return hostname.includes("mktgcdn.com");
};

/**
 * Parses a raw a.mktgcdn.com type url and returns its corresponding dyn.mktgcdn.com version.
 * If the raw url cannot be parsed, it's simply returned as-is and used as a passthrough.
 */
export const getImageUrl = (
  rawUrl: string,
  width: number,
  height: number,
  imageTransformations?: ImageTransformations
) => {
  if (!isValidHttpUrl(rawUrl)) {
    console.error(`Invalid image url: ${rawUrl}.`);
    return;
  }

  const parsedUrl = new URL(rawUrl);

  // Only attempt to convert Yext CDN URLs. For external URLs,
  // return them without attempting conversion.
  if (!isYextCdnHost(parsedUrl.hostname)) {
    return rawUrl;
  }

  if (parsedUrl.pathname.startsWith("/p")) {
    const photoUrl = convertPhotoUrl(parsedUrl);
    if (photoUrl) {
      return photoUrlToDynString(photoUrl, width, height, imageTransformations);
    }
  } else if (parsedUrl.pathname.startsWith("/f")) {
    const fileUrl = convertFileUrl(parsedUrl);
    if (fileUrl) {
      return fileUrlToDynString(fileUrl, width, height, imageTransformations);
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

export const getImageTransformationsString = (
  imageTransformations: ImageTransformations | undefined
): string => {
  if (!imageTransformations || Object.keys(imageTransformations).length === 0) {
    return "";
  }

  const imageTransformationsString = Object.entries(imageTransformations)
    .filter(([, value]) => value !== undefined && String(value) !== "")
    .map(([key, value]) => `${key}=${value}`)
    .join(",");

  return imageTransformationsString.length > 0
    ? `,${imageTransformationsString}`
    : "";
};
