import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import { concatScopes } from "./helpers.js";
import { AnalyticsScopeProps } from "./interfaces.js";
import { useAnalytics } from "./hooks.js";

const ScopeContext = createContext({ name: "" });

/**
 * The useScope hook will return the current scope from the Analytics Scope. For
 * use within the context of an AnalyticsScopeProvider for scoping analytics events.
 */
export const useScope = () => {
  const ctx = useContext(ScopeContext);
  return ctx.name;
};

/**
 * The AnalyticsScopeProvider will allow you to pre-pend a given string to all
 * events that happen in the node tree below where setScope is called.
 * For example, if you call setScope('header') and there is an `a` element
 * below whose onClick calls `track('my link')` the calculated event name
 * that will be sent to Yext Analytics is `header_mylink`
 *
 * @param props - AnalyticsScopeProps
 */
export function AnalyticsScopeProvider(
  props: PropsWithChildren<AnalyticsScopeProps>
): React.ReactElement {
  const parentScope = useScope();
  const [combinedScope] = useState({
    name: concatScopes(parentScope, props.name),
  });
  const debugEnabled = useAnalytics()?.getDebugEnabled();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (debugEnabled && isClient) {
    return (
      <section data-ya-scope={combinedScope.name}>
        <ScopeContext.Provider value={combinedScope}>
          {props.children}
        </ScopeContext.Provider>
      </section>
    );
  }

  return (
    <ScopeContext.Provider value={combinedScope}>
      {props.children}
    </ScopeContext.Provider>
  );
}
