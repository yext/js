import { TemplateProps } from "./types.js";
import { getRuntime, isProduction } from "../../util/index.js";
import { AnalyticsMethods, TrackProps } from "./interfaces.js";
import {
  AnalyticsConfig,
  AnalyticsEventService,
  Environment,
  EventPayload,
  Region,
  analytics,
} from "@yext/analytics";
import { concatScopes, slugify } from "./helpers.js";
import { getPartition } from "../../util/partition.js";

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
  private _enableDebugging = false;

  /**
   * Creates an Analytics instance, will fire a pageview event if requireOptin
   * is false
   *
   * @param templateData - template data object from the pages system
   * @param requireOptIn - boolean, set to true if you require user opt in before tracking analytics
   */
  constructor(
    private apiKey: string,
    private templateData: TemplateProps,
    requireOptIn?: boolean | undefined,
    private productionDomains: string[] = [],
    disableSessionTracking?: boolean | undefined
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

    // Don't fire analytics for non-production domains
    if (!isProduction(...this.productionDomains)) {
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
    };

    const defaultPayload: EventPayload = {
      pages: {
        siteUid: this.templateData.document.siteId as number,
        template: this.templateData.document.__.name,
      },
      entity: this.templateData.document.uid as number,
      // add currency default
      // make currency optional on link and provider
    };

    this._analyticsEventService = analytics(config).with(defaultPayload);

    this.setDebugEnabled(this._enableDebugging);
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

    const { action, scope, eventName, value } = props;

    // TODO: uppercase the string part in C_{strin}
    await this._analyticsEventService?.report({
      action,
      // Do we want to slugify the label? It's slugified for legacyEventName
      label: slugify(scope) || "",
      pages: {
        // does this wipe siteUid/template?
        legacyEventName: concatScopes(scope || "", slugify(eventName) || ""),
      },
      value,
    });
  }

  /** {@inheritDoc AnalyticsMethods.getDebugEnabled} */
  getDebugEnabled(): boolean {
    return this._enableDebugging;
  }

  /** {@inheritDoc AnalyticsMethods.setDebugEnabled} */
  setDebugEnabled(enabled: boolean): void {
    // TODO: is this needed? Need something in new lib
    this._enableDebugging = enabled;
  }
}
