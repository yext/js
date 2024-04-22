import { convertFileUrl, FileUrl, fileUrlToDynString } from "./fileUrl.js";
import { convertPhotoUrl, PhotoUrl, photoUrlToDynString } from "./photoUrl.js";

export type Env = "prod" | "sbx" | "qa" | "dev";
export type Partition = "us" | "eu";

/**
 * Parses a raw a.mktgcdn.com type url into either a {@link PhotoUrl} or {@link ImageUrl}.
 */
export const parseImageUrl = (
  rawUrl: string
): PhotoUrl | FileUrl | undefined => {
  if (!URL.canParse(rawUrl)) {
    console.error(`Invalid image url: ${rawUrl}.`);
    return;
  }

  const parsedUrl = new URL(rawUrl);
  if (parsedUrl.pathname.startsWith("/p")) {
    return convertPhotoUrl(parsedUrl);
  } else if (parsedUrl.pathname.startsWith("/f")) {
    return convertFileUrl(parsedUrl);
  }

  console.error(`Invalid image url: ${rawUrl}.`);
};

/**
 * Parses a raw a.mktgcdn.com type url and returns its corresponding dyn.mktgcdn.com version.
 */
export const getImageUrl = (rawUrl: string, width: number, height: number) => {
  if (!URL.canParse(rawUrl)) {
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

  console.error(`Invalid image url: ${rawUrl}.`);
};
