import { getRuntime } from "./runtime.js";

/**
 * Determines if the code is being executed on the production site on
 * the client. This is useful for things like firing analytics only
 * in production (opposed to dev or staging) and not during server side
 * rendering.
 *
 * @param domains The production domains of the site
 *
 * @public
 */
export const isProduction = (...domains: string[]): boolean => {
  const runtime = getRuntime();

  return (
    runtime.name === "browser" && domains.some(
      domain => domain?.includes(window?.location?.hostname))
  );
};
