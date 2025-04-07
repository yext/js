import {
  PropsWithChildren,
  useRef,
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";
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
    disableSessionTracking,
    enableDebugging,
  } = props;

  const analyticsRef = useRef<AnalyticsMethods | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (analyticsRef.current === null) {
    analyticsRef.current = new Analytics(
      apiKey,
      currency,
      templateData,
      requireOptIn,
      disableSessionTracking,
      enableDebugging ?? debuggingParamDetected()
    );
  }

  const analytics = analyticsRef.current;

  // Adds enableYextAnalytics to the window. Typically used during consent banner implementation.
  useEffect(() => {
    (window as any).enableYextAnalytics = () => {
      analytics.optIn();
    };

    return () => {
      delete (window as any).enableYextAnalytics;
    };
  }, [analytics]);

  return (
    <>
      <AnalyticsContext.Provider value={analytics}>
        {children}
      </AnalyticsContext.Provider>
      {isClient &&
      (enableDebugging || debuggingParamDetected()) &&
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
export function debuggingParamDetected(): boolean {
  if (getRuntime().name !== "browser") {
    return false;
  }
  if (typeof window === undefined) {
    return false;
  }
  const currentUrl = new URL(window.location.href);
  return !!currentUrl.searchParams.get("xYextDebug");
}
