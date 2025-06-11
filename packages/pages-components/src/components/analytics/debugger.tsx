import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getRuntime } from "../../util/index.js";
import type {
  DebuggerTabs,
  EventData,
  EventMap,
  Event,
  TabProps,
  Tooltip,
  TooltipHandlerProps,
  TooltipsRefItem,
} from "./types.js";
import c from "classnames";
import "./debugger.css";

declare global {
  interface Window {
    debuggerInitialized: boolean;
  }
}

export default function AnalyticsDebugger() {
  // If multiple AnalyticsProviders are rendered, ensure that only one debugger is created.
  if (
    getRuntime().name !== "browser" ||
    window.hasOwnProperty("debuggerInitialized")
  ) {
    return null;
  }

  window.debuggerInitialized = true;
  return createPortal(<AnalyticsDebuggerInternal />, document.body);
}

const getEventData = (
  elem: HTMLElement,
  scope: string | undefined
): EventData => {
  const action = elem.dataset.yaAction!;
  const scopeOverride = elem.dataset.yaScopeoverride!;
  const eventName = elem.dataset.yaEventname!;
  const effectiveScope = scopeOverride || scope;

  return {
    action: action,
    originalEventName: effectiveScope
      ? `${effectiveScope}_${eventName}`
      : eventName,
    scope: effectiveScope,
  };
};

/**
 * Gets the closest parents up the parent tree that have a given selector.
 */
const getParents = (e: HTMLElement | null, selector: string): HTMLElement[] => {
  const results = [];
  let p = e;

  while (p?.parentElement) {
    p = p.parentElement.closest(selector);
    if (p) {
      results.push(p);
    }
  }
  return results;
};

// Track scope / event elements.
const data: EventMap = {};

const NO_SCOPE = "YA_NO_SCOPE";

const addToData = (
  scopeName: string,
  eventData: EventData,
  scopeEl: HTMLElement | undefined,
  eventEl: HTMLElement
) => {
  if (!data.hasOwnProperty(scopeName)) {
    data[scopeName] = {
      scopeEl: scopeEl || eventEl, // overidden scopes still need an element
      events: [
        {
          eventData: eventData,
          el: eventEl,
        },
      ],
    };
  } else {
    // Don't readd elements
    if (!data[scopeName].events.map((event) => event.el).includes(eventEl)) {
      data[scopeName].events = [
        ...data[scopeName].events,
        {
          eventData: eventData,
          el: eventEl,
        },
      ];
    }
  }
};

