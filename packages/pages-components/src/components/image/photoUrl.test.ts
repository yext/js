import { parsePhotoUrl, PhotoUrl, photoUrlToDynString } from "./photoUrl.js";

const validCases = [
  {
    name: "ProdStandard",
    input:
      "https://a.mktgcdn.com/p/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/126x164.jpg",
    want: {
      scheme: "https",
      env: "prod",
      contentHash: "TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno",
      aspectRatio: undefined,
      name: "126x164",
      extension: ".jpg",
    } as PhotoUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/p/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/width=126,height=164",
  },
  {
    name: "ProdOriginal",
    input:
      "https://a.mktgcdn.com/p/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/original",
    want: {
      scheme: "https",
      env: "prod",
      contentHash: "TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno",
      aspectRatio: undefined,
      name: "original",
      extension: "",
    } as PhotoUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/p/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/width=126,height=164",
  },
  {
    name: "ProdPadded",
    input:
      "https://a.mktgcdn.com/p/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/1.0000/164x164.jpg",
    want: {
      scheme: "https",
      env: "prod",
      contentHash: "TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno",
      aspectRatio: 1,
      name: "164x164",
      extension: ".jpg",
    } as PhotoUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/p/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/width=126,height=164",
  },
  {
    name: "SandboxStandard",
    input:
      "https://a.mktgcdn.com/p-sandbox/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/126x164.jpg",
    want: {
      scheme: "https",
      env: "sbx",
      contentHash: "TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno",
      aspectRatio: undefined,
      name: "126x164",
      extension: ".jpg",
    } as PhotoUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/p-sandbox/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/width=126,height=164",
  },
];

describe("parsePhotoUrl valid", () => {
  test.each(validCases)(
    `returns valid parsedPhotoUrl for $name - $input`,
    ({ input, want, dynUrl }) => {
      expect(parsePhotoUrl(input)).toEqual(want);
      expect(photoUrlToDynString(parsePhotoUrl(input)!, 126, 164)).toEqual(
        dynUrl
      );
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
    input:
      "ftp://a.mktgcdn.com/p/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/126x164.jpg",
  },
  {
    name: "InvalidSubdomain",
    input:
      "https://b.mktgcdn.com/p/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/126x164.jpg",
  },
  {
    name: "InvalidPathRoot",
    input:
      "https://a.mktgcdn.com/f/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/126x164.jpg",
  },
  {
    name: "InvalidEnv",
    input:
      "https://a.mktgcdn.com/p-other/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/126x164.jpg",
  },
  {
    name: "InvalidAspectRatio",
    input:
      "https://a.mktgcdn.com/p/TwivlIgmAV7v07Txzke8zHdFggRup8qwlUoAzBcCvno/1.0000000/164x164.jpg",
  },
  {
    name: "InvalidPath",
    input:
      "https://a.mktgcdn.com/p/1234/too/many/segments/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00/126x164.jpg",
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
