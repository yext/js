import { convertFileUrl, fileUrlToDynString } from "./fileUrl.js";
import { convertPhotoUrl, photoUrlToDynString } from "./photoUrl.js";

export type Env = "prod" | "sbx" | "qa" | "dev";
export type Partition = "us" | "eu";

export const parseImageUrl = (rawUrl: string) => {
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
