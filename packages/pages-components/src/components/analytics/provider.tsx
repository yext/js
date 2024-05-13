import { PropsWithChildren, useRef, lazy, Suspense } from "react";
import { getRuntime } from "../../util/index.js";
import { Analytics } from "./Analytics.js";
import { AnalyticsMethods, AnalyticsProviderProps } from "./interfaces.js";
import { AnalyticsContext } from "./context.js";
const AnalyticsDebugger = lazy(() => import("./debugger.js"));

/**
 * The main Analytics component for you to use. Sets up the proper react context
 * and bootstraps the Analytics reporter.
 *
 * @param props - A PropsWithChildren that implements AnalyticsProviderProps
 *
 * @public
 */
export function AnalyticsProvider(
  props: PropsWithChildren<AnalyticsProviderProps>
): JSX.Element {
  const {
    children,
    apiKey,
    currency,
    templateData,
    requireOptIn,
    productionDomains,
    disableSessionTracking,
    enableDebugging,
  } = props;

  const analyticsRef = useRef<AnalyticsMethods | null>(null);

  let enableDebuggingDefault = debuggingParamDetected();
  if (getRuntime().name === "node") {
    enableDebuggingDefault =
      enableDebuggingDefault || process.env?.NODE_ENV === "development";
  }

  if (analyticsRef.current === null) {
    analyticsRef.current = new Analytics(
      apiKey,
      currency,
      templateData,
      requireOptIn,
      productionDomains,
      disableSessionTracking,
      enableDebugging ?? enableDebuggingDefault
    );
  }

  const analytics = analyticsRef.current;

  return (
    <>
      <AnalyticsContext.Provider value={analytics}>
        {children}
      </AnalyticsContext.Provider>
      {(enableDebugging ?? enableDebuggingDefault) &&
      getRuntime().name === "browser" ? (
        <Suspense fallback={<></>}>
          <AnalyticsDebugger />
        </Suspense>
      ) : null}
    </>
  );
}

/**
 * This will look for the xYextDebug parameter and if it is present,
 * enable analytics debugging.
 */
function debuggingParamDetected(): boolean {
  if (getRuntime().name !== "browser") {
    return false;
  }
  if (typeof window === undefined) {
    return false;
  }
  const currentUrl = new URL(window.location.href);
  return !!currentUrl.searchParams.get("xYextDebug");
}
