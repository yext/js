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
