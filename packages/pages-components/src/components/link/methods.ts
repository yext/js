import { LinkProps, CTA } from "./types.js";

/**
 * Get the link from a CTA
 *
 * @param cta - CTA
 * @returns a valid href tag
 */
const getHref = (cta: CTA): string => {
  if (cta.linkType === "Email" || (!cta.linkType && isEmail(cta.link))) {
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
 * Checks if is a valid email address
 *
 * Regex defined in HTML Spec for <input type="email"> validation.
 * https://html.spec.whatwg.org/#email-state-(type=email)
 */
const isEmail = (link: string): boolean => {
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
const reverse = (string: string): string => {
  let o = "";
  for (let i = string.length - 1; i >= 0; o += string[i--]) {
    // intentionally empty, logic happens in the for loop iteration
  }
  return o;
};

/**
 * Get the CTA from the props if it exists, or return a CTA using the href prop.
 */
const getLinkFromProps = (props: LinkProps): CTA => {
  return props.cta ?? { link: props.href };
};

export { getHref, isEmail, getLinkFromProps, reverse };
