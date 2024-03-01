import { useContext } from "react";
import { getRuntime } from "../../util/index.js";
import { AnalyticsContext } from "./context.js";
import { AnalyticsMethods, TrackProps } from "./interfaces.js";
import { useScope } from "./scope.js";

declare global {
  interface Window {
    setAnalyticsOptIn: () => void;
  }
}

/**
 * The useAnalytics hook can be used anywhere in the tree below a configured
 * AnalyticsProvider.  Calling it will return an object to give you access to
 * the analytics convenience methods for use in your components,
 * such as track(), pageView(), optIn() etc.
 *
 * @public
 */
export function useAnalytics(): AnalyticsMethods | null {
  const ctx = useContext(AnalyticsContext);

  if (!ctx) {
    return ctx;
  }

  // TODO: is this the right way / place to expose a callback for use by a Cookie Management banner?
  if (getRuntime().name === "browser" && !window.setAnalyticsOptIn) {
    window.setAnalyticsOptIn = async () => {
      await ctx.optIn();
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const scope = useScope();

  // TODO: this is ugly, I imagine there is a more elegant way of doing this
  return {
    getDebugEnabled(): boolean {
      return ctx.getDebugEnabled();
    },
    setDebugEnabled(enabled: boolean): void {
      return ctx.setDebugEnabled(enabled);
    },
    identify(visitor: Record<string, string>): void {
      return ctx.identify(visitor);
    },
    optIn(): Promise<void> {
      return ctx.optIn();
    },
    pageView(): Promise<void> {
      return ctx.pageView();
    },
    track(props: TrackProps): Promise<void> {
      return ctx.track({
        ...props,
        scope: props.scope ?? scope, // prefer specific scope over hook
      });
    },
  };
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
 * Simpler hook that just returns returns the analytics pageView method
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
