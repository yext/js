import { Action } from "@yext/analytics";
import { TemplateProps } from "./types.js";

export type TrackProps = {
  action: Action;
  scope?: string;
  eventName?: string;
  value?: { amount: number; currency?: string }; // needs type
};

/**
 * The AnalyticsMethod interface specifies the methods that can be used with
 * the Analytics Provider.
 *
 */
export interface AnalyticsMethods {
  /**
   * The track method will send a generic analytics event to Yext.
   *
   * @param eventName - the name of the event, will appear in Yext's Report Builder UI
   * @param conversionData - optional details for tracking an event as a conversion
   */
  track(props: TrackProps): Promise<void>;

  /**
   * The identify method will allow you to tie analytics events to a specific user.
   *
   * @param visitor - the Visitor object
   */
  identify(visitor: Record<string, string>): void;

  /**
   * The pageView method will track a pageview event.
   */
  pageView(): Promise<void>;

  /**
   * The optIn method should be called when a user opts into analytics tracking,
   * e.g. via a Consent Management Banner or other opt-in method.
   */
  optIn(): Promise<void>;

  /**
   * Use the getDebugEnabled method to retrieve whether debugging is on or off.
   */
  getDebugEnabled(): boolean;

  /**
   * Use the setDebugEnabled method to toggle debugging on or off. Currently,
   * this will log tracked events to the dev console.
   *
   * @param enabled - boolean value for whethere debugging should be on or off.
   */
  setDebugEnabled(enabled: boolean): void;
}

/**
 * The AnalyticsProviderProps interface represents the component properties
 * to be passed into the AnalyticsProvider.
 *
 * @public
 */
export interface AnalyticsProviderProps {
  /**
   * The API Key or OAuth for accessing the Analytics Events API
   */
  apiKey: string;

  /**
   * The TemplateProps that come from the rendering system
   */
  templateData: TemplateProps;

  /**
   * requireOptIn should be set to true if your compliance requirements require
   * you to put all marketing analytics behind a user opt-in banner or if you
   * use a Compliance Management tool of some kind.
   */
  requireOptIn?: boolean | undefined;

  /**
   * disableSessionTracking will set sessionId to undefined in the event payload
   * when a user does any trackable action on your site, such as a page view,
   * click, etc.
   */
  disableSessionTracking?: boolean | undefined;

  /**
   * enableDebugging can be set to true if you want to expose tracked events
   * in the developer console.
   */
  enableDebugging?: boolean | undefined;

  /**
   * isStaging() will evaluate to false if the the event is fired from any of
   * provided domains in productionDomains.
   */
  productionDomains?: string[];
}

/**
 * AnalyticsScopeProps defines the component properties required by the
 * AnalyticsScopeProvider component.
 *
 * @public
 */
export interface AnalyticsScopeProps {
  /**
   * The string to prepend to all analytics events that come from components
   * below the AnalyticsScopeProvider component in the tree.
   */
  name: string;
}
