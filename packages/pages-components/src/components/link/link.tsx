import React, { useState } from "react";
import classNames from "classnames";
import { useAnalytics } from "../analytics/index.js";
import { getHref, isEmail, isHREFProps, reverse } from "./methods.js";
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
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const link: CTA = isHREFProps(props) ? { link: props.href } : props.cta;
    const {
      children,
      onClick,
      className,
      eventName,
      scope,
      currency,
      amount,
      cta,
      ...rest
    } = props;

    const action = cta ? "CTA_CLICK" : "LINK";
    const trackEvent = eventName ? eventName : cta ? "cta" : "link";
    const analytics = useAnalytics();

    const obfuscate =
      props.obfuscate || (props.obfuscate !== false && isEmail(link.link));
    const [humanInteraction, setHumanInteraction] = useState<boolean>(false);

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
      setHumanInteraction(true);
      if (analytics) {
        try {
          await analytics.track({
            action: action,
            scope: props.scope,
            eventName: trackEvent,
            currency: currency,
            amount: amount,
          });
        } catch (exception) {
          console.error("Failed to report click Analytics Event");
        }
      }

      if (onClick) {
        onClick(e);
      }
    };

    const useLinkAsLabel = !children && !link.label;
    const isObfuscate = !humanInteraction && obfuscate;
    const obfuscatedStyle: React.CSSProperties = {
      ...props.style,
      unicodeBidi: "bidi-override",
      direction: useLinkAsLabel && isObfuscate ? "rtl" : "ltr",
    };

    const renderedLink = isObfuscate ? reverse(link.link) : link.link;

    const attributes: any = {
      className: classNames("Link", className),
      href: humanInteraction || !obfuscate ? getHref(link) : "obfuscate",
      onClick: handleClick,
      rel: props.target && !props.rel ? "noopener" : undefined,
      ref: ref,
      style: obfuscatedStyle,
    };

    if (analytics?.getDebugEnabled()) {
      attributes["data-ya-action"] = action;
      attributes["data-ya-scopeoverride"] = scope;
      attributes["data-ya-eventname"] = trackEvent;
    }

    return (
      <a {...attributes} {...rest}>
        {children || link.label || renderedLink}
      </a>
    );
  }
);
