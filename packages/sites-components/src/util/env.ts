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
  if (runtime.name !== "browser") {
    return false;
  }

  const currentHostname = window?.location?.hostname;
  
  if (domains.length === 0) {
    return (
      !currentHostname.equals("localhost") &&
      !currentHostname.includes("preview.pagescdn.com");
    )
  }

  return (
    domains.some(domain => domain?.includes(currentHostname))
  );
};
