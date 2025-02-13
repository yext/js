import { expect, test } from "vitest";
import {
  CLICK_TO_WEBSITE,
  CTA_EVENT,
  determineEvent,
  determineLinkType,
  DRIVING_DIRECTIONS_EVENT,
  getHref,
  isEmail,
  LEGACY_CTA_EVENT,
  LEGACY_LINK_EVENT,
  OTHER_EVENT,
  PHONE_CALL_EVENT,
  resolveAction,
  resolveCTA,
} from "./methods.js";
import { LinkProps, LinkType, LinkTypes } from "./types.js";
import { Action } from "@yext/analytics";

// getHref
test("getHref: Url type", () => {
  expect(
    getHref({
      label: "",
      link: "https://yext.com",
      linkType: LinkTypes.URL,
    })
  ).toEqual("https://yext.com");
});

test("getHref: Email type", () => {
  expect(
    getHref({
      label: "",
      link: "email@test.com",
      linkType: LinkTypes.EMAIL,
    })
  ).toEqual("mailto:email@test.com");
});

test("getHref: Telephone type", () => {
  expect(
    getHref({
      label: "",
      link: "+11234567890",
      linkType: LinkTypes.PHONE,
    })
  ).toEqual("tel:+11234567890");
});

// isEmail

// Source test cases from chromium
// https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/web_tests/fast/forms/resources/ValidityState-typeMismatch-email.js?q=ValidityState-typeMismatch-email.js&ss=chromium

const expectValid = true;
const expectInvalid = false;

test.each<[string, boolean]>([
  ["something@something.com", expectValid],
  ["someone@localhost.localdomain", expectValid],
  ["someone@127.0.0.1", expectValid],
  ["a@b.b", expectValid],
  ["a/b@domain.com", expectValid],
  ["{}@domain.com", expectValid],
  ["m*'!%@something.sa", expectValid],
  ["tu!!7n7.ad##0!!!@company.ca", expectValid],
  ["%@com.com", expectValid],
  ["!#$%&'*+/=?^_`{|}~.-@com.com", expectValid],
  [".wooly@example.com", expectValid],
  ["wo..oly@example.com", expectValid],
  ["someone@do-ma-in.com", expectValid],
  ["somebody@example", expectValid],
  ["invalid:email@example.com", expectInvalid],
  ["@somewhere.com", expectInvalid],
  ["example.com", expectInvalid],
  ["@@example.com", expectInvalid],
  ["a space@example.com", expectInvalid],
  ["something@ex..ample.com", expectInvalid],
  ["a\b@c", expectInvalid],
  ["someone@somewhere.com.", expectInvalid],
  ['""test\blah""@example.com', expectInvalid],
  ['"testblah"@example.com', expectInvalid],
  ["someone@somewhere.com@", expectInvalid],
  ["someone@somewhere_com", expectInvalid],
  ["someone@some:where.com", expectInvalid],
  [".", expectInvalid],
  ["F/s/f/a@feo+re.com", expectInvalid],
  [
    'some+long+email+address@some+host-weird-/looking.com", "some+long+email+address@some+host-weird-/looking.com',
    expectInvalid,
  ],
  ["a @p.com", expectInvalid],
  ["ddjk-s-jk@asl-.com", expectInvalid],
])(`isEmail: %s`, (emailAddress, validity) => {
  expect(isEmail(emailAddress)).toEqual(validity);
});

// determineEvent cta false
test.each<[string | undefined, LinkType | undefined, string]>([
  ["myEventName", "DRIVING_DIRECTIONS", "myEventName"],
  [undefined, "DRIVING_DIRECTIONS", LEGACY_LINK_EVENT],
  [undefined, "PHONE", LEGACY_LINK_EVENT],
  [undefined, "URL", LEGACY_LINK_EVENT],
  [undefined, "EMAIL", LEGACY_LINK_EVENT],
  [undefined, "CLICK_TO_WEBSITE", LEGACY_LINK_EVENT],
  [undefined, "OTHER", LEGACY_LINK_EVENT],
  [undefined, undefined, LEGACY_LINK_EVENT],
])(`determineEvent: %s %s`, (inputEventName, linkType, outputEventName) => {
  expect(determineEvent(inputEventName, linkType, false)).toEqual(
    outputEventName
  );
});

// determineEvent cta true
test.each<[string | undefined, LinkType | undefined, string]>([
  ["myEventName", "DRIVING_DIRECTIONS", "myEventName"],
  [undefined, "DRIVING_DIRECTIONS", DRIVING_DIRECTIONS_EVENT],
  [undefined, "PHONE", PHONE_CALL_EVENT],
  [undefined, "URL", LEGACY_LINK_EVENT],
  [undefined, "EMAIL", CTA_EVENT],
  [undefined, "CLICK_TO_WEBSITE", CLICK_TO_WEBSITE],
  [undefined, "OTHER", OTHER_EVENT],
  [undefined, undefined, LEGACY_CTA_EVENT],
])(`determineEvent: %s %s`, (inputEventName, linkType, outputEventName) => {
  expect(determineEvent(inputEventName, linkType, true)).toEqual(
    outputEventName
  );
});

// resolveAction cta false
test.each<[LinkType | undefined, Action]>([
  [LinkTypes.EMAIL, "CTA_CLICK"],
  [LinkTypes.PHONE, "TAP_TO_CALL"],
  [LinkTypes.CLICK_TO_WEBSITE, "WEBSITE"],
  [LinkTypes.DRIVING_DIRECTIONS, "DRIVING_DIRECTIONS"],
  [LinkTypes.OTHER, "CTA_CLICK"],
  [LinkTypes.URL, "LINK"],
  [undefined, "LINK"],
])(`resolveAction: %s %s`, (linkType, action) => {
  expect(resolveAction({ link: "", linkType }, false)).toEqual(action);
});

// resolveAction cta true
test.each<[LinkType | undefined, Action]>([
  [LinkTypes.EMAIL, "CTA_CLICK"],
  [LinkTypes.PHONE, "TAP_TO_CALL"],
  [LinkTypes.CLICK_TO_WEBSITE, "WEBSITE"],
  [LinkTypes.DRIVING_DIRECTIONS, "DRIVING_DIRECTIONS"],
  [LinkTypes.OTHER, "CTA_CLICK"],
  [LinkTypes.URL, "LINK"],
  [undefined, "CTA_CLICK"],
])(`resolveAction: %s %s`, (linkType, action) => {
  expect(resolveAction({ link: "", linkType }, true)).toEqual(action);
});

// determineLinkType
test.each<[string, LinkType]>([
  ["foo@yext.com", LinkTypes.EMAIL],
  ["tel:5555555555", LinkTypes.PHONE],
  ["https://yext.com", LinkTypes.URL],
  ["", LinkTypes.URL],
])(`determineLinkType: %s %s`, (href, linkType) => {
  expect(determineLinkType(href)).toEqual(linkType);
});

// resolveCTA
test("resolveCTA - error when no href and not cta", () => {
  const linkProps = {} as unknown as LinkProps;
  expect(() => resolveCTA(linkProps)).toThrowError("Link's href is undefined");
});

test("resolveCTA - error when cta and no link", () => {
  const linkProps = {
    cta: {
      label: "",
      linkType: LinkTypes.URL,
    },
  } as unknown as LinkProps;
  expect(() => resolveCTA(linkProps)).toThrowError("CTA's link is undefined");
});
