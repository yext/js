import { createContext, useContext, useState, PropsWithChildren, useEffect, useMemo } from "react";
import { AnalyticsContext } from "./context.js";
import { concatScopes } from "./helpers.js";
import { AnalyticsMethods, AnalyticsScopeProps, TrackProps } from "./interfaces.js";

const ScopeContext = createContext({ name: "" });

/**
 * The useScope hook will return the current scope from the Analytics Scope. For
 * use within the context of an AnalyticsScopeProvider for scoping analytics events.
 */
export const useScope = () => {
  const ctx = useContext(ScopeContext);
  return ctx.name;
};

function createScopedAnalytics(analytics: AnalyticsMethods, scope: string): AnalyticsMethods {
  return new Proxy(analytics, {
    get(target, prop, receiver) {
      if (prop === "track") {
        return (trackProps: TrackProps) =>
          target.track({
            ...trackProps,
            scope: trackProps.scope ?? scope,
          });
      }

      const value = Reflect.get(target, prop, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

/**
 * The AnalyticsScopeProvider will allow you to pre-pend a given string to all
 * events that happen in the node tree below where setScope is called.
 * For example, if you call setScope('header') and there is an `a` element
 * below whose onClick calls `track('my link')` the calculated event name
 * that will be sent to Yext Analytics is `header_mylink`
 *
 * @param props - AnalyticsScopeProps
 */
export function AnalyticsScopeProvider(
  props: PropsWithChildren<AnalyticsScopeProps>
): React.ReactElement {
  const parentScope = useScope();
  const [combinedScope] = useState({
    name: concatScopes(parentScope, props.name),
  });
  const analytics = useContext(AnalyticsContext);
  const scopedAnalytics = useMemo<AnalyticsMethods | null>(() => {
    if (!analytics) {
      return analytics;
    }

    return createScopedAnalytics(analytics, combinedScope.name);
  }, [analytics, combinedScope.name]);
  const debugEnabled = scopedAnalytics?.getDebugEnabled();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const content = (
    <AnalyticsContext.Provider value={scopedAnalytics}>
      <ScopeContext.Provider value={combinedScope}>{props.children}</ScopeContext.Provider>
    </AnalyticsContext.Provider>
  );

  if (debugEnabled && isClient) {
    return <section data-ya-scope={combinedScope.name}>{content}</section>;
  }

  return content;
}
