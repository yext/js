import { forwardRef } from "react";
import classNames from "classnames";
import { useAnalytics } from "../analytics/index.js";
import { getHref, getLinkFromProps, isEmail } from "./methods.js";
import type { CTA, LinkProps } from "./types.js";

/**
 * Renders an anchor tag using either a directly provided HREF or from a field in the Yext Knowledge Graph.
 *
 * Example of using the component to render
 * a link with and without sourcing from a knowledge graph field:
 *
 * @example
 * ```ts
 * import { Link } from "@yext/pages/components";
 *
 * <Link href="/search">Locator</Link>
 * <Link cta={document.c_exampleCTA} />
 * <Link cta={{link: "https://www.yext.com", label: "Click Here", linkType: "URL"}} />
 * ```
 *
 * @public
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const link: CTA = getLinkFromProps(props);
    const {
      children,
      onClick,
      className,
      eventName,
      scope,
      currency,
      amount,
      cta,
      obfuscate,
      customTags,
      customValues,
      ...rest
    } = props;

    const action = cta ? "CTA_CLICK" : "LINK";
    const trackEvent = eventName ? eventName : cta ? "cta" : "link";
    const analytics = useAnalytics();

    if (!link?.link) {
      throw new Error("CTA's link is undefined");
    }

    const isObfuscate =
      obfuscate || (obfuscate !== false && isEmail(link.link));

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
      const currentTarget = e.currentTarget;
      let decodedLink = "";

      if (isObfuscate) {
        // must happen before the async call
        e.preventDefault();

        const encodedLink = currentTarget.href.split("/").at(-1);
        if (encodedLink) {
          decodedLink = atob(encodedLink);
        }
      }

      if (analytics !== null) {
        try {
          await analytics.track({
            action: action,
            scope: props.scope,
            eventName: trackEvent,
            currency: currency,
            amount: amount,
            destinationUrl: decodedLink || currentTarget.href,
            customTags: customTags,
            customValues: customValues,
          });
        } catch (exception) {
          console.error("Failed to report click Analytics Event");
        }
      }

      if (onClick) {
        onClick(e);
      }

      if (decodedLink) {
        window.location.href = decodedLink;
      }
    };

    const renderedLink = isObfuscate
      ? "Obfuscated, set a label or child"
      : link.link;

    const attributes: any = {
      className: classNames("Link", className),
      href: isObfuscate ? btoa(getHref(link)) : getHref(link),
      onClick: handleClick,
      rel: props.target && !props.rel ? "noopener" : undefined,
      ref: ref,
    };

    if (analytics?.getDebugEnabled()) {
      attributes["data-ya-action"] = action;
      attributes["data-ya-scopeoverride"] = scope;
      attributes["data-ya-eventname"] = trackEvent;
    }

    // hydration warnings suppressed because they will show when the xYextDebug query param is used
    return (
      <a {...rest} {...attributes} suppressHydrationWarning={true}>
        {children || link.label || renderedLink}
      </a>
    );
  }
);
