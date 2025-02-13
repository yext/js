import { forwardRef } from "react";
import classNames from "classnames";
import { useAnalytics } from "../analytics/index.js";
import { determineEvent, resolveAction, resolveCTA } from "./methods.js";
import type { CTA, LinkProps } from "./types.js";
import { Action } from "@yext/analytics";

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

    const resolvedCta: CTA = resolveCTA(props);
    const action: Action = resolveAction(resolvedCta, !!cta);
    const resolvedEventName = determineEvent(
      eventName,
      resolvedCta.linkType,
      !!cta
    );
    const analytics = useAnalytics();

    const isObfuscate =
      obfuscate || (obfuscate !== false && resolvedCta.linkType === "EMAIL");

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
            scope: scope,
            eventName: resolvedEventName,
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
      : resolvedCta.link;

    const attributes: any = {
      className: classNames("Link", className),
      href: isObfuscate ? btoa(resolvedCta.link) : resolvedCta.link,
      onClick: handleClick,
      rel: props.target && !props.rel ? "noopener" : undefined,
      ref: ref,
    };

    if (analytics?.getDebugEnabled()) {
      attributes["data-ya-action"] = action;
      attributes["data-ya-scopeoverride"] = scope;
      attributes["data-ya-eventname"] = resolvedEventName;
    }

    // hydration warnings suppressed because they will show when the xYextDebug query param is used
    return (
      <a {...rest} {...attributes} suppressHydrationWarning={true}>
        {children || resolvedCta.label || renderedLink}
      </a>
    );
  }
);
