import { useContext } from "react";
import { AnalyticsContext } from "./context.js";
import { AnalyticsMethods } from "./interfaces.js";

/**
 * The useAnalytics hook can be used anywhere in the tree below a configured
 * AnalyticsProvider. Calling it will return an object to give you access to
 * the analytics convenience methods for use in your components,
 * such as track(), pageView(), optIn() etc.
 *
 * @public
 */
export function useAnalytics(): AnalyticsMethods | null {
  return useContext(AnalyticsContext);
}

/**
 * Simpler hook that just returns the analytics track() method.
 *
 * @public
 */
export const useTrack = () => {
  return useAnalytics()?.track;
};

/**
 * Simpler hook that just returns the analytics pageView method
 *
 * @public
 */
export const usePageView = () => {
  return useAnalytics()?.pageView;
};

/**
 * Simpler hook that just returns the analytics identify method
 *
 * @public
 */
export const useIdentify = () => {
  return useAnalytics()?.identify;
};
