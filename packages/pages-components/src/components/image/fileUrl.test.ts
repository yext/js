import { FileUrl, fileUrlToDynString, parseFileUrl } from "./fileUrl.js";

const validCases = [
  {
    name: "ProdUS",
    input:
      "https://a.mktgcdn.com/f/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
    want: {
      scheme: "https",
      partition: "us",
      env: "prod",
      contentHash: "ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/f/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf/width=126,height=164",
  },
  {
    name: "ProdUSAccount",
    input:
      "https://a.mktgcdn.com/f/1234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
    want: {
      scheme: "https",
      partition: "us",
      env: "prod",
      accountId: 1234,
      contentHash: "ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/f/1234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf/width=126,height=164",
  },
  {
    name: "ProdEU",
    input:
      "https://a.eu.mktgcdn.com/f/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
    want: {
      scheme: "https",
      partition: "eu",
      env: "prod",
      contentHash: "ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.eu.mktgcdn.com/f/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf/width=126,height=164",
  },
  {
    name: "ProdEUAccount",
    input:
      "https://a.eu.mktgcdn.com/f/100001234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
    want: {
      scheme: "https",
      partition: "eu",
      env: "prod",
      accountId: 100001234,
      contentHash: "ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.eu.mktgcdn.com/f/100001234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf/width=126,height=164",
  },
  {
    name: "USSandbox",
    input:
      "https://a.mktgcdn.com/f-sandbox/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
    want: {
      scheme: "https",
      partition: "us",
      env: "sbx",
      contentHash: "ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/f-sandbox/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf/width=126,height=164",
  },
  {
    name: "USSandboxAccount",
    input:
      "https://a.mktgcdn.com/f-sandbox/1234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
    want: {
      scheme: "https",
      partition: "us",
      env: "sbx",
      accountId: 1234,
      contentHash: "ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/f-sandbox/1234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf/width=126,height=164",
  },
  {
    name: "EUQA",
    input:
      "https://a.eu.mktgcdn.com/f-qa/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
    want: {
      scheme: "https",
      partition: "eu",
      env: "qa",
      contentHash: "ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.eu.mktgcdn.com/f-qa/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf/width=126,height=164",
  },
  {
    name: "EUQAAccount",
    input:
      "https://a.eu.mktgcdn.com/f-qa/100001234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
    want: {
      scheme: "https",
      partition: "eu",
      env: "qa",
      accountId: 100001234,
      contentHash: "ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00",
      extension: ".pdf",
    } as FileUrl,
    dynUrl:
      "https://dyn.eu.mktgcdn.com/f-qa/100001234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf/width=126,height=164",
  },
  {
    name: "USDevNoExtension",
    input:
      "https://a.mktgcdn.com/f-dev/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00",
    want: {
      scheme: "https",
      partition: "us",
      env: "dev",
      contentHash: "ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00",
      extension: "",
    } as FileUrl,
    dynUrl:
      "https://dyn.mktgcdn.com/f-dev/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00/width=126,height=164",
  },
];

describe("parseFileUrl valid", () => {
  test.each(validCases)(
    `returns valid parsedFileUrl for $name - $input`,
    ({ input, want, dynUrl }) => {
      expect(parseFileUrl(input)).toEqual(want);
      expect(fileUrlToDynString(parseFileUrl(input)!, 126, 164)).toEqual(
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
      "ftp://a.mktgcdn.com/f/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
  },
  {
    name: "InvalidSubdomain",
    input:
      "https://b.mktgcdn.com/f/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
  },
  {
    name: "InvalidPathRoot",
    input:
      "https://a.mktgcdn.com/p/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
  },
  {
    name: "InvalidEnv",
    input:
      "https://a.mktgcdn.com/f-other/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
  },
  {
    name: "InvalidAccount",
    input:
      "https://a.mktgcdn.com/f/xyz/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
  },
  {
    name: "InvalidPath",
    input:
      "https://a.mktgcdn.com/f/1234/too/many/segments/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
  },
  {
    name: "InvalidSandboxEU",
    input:
      "https://a.eu.mktgcdn.com/f-sandbox/100001234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
  },
  {
    name: "InvalidDevEU",
    input:
      "https://a.eu.mktgcdn.com/f-dev/100001234/ab0Q6RcXc3WxYn5j-jsEAG4_V5tuQJLb8Ru5Ol0aX00.pdf",
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
