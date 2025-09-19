import { FileUrl, fileUrlToDynString, parseFileUrl } from "./fileUrl.js";
import { ImageTransformations } from "./types.js";

const validCases = [
  {
    name: "ProdUS",
    input: "https://a.mktgcdn.com/f/contentHash.pdf",
    want: {
      scheme: "https",
      partition: "us",
      env: "prod",
      contentHash: "contentHash",
      extension: ".pdf",
    } as FileUrl,
    dynUrl: "https://dyn.mktgcdn.com/f/contentHash.pdf/width=126,height=164",
  },
  {
    name: "ProdUSAccount",
    input: "https://a.mktgcdn.com/f/1234/contentHash.pdf",
    want: {
      scheme: "https",
      partition: "us",
      env: "prod",
      accountId: 1234,
      contentHash: "contentHash",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/f/1234/contentHash.pdf/width=126,height=164",
  },
  {
    name: "ProdEU",
    input: "https://a.eu.mktgcdn.com/f/contentHash.pdf",
    want: {
      scheme: "https",
      partition: "eu",
      env: "prod",
      contentHash: "contentHash",
      extension: ".pdf",
    } as FileUrl,
    dynUrl: "https://dyn.eu.mktgcdn.com/f/contentHash.pdf/width=126,height=164",
  },
  {
    name: "ProdEUAccount",
    input: "https://a.eu.mktgcdn.com/f/100001234/contentHash.pdf",
    want: {
      scheme: "https",
      partition: "eu",
      env: "prod",
      accountId: 100001234,
      contentHash: "contentHash",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.eu.mktgcdn.com/f/100001234/contentHash.pdf/width=126,height=164",
  },
  {
    name: "ProdEUAccountZero",
    input: "https://a.eu.mktgcdn.com/f/0/contentHash.pdf",
    want: {
      scheme: "https",
      partition: "eu",
      env: "prod",
      accountId: 0,
      contentHash: "contentHash",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.eu.mktgcdn.com/f/0/contentHash.pdf/width=126,height=164",
  },
  {
    name: "USSandbox",
    input: "https://a.mktgcdn.com/f-sandbox/contentHash.pdf",
    want: {
      scheme: "https",
      partition: "us",
      env: "sbx",
      contentHash: "contentHash",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/f-sandbox/contentHash.pdf/width=126,height=164",
  },
  {
    name: "USSandboxAccount",
    input: "https://a.mktgcdn.com/f-sandbox/1234/contentHash.pdf",
    want: {
      scheme: "https",
      partition: "us",
      env: "sbx",
      accountId: 1234,
      contentHash: "contentHash",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/f-sandbox/1234/contentHash.pdf/width=126,height=164",
  },
  {
    name: "EUQA",
    input: "https://a.eu.mktgcdn.com/f-qa/contentHash.pdf",
    want: {
      scheme: "https",
      partition: "eu",
      env: "qa",
      contentHash: "contentHash",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.eu.mktgcdn.com/f-qa/contentHash.pdf/width=126,height=164",
  },
  {
    name: "EUQAAccount",
    input: "https://a.eu.mktgcdn.com/f-qa/100001234/contentHash.pdf",
    want: {
      scheme: "https",
      partition: "eu",
      env: "qa",
      accountId: 100001234,
      contentHash: "contentHash",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.eu.mktgcdn.com/f-qa/100001234/contentHash.pdf/width=126,height=164",
  },
  {
    name: "USDevNoExtension",
    input: "https://a.mktgcdn.com/f-dev/contentHash",
    want: {
      scheme: "https",
      partition: "us",
      env: "dev",
      contentHash: "contentHash",
      extension: "",
    } as FileUrl,
    dynUrl: "https://dyn.mktgcdn.com/f-dev/contentHash/width=126,height=164",
  },
  {
    name: "ProdEU image",
    input: "https://a.eu.mktgcdn.com/f/contentHash.pdf",
    want: {
      scheme: "https",
      partition: "eu",
      env: "prod",
      contentHash: "contentHash",
      extension: ".pdf",
    } as FileUrl,
    imageTransformations: { format: "avif" } as ImageTransformations,
    dynUrl:
      "https://dyn.eu.mktgcdn.com/f/contentHash.pdf/width=126,height=164,format=avif",
  },
];

describe("parseFileUrl valid", () => {
  test.each(validCases)(
    `returns valid parsedFileUrl for $name - $input`,
    ({ input, want, dynUrl, imageTransformations }) => {
      expect(parseFileUrl(input)).toEqual(want);
      expect(
        fileUrlToDynString(parseFileUrl(input)!, 126, 164, imageTransformations)
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
    input: "ftp://a.mktgcdn.com/f/contentHash.pdf",
  },
  {
    name: "InvalidSubdomain",
    input: "https://b.mktgcdn.com/f/contentHash.pdf",
  },
  {
    name: "InvalidPathRoot",
    input: "https://a.mktgcdn.com/p/contentHash.pdf",
  },
  {
    name: "InvalidEnv",
    input: "https://a.mktgcdn.com/f-other/contentHash.pdf",
  },
  {
    name: "InvalidAccount",
    input: "https://a.mktgcdn.com/f/xyz/contentHash.pdf",
  },
  {
    name: "InvalidPath",
    input: "https://a.mktgcdn.com/f/1234/too/many/segments/contentHash.pdf",
  },
  {
    name: "InvalidSandboxEU",
    input: "https://a.eu.mktgcdn.com/f-sandbox/100001234/contentHash.pdf",
  },
  {
    name: "InvalidDevEU",
    input: "https://a.eu.mktgcdn.com/f-dev/100001234/contentHash.pdf",
  },
];

describe("parseFileUrl invalid", () => {
  test.each(invalidCases)(
    `returns invalid parsedFileUrl for $name - $input`,
    ({ input }) => {
      expect(parseFileUrl(input)).toEqual(undefined);
    }
  );
});
