import { expect, test } from "vitest";
import {
  CTA_EVENT,
  determineEvent,
  DRIVING_DIRECTIONS_EVENT,
  getHref,
  isEmail,
  LINK_TO_CORPORATE_EVENT,
  PHONE_CALL_EVENT,
} from "./methods.js";
import { LinkType, LinkTypes } from "./types.js";

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
      linkType: LinkTypes.Email,
    })
  ).toEqual("mailto:email@test.com");
});

test("getHref: Telephone type", () => {
  expect(
    getHref({
      label: "",
      link: "+11234567890",
      linkType: LinkTypes.Phone,
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

// determineEvent
test.each<[string | undefined, LinkType | undefined, string]>([
  ["myEventName", "DrivingDirections", "myEventName"],
  [undefined, "DrivingDirections", DRIVING_DIRECTIONS_EVENT],
  [undefined, "Phone", PHONE_CALL_EVENT],
  [undefined, "URL", CTA_EVENT],
  [undefined, "Email", CTA_EVENT],
  [undefined, "LinkToCorporate", LINK_TO_CORPORATE_EVENT],
  [undefined, undefined, CTA_EVENT],
])(`determineEvent: %s %s`, (inputEventName, linkType, outputEventName) => {
  expect(determineEvent(inputEventName, linkType)).toEqual(outputEventName);
});
