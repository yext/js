import { Action } from "@yext/analytics";
import { TemplateProps } from "./types.js";

export type TrackProps = {
  action: Action;
  destinationUrl: string;
  scope?: string;
  eventName?: string;
  amount?: number;
  currency?: string;
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
   * The ISO 4217 currency code of the currency the value is expressed in.
   * For example, "USD" for US dollars.
   *
   * For more information see https://www.iso.org/iso-4217-currency-codes.html.
   */
  currency: string;

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
   * in the Browser's developer console. When true, events will only be logged
   * and will NOT be fired/sent through the Analytics SDK.
   */
  enableDebugging?: boolean | undefined;
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