export function AnalyticsDebuggerInternal() {
  // Track whether the Events, Scope, or no tab is opened.
  const [activeTab, setActiveTab] = useState<DebuggerTabs>();
  // Track the event elements that need to have a tooltip added.
  const [tooltips, setTooltips] = useState<Tooltip[]>([]);
  // Indicate when effect has finished querying the DOM.
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleTabToggle = (tabName: DebuggerTabs) => {
    if (activeTab === tabName) {
      setActiveTab(undefined);
    } else {
      setActiveTab(tabName);
    }
  };

  useEffect(() => {
    let abortController: AbortController | null = null;

    const loadData = () => {
      // Remove existing event listeners.
      if (abortController) {
        abortController.abort();
      }
      const newController = new AbortController();
      abortController = newController;
      const signal = newController.signal;

      document.documentElement.classList.add("xYextDebug");

      const events: NodeListOf<HTMLElement> = document.querySelectorAll(
        "[data-ya-eventname]"
      );

      events.forEach((eventEl, idx) => {
        const scope = eventEl.closest("[data-ya-scope]") as
          | HTMLElement
          | undefined;
        const scopeName = scope?.dataset.yaScope;

        const elemData = getEventData(eventEl, scopeName);

        // Add tooltip when element is hovered.
        eventEl.addEventListener(
          "mouseenter",
          () => {
            setTooltips([
              {
                elem: eventEl,
                key: `${elemData.originalEventName}_${idx}`,
                action: elemData.action,
                originalEventName: elemData.originalEventName,
                scope: elemData.scope,
              },
            ]);
          },
          { signal }
        );

        // Remove tooltip.
        eventEl.addEventListener(
          "mouseleave",
          () => {
            setTooltips([]);
          },
          { signal }
        );

        const scopeOverride = eventEl.dataset.yaScopeoverride;
        if (scopeOverride) {
          addToData(scopeOverride, elemData, scope, eventEl);
        } else {
          const scopeNames = [
            scopeName,
            ...getParents(eventEl, "[data-ya-scope]").map(
              (scopeEl) => scopeEl.dataset.yaScope
            ),
          ];
          scopeNames.forEach((curScope) => {
            addToData(curScope || NO_SCOPE, elemData, scope, eventEl);
          });
        }
      });

      setDataLoaded(true);
    };

    // Run on initial load.
    loadData();

    // Watch for mutations to capture dynamically added analytics components.
    const observer = new MutationObserver(loadData);
    observer.observe(document, {
      childList: true,
      subtree: true,
    });
    return () => {
      document.documentElement.classList.remove("xYextDebug");
      observer.disconnect();
      abortController?.abort();
    };
  }, []);

  // Wait for all DOM nodes to be queried before rendering.
  if (!dataLoaded) {
    return null;
  }

  return (
    <>
      <div className="analytics-debugger">
        <div className="analytics-debugger-toggles">
          <button
            className={c("analytics-debugger-toggle", {
              "is-active": activeTab === "Events",
            })}
            onClick={() => handleTabToggle("Events")}
          >
            Events
          </button>
          <button
            className={c("analytics-debugger-toggle", {
              "is-active": activeTab === "Scopes",
            })}
            onClick={() => handleTabToggle("Scopes")}
          >
            Scopes
          </button>
        </div>
        {activeTab && (
          <div className="analytics-debugger-tabs">
            {activeTab === "Events" ? (
              <EventsTab data={data} setTooltips={setTooltips} />
            ) : (
              <ScopesTab data={data} setTooltips={setTooltips} />
            )}
          </div>
        )}
      </div>
      <TooltipHandler tooltips={tooltips} />
    </>
  );
}

/**
 * Groups the events by their original event name.
 */
const getEventsGroupedByName = (): Record<string, Event[]> => {
  const uniqueEvents: Record<string, Event[]> = {};

  Object.values(data).forEach((eventNode) => {
    eventNode.events.forEach((event) => {
      const { originalEventName } = event.eventData;

      if (!uniqueEvents[originalEventName]) {
        uniqueEvents[originalEventName] = [];
      }

      // Data is grouped by scope and repeats elements within children scopes. We need to avoid duplicates
      // at the eventName level.
      if (
        uniqueEvents[originalEventName].find(
          (uniqueEvent) => uniqueEvent.el === event.el
        )
      ) {
        return;
      }
      uniqueEvents[originalEventName].push(event);
    });
  });

  return uniqueEvents;
};

