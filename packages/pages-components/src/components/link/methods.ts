import { LinkProps, CTA, LinkType } from "./types.js";

export const PHONE_CALL_EVENT = "phonecall";
export const DRIVING_DIRECTIONS_EVENT = "drivingdirection";
export const CTA_EVENT = "calltoactionclick";
export const LINK_TO_CORPORATE_EVENT = "clicktowebsite";

/**
 * Resolves the final CTA object from the LinkProps since some of the props
 * are optional.
 */
export const resolveCTA = (linkProps: LinkProps): CTA => {
  const cta = linkProps.cta ?? { link: linkProps.href };

  if (!cta.link) {
    if (linkProps.cta) {
      throw new Error("CTA's link is undefined");
    } else {
      throw new Error("Link's href is undefined");
    }
  }

  if (!cta.linkType) {
    cta.linkType = determineLinkType(cta.link);
  }

  cta.link = getHref(cta);

  return cta;
};

/**
 * Determine the event name for the link click, preferring the custom eventName.
 */
export const determineEvent = (
  eventName: string | undefined,
  linkType: LinkType | undefined
): string => {
  if (eventName) {
    return eventName;
  }

  if (linkType) {
    switch (linkType) {
      case "Phone":
        return PHONE_CALL_EVENT;
      case "Email":
        return CTA_EVENT;
      case "URL":
        return CTA_EVENT;
      case "DrivingDirections":
        return DRIVING_DIRECTIONS_EVENT;
      case "LinkToCorporate":
        return LINK_TO_CORPORATE_EVENT;
      default:
        throw new Error(
          `Can't determine eventName for unknown link type: ${linkType}`
        );
    }
  }

  return CTA_EVENT;
};

/**
 * Determine the type of link based on the href.
 */
const determineLinkType = (href: string): LinkType => {
  if (isEmail(href)) {
    return "Email";
  }

  if (href.startsWith("tel:")) {
    return "Phone";
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
  if (cta.linkType === "Email") {
    if (cta.link.startsWith("mailto:")) {
      return cta.link;
    }
    return `mailto:${cta.link}`;
  }

  if (cta.linkType === "Phone") {
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
