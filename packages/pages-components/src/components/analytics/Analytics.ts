import { TemplateProps } from "./types.js";
import { getRuntime, isProduction } from "../../util/index.js";
import { AnalyticsMethods, TrackProps } from "./interfaces.js";
import {
  AnalyticsConfig,
  AnalyticsEventService,
  EventPayload,
  Region,
  analytics,
} from "@yext/analytics";
import { concatScopes, slugify } from "./helpers.js";
import { getPartition } from "../../util/partition.js";
import { debuggingParamDetected } from "./provider.js";

/**
 * The Analytics class creates a stateful facade in front of the \@yext/analytics
 * Library's pagesAnalyticsProvider class. It takes in some data from the
 * template configuration and uses it to provide configuration to the
 * pagesAnalyticsProvider.
 *
 * Additionally, it provides handlers for controlling user opt-in for compliance
 * requirements as well as for debugging, enabling conversion tracking, saving
 * user identity information, and creating named analytics scopes for
 * easy tagging.
 *
 * @public
 */
export class Analytics implements AnalyticsMethods {
  private _optedIn: boolean;
  private _sessionTrackingEnabled: boolean;
  private _analyticsEventService: AnalyticsEventService | undefined;
  private _pageViewFired = false;

  /**
   * Creates an Analytics instance, will fire a pageview event if requireOptin
   * is false
   *
   * @param apiKey - the Yext API key for authorizing analytics events
   * @param defaultCurrency - the ISO 4217 currency code to use for valued events
   * @param templateData - template data object from the pages system
   * @param requireOptIn - boolean, set to true if you require user opt in before tracking analytics
   * @param disableSessionTracking - turns off session tracking
   * @param productionDomains - the domains to fire Yext analytics on. Only necessary if this code is being run in the context of a Yext module.
   * @param enableDebugging - turns debug mode on meaning requests are logged instead
   */
  constructor(
    private apiKey: string,
    private defaultCurrency: string,
    private templateData: TemplateProps,
    requireOptIn?: boolean,
    disableSessionTracking?: boolean,
    private productionDomains?: string[],
    private enableDebugging: boolean = false
  ) {
    this._optedIn = !requireOptIn;
    this._sessionTrackingEnabled = !disableSessionTracking;
    this.makeReporter();
    this.pageView();
  }

  private makeReporter() {
    if (getRuntime().name !== "browser") {
      return;
    }
    if (!this._optedIn) {
      return;
    }

    // Don't fire analytics for non-production domains, unless debug enabled
    if (
      !isProduction(...(this.productionDomains ?? [])) &&
      !this.getDebugEnabled()
    ) {
      console.warn("Yext Analytics disabled for non-production domains");
      return;
    }

    const region = getPartition(
      this.templateData.document.businessId
    ) as Region;

    const config: AnalyticsConfig = {
      authorizationType: "apiKey",
      authorization: this.apiKey,
      env: "PRODUCTION",
      region: region || "US",
      sessionTrackingEnabled: this._sessionTrackingEnabled,
      debug: this.getDebugEnabled(),
    };

    const defaultPayload: EventPayload = {
      pages: {
        siteUid: this.templateData.document.siteId as number,
        template: this.templateData.document.__.name,
      },
      entity: (this.templateData.document.uid as number) || undefined,
      pageUrl: document.URL,
      referrerUrl: document.referrer !== "" ? document.referrer : undefined,
    };

    this._analyticsEventService = analytics(config).with(defaultPayload);
  }

  private canTrack(): boolean {
    return (
      getRuntime().name === "browser" &&
      this._optedIn &&
      !!this._analyticsEventService
    );
  }

  /** {@inheritDoc AnalyticsMethods.identify} */
  identify(visitor: Record<string, string>): void {
    if (this.canTrack()) {
      if (this._analyticsEventService) {
        this._analyticsEventService = this._analyticsEventService.with({
          visitor: visitor,
        });
      }
    }
  }

  /** {@inheritDoc AnalyticsMethods.async} */
  async optIn(): Promise<void> {
    this._optedIn = true;
    this.makeReporter();

    if (!this._pageViewFired) {
      await this.pageView();
    }
  }

  /** {@inheritDoc AnalyticsMethods.async} */
  async pageView(): Promise<void> {
    if (!this.canTrack()) {
      return Promise.resolve(undefined);
    }

    await this._analyticsEventService?.report({
      action: "PAGE_VIEW",
    });

    this._pageViewFired = true;
  }

  /** {@inheritDoc AnalyticsMethods.track} */
  async track(props: TrackProps): Promise<void> {
    if (!this.canTrack()) {
      return Promise.resolve();
    }

    const {
      action,
      scope,
      eventName,
      currency,
      amount,
      destinationUrl,
      customTags,
      customValues,
    } = props;

    let value;
    if (amount) {
      value = {
        amount: amount,
        currency: currency || this.defaultCurrency,
      };
    }

    await this._analyticsEventService?.report({
      action,
      pages: {
        scope: slugify(scope) || undefined,
        originalEventName: concatScopes(scope || "", slugify(eventName) || ""),
      },
      value,
      destinationUrl,
      customTags,
      customValues,
    });
  }

  /** {@inheritDoc AnalyticsMethods.getDebugEnabled} */
  getDebugEnabled(): boolean {
    return this.enableDebugging || debuggingParamDetected();
  }
}