function EventsTab(props: TabProps) {
  const { setTooltips } = props;

  const [activeEventEls, setActiveEventEls] = useState<HTMLElement[]>([]);
  const [activeButton, setActiveButton] = useState("");

  const handleClick = (events: Event[], key: string) => {
    // Scroll all related elements into view and highlight them
    activeEventEls.forEach((el) =>
      el.classList.remove("analytics-event-highlight")
    );

    const newActiveEls = events.map((event) => {
      event.el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      event.el.classList.add("analytics-event-highlight");
      return event.el;
    });

    setActiveEventEls(newActiveEls);
    setActiveButton(key);

    // Set tooltips for all related events
    setTooltips(
      events.map((event, idx) => ({
        elem: event.el,
        key: `${event.eventData.originalEventName}_${idx}`,
        action: event.eventData.action,
        originalEventName: event.eventData.originalEventName,
        scope: event.eventData.scope,
      }))
    );
  };

  return (
    <div className="analytics-debugger-tab">
      <h2 className="analytics-debugger-tab-title">Event Names</h2>
      <ul className="analytics-debugger-list">
        {Object.entries(getEventsGroupedByName()).map(
          ([originalEventName, events], idx) => {
            const key = `${originalEventName}_${idx}`;

            return (
              <li className="analytics-debugger-listItem" key={key}>
                <button
                  className={c("analytics-debugger-button", {
                    "is-active": key === activeButton,
                  })}
                  onClick={() => handleClick(events, key)}
                >
                  {originalEventName}
                </button>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}

function ScopesTab(props: TabProps) {
  const { data, setTooltips } = props;

  const [activeButton, setActiveButton] = useState("");

  const handleClick = (scopeName: string) => {
    const eventNode = data[scopeName];
    if (eventNode.scopeEl) {
      eventNode.scopeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });

      setActiveButton(scopeName);

      setTooltips(
        eventNode.events.map((event, idx) => {
          const eventData = event.eventData;

          return {
            elem: event.el,
            key: `${eventData.originalEventName}_${idx}`,
            action: eventData.action,
            originalEventName: eventData.originalEventName,
            scope: eventData.scope,
          };
        })
      );
    }
  };

  return (
    <div className="analytics-debugger-tab">
      <h2 className="analytics-debugger-tab-title">Scope Names</h2>
      <ul className="analytics-debugger-list">
        {Object.keys(data).map((scopeName, idx) => {
          if (scopeName !== NO_SCOPE) {
            return (
              <li className="analytics-debugger-listItem" key={scopeName + idx}>
                <button
                  className={c("analytics-debugger-button", {
                    "is-active": scopeName === activeButton,
                  })}
                  onClick={() => handleClick(scopeName)}
                >
                  {scopeName}
                </button>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}

function TooltipHandler(props: TooltipHandlerProps) {
  const tooltipRefs = useRef<Record<string, TooltipsRefItem>>({});

  useEffect(() => {
    if (!tooltipRefs.current) return;

    for (const item of Object.values(tooltipRefs.current)) {
      const otherTooltips = Object.values(tooltipRefs.current)
        .map((val) => val.el)
        .filter((el) => el !== item.el);
      setTooltipPosition(item, otherTooltips);
      item.el.style.visibility = "visible";
    }
  }, [props.tooltips]);

  return (
    <>
      {props.tooltips.map((tooltip) => (
        <div
          key={tooltip.key}
          style={{ visibility: "hidden" }} // Hide element before final position is calculated.
          className="analytics-debugger-tooltip"
          ref={(el) => {
            if (el) {
              tooltipRefs.current[tooltip.key] = {
                el,
                tooltip,
              };
            } else {
              delete tooltipRefs.current[tooltip.key];
            }
          }}
        >
          <span>Action: {tooltip.action}</span>
          <br />
          <span>Scope: {tooltip.scope}</span>
          <br />
          <span>Original Event Name: {tooltip.originalEventName}</span>
        </div>
      ))}
    </>
  );
}

// Find tooltip position that is in the window bounds and doesn't overlap with other tooltips.
function setTooltipPosition(
  item: TooltipsRefItem,
  instances: HTMLDivElement[]
) {
  for (let i = 0; i < 9; i++) {
    // Get base position and position the tooltip.
    const position = positionFinder(
      item.tooltip.elem.getBoundingClientRect(),
      item.el,
      i
    );
    item.el.style.inset = `${position.top} auto auto ${position.left}`;

    // Check if tooltip is in the window bounds.
    const withinBounds = !inWindowBounds(
      item.el.getBoundingClientRect().left,
      item.el.getBoundingClientRect().top + window.scrollY,
      item.el.getBoundingClientRect().right,
      item.el.getBoundingClientRect().bottom + window.scrollY
    );
    if (!withinBounds) continue;

    // Check if tooltip overlaps with others.
    let valid = true;
    for (let j = 0; j < instances.length; j++) {
      const neighbor = instances[j];
      if (isOverlapping(item.el, neighbor)) {
        valid = false;
      }
    }
    if (valid) break;
  }
}

// Check if two tooltips are overlapping with each other.
function isOverlapping(
  tooltip: HTMLDivElement,
  futureNeighbor: HTMLDivElement
): boolean {
  const y1 = tooltip.getBoundingClientRect().top + window.scrollY;
  const x1 = tooltip.getBoundingClientRect().left;
  const y2 = y1 + tooltip.clientHeight;
  const x2 = x1 + tooltip.clientWidth;

  const b1 = futureNeighbor.getBoundingClientRect().top + window.scrollY;
  const a1 = futureNeighbor.getBoundingClientRect().left;
  const b2 = b1 + futureNeighbor.clientHeight;
  const a2 = a1 + futureNeighbor.clientWidth;

  const check = (
    x1: number,
    y1: number,
    a1: number,
    b1: number,
    x2: number,
    y2: number,
    a2: number,
    b2: number
  ) => {
    return (
      (a1 <= x2 && x2 <= a2 && b1 <= y2 && y2 <= b2) ||
      (a1 <= x1 && x1 <= a2 && b1 <= y1 && y1 <= b2) ||
      (a1 <= x1 && x1 <= a2 && b1 <= y2 && y2 <= b2) ||
      (a1 <= x2 && x2 <= a2 && b1 <= y1 && y1 <= b2)
    );
  };

  return (
    check(x1, y1, a1, b1, x2, y2, a2, b2) ||
    check(a1, b1, x1, y1, a2, b2, x2, y2)
  );
}

// Check if a tooltip is within the window bounds.
function inWindowBounds(x1: number, y1: number, x2: number, y2: number) {
  return (
    x1 < 0 ||
    x2 > window.innerWidth ||
    y1 < 0 ||
    y2 > document.documentElement.scrollHeight
  );
}

// Possible positions for a given tooltip around it's target element.
function positionFinder(rect: DOMRect, tooltip: HTMLDivElement, index: number) {
  const tooltipHeight = tooltip.clientHeight;
  const tooltipWidth = tooltip.clientWidth;

  let left;
  let top;
  switch (index) {
    // case 'top-left'
    case 0: {
      top = window.scrollY + rect.top - tooltipHeight + "px";
      left = rect.left - tooltipWidth + "px";
      break;
    }
    // case 'top-inner-left'
    case 1: {
      top = window.scrollY + rect.top - tooltipHeight + "px";
      left = rect.left + "px";
      break;
    }
    // case 'top-right'
    case 2: {
      top = window.scrollY + rect.top - tooltipHeight + "px";
      left = rect.right + "px";
      break;
    }
    // case 'top-inner-right'
    case 3: {
      top = window.scrollY + rect.top - tooltipHeight + "px";
      left = rect.right - tooltipWidth + "px";
      break;
    }
    // case 'bottom-left'
    case 4: {
      top = window.scrollY + rect.bottom + "px";
      left = rect.left - tooltipWidth + "px";
      break;
    }
    // case 'bottom-inner-left'
    case 5: {
      top = window.scrollY + rect.bottom + "px";
      left = rect.left + "px";
      break;
    }
    // case 'bottom-inner-right'
    case 6: {
      top = window.scrollY + rect.bottom + "px";
      left = rect.right - tooltipWidth + "px";
      break;
    }
    // case 'bottom-right'
    case 7: {
      top = window.scrollY + rect.bottom + "px";
      left = rect.right + "px";
      break;
    }
    default: {
      top = 0;
      left = 0;
    }
  }

  return {
    top: top,
    left: left,
  };
}
