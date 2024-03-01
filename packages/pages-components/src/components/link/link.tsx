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
    const { children, onClick, className, eventName, cta, ...rest } = props;

    const trackEvent = eventName ? eventName : cta ? "cta" : "link";
    const analytics = useAnalytics();

    const obfuscate =
      props.obfuscate || (props.obfuscate !== false && isEmail(link.link));
    const [humanInteraction, setHumanInteraction] = useState<boolean>(false);

    // TODO: is the action/eventName right?
    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
      setHumanInteraction(true);
      if (analytics !== null) {
        try {
          if (props.action) {
            await analytics.track({
              action: props.action,
              eventName: trackEvent,
              value: props.value,
              scope: props.scope,
            });
          } else {
            // Keep this component backwards compatible with the previous analyics integration
            await analytics.track({
              action: eventName
                ? `C_${eventName}` // do we want scope
                : cta
                  ? "CTA_CLICK"
                  : `C_link`,
              eventName: trackEvent,
              value: props.value,
              scope: props.scope,
            });
          }
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

    return (
      <a
        className={classNames("Link", className)}
        href={humanInteraction || !obfuscate ? getHref(link) : "obfuscate"}
        onClick={handleClick}
        rel={props.target && !props.rel ? "noopener" : undefined}
        ref={ref}
        style={obfuscatedStyle}
        {...rest}
      >
        {children || link.label || renderedLink}
      </a>
    );
  }
);
