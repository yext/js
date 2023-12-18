import { Action } from "@yext/analytics";

/**
 * Constants for available link types.
 *
 * @public
 */
export const LinkTypes = {
  URL: "URL",
  Email: "Email",
  Phone: "Phone",
} as const;

/**
 * Type of link types that might be received from the platform.
 *
 * @public
 */
export type LinkType = (typeof LinkTypes)[keyof typeof LinkTypes];

/**
 * Type for CTA field
 * Note that when coming from the platform the label will always be a string
 * but ReactNode allows for more general usage.
 *
 * @public
 */
export interface CTA {
  link: string;
  label?: React.ReactNode;
  linkType?: LinkType;
}

/**
 * Configuration options available for any usages of the Link component.
 */
interface LinkConfig
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  obfuscate?: boolean;
  /**
   * @deprecated Use action instead
   */
  eventName?: string;

  action?: Action; // will be required once eventName is removed
  scope?: string; // can be set directly or using the scope provider
  value?: { amount: number; currency?: string };
}

/**
 * The shape of the data passed to {@link Link} when directly passing an HREF to the Link component.
 *
 * @public
 */
export interface HREFLinkProps extends LinkConfig {
  href: string;
  cta?: never;
}

/**
 * The shape of the data passed to {@link Link} when using a CTA field, and not overriding children.
 *
 * @public
 */
export interface CTAWithChildrenLinkProps extends LinkConfig {
  href?: never;
  cta: CTA;
  children?: React.ReactNode;
}

/**
 * The shape of the data passed to {@link Link} when using a CTA field, and overriding children.
 *
 * @public
 */
export interface CTAWithoutChildrenLinkProps extends LinkConfig {
  href?: never;
  cta: Omit<CTA, "label">;
  children: React.ReactNode;
}

/**
 * The shape of the data passed to {@link Link} when using a CTA field.
 */
type CTALinkProps = CTAWithChildrenLinkProps | CTAWithoutChildrenLinkProps;

/**
 * The shape of the data passed to {@link Link}.
 *
 * @public
 */
export type LinkProps = CTALinkProps | HREFLinkProps;
