// src/com/yext/profilefields/builtin/registration/StandardTypeCreator.java contains some of these built-in CTA types
/**
 * Constants for available link types.
 *
 * @public
 */
export const LinkTypes = {
  URL: "URL",
  EMAIL: "EMAIL",
  PHONE: "PHONE",
  DRIVING_DIRECTIONS: "DRIVING_DIRECTIONS",
  CLICK_TO_WEBSITE: "CLICK_TO_WEBSITE",
  OTHER: "OTHER",
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
  /** Obfuscates the href and label. */
  obfuscate?: boolean;
  /** The custom name of the event. */
  eventName?: string;
  /** Scope the specific link event. Overrides the scope set by the provider. */
  scope?: string;
  /**
   * The ISO 4217 currency code of the currency the value is expressed in.
   * Overrides the defaultCurrency set on the provider.
   * For example, "USD" for US dollars.
   *
   * For more information see https://www.iso.org/iso-4217-currency-codes.html.
   */
  currency?: string;
  /** The monetary value of the event. */
  amount?: number;
  /**
   * Up to 10 pairs matching custom string keys to string values to associate with the event.
   * Keys are case-insensitive; values are case-sensitive.
   */
  customTags?: Record<string, string>;
  /**
   * Up to 10 pairs matching custom string keys to number values to associate with the event.
   * Keys are case-insensitive.
   */
  customValues?: Record<string, number>;
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
