import { Action } from "@yext/analytics";
import { LinkProps, CTA, LinkType } from "./types.js";

export const PHONE_CALL_EVENT = "phonecall";
export const DRIVING_DIRECTIONS_EVENT = "drivingdirection";
export const CTA_EVENT = "calltoactionclick";
export const CLICK_TO_WEBSITE = "clicktowebsite"; // The platform description of this is "click to corporate page"
export const OTHER_EVENT = "other";
export const LEGACY_LINK_EVENT = "link";
export const LEGACY_CTA_EVENT = "cta";

/**
 * Resolves the final CTA object from the LinkProps since some of the props
 * are optional.
 */
export const resolveCTA = (linkProps: LinkProps): CTA => {
  // Create a mutable copy of the cta object
  const cta = { ...(linkProps.cta ?? { link: linkProps.href }) };

  if (!cta.link) {
    if (linkProps.cta) {
      throw new Error("CTA's link is undefined");
    } else {
      throw new Error("Link's href is undefined");
    }
  }

  if (typeof cta.link !== "string") {
    if (linkProps.cta) {
      throw new Error("CTA's link is invalid");
    } else {
      throw new Error("Link's href is invalid");
    }
  }

  if (!cta.linkType) {
    cta.linkType = determineLinkType(cta.link);
  }

  cta.link = getHref(cta);

  return cta;
};

/**
 * Resolves the action based on the cta's linkType.
 *
 * Note: If a custom eventName is used we may want to consider a C_ action in the future.
 */
export const resolveAction = (cta: CTA, isCTA: boolean): Action => {
  switch (cta.linkType) {
    case "EMAIL":
      return "CTA_CLICK";
    case "PHONE":
      return "TAP_TO_CALL";
    case "CLICK_TO_WEBSITE":
      return "WEBSITE";
    case "DRIVING_DIRECTIONS":
      return "DRIVING_DIRECTIONS";
    case "OTHER":
      return "CTA_CLICK";
    case "URL":
      return "LINK";
    default:
      return isCTA ? "CTA_CLICK" : "LINK";
  }
};

/**
 * Determine the event name for the link click, preferring the custom eventName.
 */
export const determineEvent = (
  eventName: string | undefined,
  linkType: LinkType | undefined,
  isCTA: boolean
): string => {
  // Always prefer the custom eventName
  if (eventName) {
    return eventName;
  }

  if (linkType) {
    switch (linkType) {
      case "PHONE":
        return PHONE_CALL_EVENT;
      case "EMAIL":
        return CTA_EVENT;
      case "URL":
        return LEGACY_LINK_EVENT;
      case "DRIVING_DIRECTIONS":
        return DRIVING_DIRECTIONS_EVENT;
      case "CLICK_TO_WEBSITE":
        return CLICK_TO_WEBSITE;
      case "OTHER":
        return OTHER_EVENT;
      default:
        return isCTA ? CTA_EVENT : LEGACY_LINK_EVENT;
    }
  }

  // It should not be possible to get here since the caller of this should use the
  // resolved CTA object which has a linkType, but it's optional on the CTA type.
  // If cta and no linkType set, default to legacy cta event.
  // This is for backwards compatibility before trying to map linkType to built-in platform events.
  return LEGACY_CTA_EVENT;
};

/**
 * Determine the type of link based on the href.
 */
export const determineLinkType = (href: string): LinkType => {
  if (isEmail(href)) {
    return "EMAIL";
  }

  if (href.startsWith("tel:")) {
    return "PHONE";
  }

  return "URL";
};

/**
 * Get the final link from a CTA. Special handling for email and phone links.
 *
 * @param cta - CTA
 * @returns a valid href tag
 */
export const getHref = (cta: CTA): string => {
  if (cta.linkType === "EMAIL") {
    if (cta.link.startsWith("mailto:")) {
      return cta.link;
    }
    return `mailto:${cta.link}`;
  }

  if (cta.linkType === "PHONE") {
    if (cta.link.startsWith("tel:")) {
      return cta.link;
    }
    return `tel:${cta.link}`;
  }

  return cta.link;
};

/**
 * Checks if a link is a valid email address.
 *
 * Regex defined in HTML Spec for <input type="email"> validation.
 * https://html.spec.whatwg.org/#email-state-(type=email)
 */
export const isEmail = (link: string): boolean => {
  if (link.startsWith("mailto:")) {
    return true;
  }

  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(link);
};

/**
 * Reverse a string, used for obfuscation
 *
 * https://eddmann.com/posts/ten-ways-to-reverse-a-string-in-javascript/
 */
export const reverse = (string: string): string => {
  let o = "";
  for (let i = string.length - 1; i >= 0; o += string[i--]) {
    // intentionally empty, logic happens in the for loop iteration
  }
  return o;
};
