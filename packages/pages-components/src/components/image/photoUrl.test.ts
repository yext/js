import { parsePhotoUrl, PhotoUrl, photoUrlToDynString } from "./photoUrl.js";
import { CDNParams } from "./types.js";

const validCases = [
  {
    name: "ProdStandard",
    input: "https://a.mktgcdn.com/p/contentHash/126x164.jpg",
    want: {
      scheme: "https",
      env: "prod",
      contentHash: "contentHash",
      aspectRatio: undefined,
      name: "126x164",
      extension: ".jpg",
    } as PhotoUrl,
    dynUrl: "https://dyn.mktgcdn.com/p/contentHash/width=126,height=164",
  },
  {
    name: "ProdOriginal",
    input: "https://a.mktgcdn.com/p/contentHash/original",
    want: {
      scheme: "https",
      env: "prod",
      contentHash: "contentHash",
      aspectRatio: undefined,
      name: "original",
      extension: "",
    } as PhotoUrl,
    dynUrl: "https://dyn.mktgcdn.com/p/contentHash/width=126,height=164",
  },
  {
    name: "ProdPadded",
    input: "https://a.mktgcdn.com/p/contentHash/1.0000/164x164.jpg",
    want: {
      scheme: "https",
      env: "prod",
      contentHash: "contentHash",
      aspectRatio: 1,
      name: "164x164",
      extension: ".jpg",
    } as PhotoUrl,
    dynUrl: "https://dyn.mktgcdn.com/p/contentHash/width=126,height=164",
  },
  {
    name: "SandboxStandard",
    input: "https://a.mktgcdn.com/p-sandbox/contentHash/126x164.jpg",
    want: {
      scheme: "https",
      env: "sbx",
      contentHash: "contentHash",
      aspectRatio: undefined,
      name: "126x164",
      extension: ".jpg",
    } as PhotoUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/p-sandbox/contentHash/width=126,height=164",
  },
  {
    name: "CDN Params",
    input: "https://a.mktgcdn.com/p/contentHash/126x164.jpg",
    want: {
      scheme: "https",
      env: "prod",
      contentHash: "contentHash",
      aspectRatio: undefined,
      name: "126x164",
      extension: ".jpg",
    } as PhotoUrl,
    cdnParams: {
      format: "avif",
      fit: "contain",
    } as CDNParams,
    dynUrl:
      "https://dyn.mktgcdn.com/p/contentHash/width=126,height=164,format=avif,fit=contain",
  },
];

describe("parsePhotoUrl valid", () => {
  test.each(validCases)(
    `returns valid parsedPhotoUrl for $name - $input`,
    ({ input, want, dynUrl, cdnParams }) => {
      expect(parsePhotoUrl(input)).toEqual(want);
      expect(
        photoUrlToDynString(parsePhotoUrl(input)!, 126, 164, cdnParams)
      ).toEqual(dynUrl);
    }
  );
});

const invalidCases = [
  {
    name: "InvalidHost",
    input: "https://www.example.com/image.png",
  },
  {
    name: "InvalidScheme",
    input: "ftp://a.mktgcdn.com/p/contentHash/126x164.jpg",
  },
  {
    name: "InvalidSubdomain",
    input: "https://b.mktgcdn.com/p/contentHash/126x164.jpg",
  },
  {
    name: "InvalidPathRoot",
    input: "https://a.mktgcdn.com/f/contentHash/126x164.jpg",
  },
  {
    name: "InvalidEnv",
    input: "https://a.mktgcdn.com/p-other/contentHash/126x164.jpg",
  },
  {
    name: "InvalidAspectRatio",
    input: "https://a.mktgcdn.com/p/contentHash/1.0000000/164x164.jpg",
  },
  {
    name: "InvalidPath",
    input:
      "https://a.mktgcdn.com/p/1234/too/many/segments/contentHash/126x164.jpg",
  },
];

describe("parsePhotoUrl invalid", () => {
  test.each(invalidCases)(
    `returns invalid parsedPhotoUrl for $name - $input`,
    ({ input }) => {
      expect(parsePhotoUrl(input)).toEqual(undefined);
    }
  );
});
