import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getRuntime } from "../../util";
import type { DebuggerTabs, EventData, TabProps, Tooltip, TooltipHandlerProps, TooltipsRefItem } from "./types";
import c from "classnames";
import "./debugger.css";

declare global {
    interface Window { debuggerInitialized: boolean; }
}

export function AnalyticsDebugger() {
    // If multiple AnalyticsProviders are rendered, ensure that only one debugger is created.
    if (getRuntime().name !== "browser" || window.hasOwnProperty("debuggerInitialized")) {
        return null;
    }

    window.debuggerInitialized = true;
    return createPortal(<AnalyticsDebuggerInternal />, document.body);
}

// Track scope / event elements.
const data: EventData = {};

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
    }

    useEffect(() => {
        document.documentElement.classList.add('xYextDebug');

        const scopes: NodeListOf<HTMLElement> = document.querySelectorAll('[data-ya-scope]');
        scopes.forEach(scope => {
            const scopeName = scope.dataset.yaScope;
            const events: NodeListOf<HTMLElement> = scope.querySelectorAll('[data-ya-track]');

            events.forEach((eventEl, idx) => {
                const eventName = eventEl.dataset.yaTrack;

                // Add tooltip when element is hovered.
                eventEl.addEventListener('mouseenter', () => {
                    setTooltips([{
                        eventEl,
                        eventName: `${scopeName}_${eventName}`,
                        key: `${scopeName}_${eventName}_${idx}`,
                    }]);
                });

                // Remove tooltip.
                eventEl.addEventListener('mouseleave', () => {
                    setTooltips([]);
                });
            });

            if (scopeName) {
                if (!data.hasOwnProperty(scopeName)) {
                    data[scopeName] = {
                        scope,
                        events: Array.from(events),
                    };
                } else {
                    data[scopeName].events = [...data[scopeName].events, ...Array.from(events)];
                }
            }
        });

        setDataLoaded(true);

        return () => {
            document.documentElement.classList.remove('xYextDebug');
        }
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
                        className={c("analytics-debugger-toggle", {"is-active": activeTab === "Events"})}
                        onClick={() => handleTabToggle("Events")}
                    >
                        Events
                    </button>
                    <button
                        className={c("analytics-debugger-toggle", {"is-active": activeTab === "Scopes"})}
                        onClick={() => handleTabToggle("Scopes")}
                    >
                        Scopes
                    </button>
                </div>
                {activeTab && (
                    <div className="analytics-debugger-tabs">
                        {activeTab === "Events"
                            ? <EventsTab data={data} setTooltips={setTooltips} />
                            : <ScopesTab data={data} setTooltips={setTooltips} />
                        }
                    </div>
                )}
            </div>
            <TooltipHandler tooltips={tooltips} />
        </>
    );
}

function EventsTab(props: TabProps) {
    const {
        data,
        setTooltips,
    } = props;

    const [activeEventEl, setActiveEventEl] = useState<HTMLElement>();
    const [activeButton, setActiveButton] = useState("");

    const handleClick = (eventEl: HTMLElement, eventName: string, key: string) => {
        eventEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        if (activeEventEl) {
            activeEventEl.classList.remove('analytics-event-highlight')
        }

        setActiveEventEl(eventEl);
        eventEl.classList.add('analytics-event-highlight');

        setActiveButton(key);
        setTooltips([{
            eventEl,
            eventName,
            key,
        }]);
    }

    return (
        <div className="analytics-debugger-tab">
            <h2 className="analytics-debugger-tab-title">Event Names</h2>
            <ul className="analytics-debugger-list">
                {Object.entries(data).map(([scopeName, value]) => value.events.map((eventEl, idx) => {
                    const eventName = `${scopeName}_${eventEl.dataset.yaTrack}`;
                    const key = `${eventName}_${idx}`;

                    return (
                        <li className="analytics-debugger-listItem" key={key}>
                            <button
                                className={c("analytics-debugger-button", { "is-active": key === activeButton })}
                                onClick={() => handleClick(eventEl, eventName, key)}
                            >
                                {eventName}
                            </button>
                        </li>
                    );
                }))}
            </ul>
        </div>
    );
}

function ScopesTab(props: TabProps) {
    const {
        data,
        setTooltips,
    } = props;

    const [activeButton, setActiveButton] = useState("");

    const handleClick = (scopeName: string) => {
        const node = data[scopeName];
        node.scope.scrollIntoView({ behavior: "smooth", block: "nearest" });

        setActiveButton(scopeName);

        setTooltips(node.events.map((eventEl, idx) => ({
            eventEl,
            eventName: `${scopeName}_${eventEl.dataset.yaTrack}`,
            key: `${scopeName}_${eventEl.dataset.yaTrack}_${idx}`,
        })));
    }

    return (
        <div className="analytics-debugger-tab">
            <h2 className="analytics-debugger-tab-title">Scope Names</h2>
            <ul className="analytics-debugger-list">
                {Object.keys(data).map((scopeName, idx) => (
                    <li className="analytics-debugger-listItem" key={scopeName + idx}>
                        <button
                            className={c("analytics-debugger-button", { "is-active": scopeName === activeButton })}
                            onClick={() => handleClick(scopeName)}
                        >
                            {scopeName}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TooltipHandler(props: TooltipHandlerProps) {
    const tooltipRefs = useRef<Record<string,TooltipsRefItem>>({});

    useEffect(() => {
        if (!tooltipRefs.current) return;

        Object.keys(tooltipRefs.current).map(key => {
            const otherTooltips = Object.values(tooltipRefs.current).map(v => v.el).filter(el => el !== tooltipRefs.current[key].el);
            const item = tooltipRefs.current[key];
            setTooltipPosition(item, otherTooltips);
            item.el.style.visibility = "visible";
        });
    }, [props.tooltips]);

    return (
        <>
            {props.tooltips.map((tooltip) => (
                <div
                    key={tooltip.key}
                    style={{ visibility: 'hidden', }} // Hide element before final position is calculated.
                    className="analytics-debugger-tooltip"
                    ref={(el) => {
                        if (el) {
                            tooltipRefs.current[tooltip.key] = {
                                el,
                                tooltip,
                            }
                          } else {
                            delete tooltipRefs.current[tooltip.key];
                          }
                    }}
                >
                    <span>{tooltip.eventName}</span>
                </div>
            ))}
        </>
    );
}

// Find tooltip position that is in the window bounds and doesn't overlap with other tooltips.
function setTooltipPosition(item: TooltipsRefItem, instances: HTMLDivElement[]) {
    for (let i = 0; i < 9; i++) {
        // Get base position and position the tooltip.
        let position = positionFinder(item.tooltip.eventEl.getBoundingClientRect(), item.el, i);
        item.el.style.inset = `${position.top} auto auto ${position.left}`;

        // Check if tooltip is in the window bounds.
        let withinBounds = !inWindowBounds(
            item.el.getBoundingClientRect().left,
            item.el.getBoundingClientRect().top + window.scrollY,
            item.el.getBoundingClientRect().right,
            item.el.getBoundingClientRect().bottom + window.scrollY,
        );
        if (!withinBounds) continue;

        // Check if tooltip overlaps with others.
        let valid = true;
        for (let j = 0; j < instances.length - 1; j++) {
            const neighbor = instances[j];
            if (isOverlapping(item.el, neighbor)) {
                valid = false;
            }
        }
        if (valid) break;
    }
}

// Check if two tooltips are overlapping with each other.
function isOverlapping(tooltip: HTMLDivElement, futureNeighbor: HTMLDivElement): boolean {
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
      return (a1 <= x2 && x2 <= a2 && b1 <= y2 && y2 <= b2) ||
       (a1 <= x1 && x1 <= a2 && b1 <= y1 && y1 <= b2) ||
       (a1 <= x1 && x1 <= a2 && b1 <= y2 && y2 <= b2) ||
       (a1 <= x2 && x2 <= a2 && b1 <= y1 && y1 <= b2);
    };

    return check(x1, y1, a1, b1, x2, y2, a2, b2) || check(a1, b1, x1, y1, a2, b2, x2, y2);
}

// Check if a tooltip is within the window bounds.
function inWindowBounds(x1: number, y1: number, x2: number, y2: number) {
    return (x1 < 0 || x2 > window.innerWidth) ||
      (y1 < 0 || y2 > document.body.getBoundingClientRect().height);
};

// Possible positions for a given tooltip around it's target element.
function positionFinder (rect: DOMRect, tooltip: HTMLDivElement, index: number) {
    let tooltipHeight = tooltip.clientHeight;
    let tooltipWidth = tooltip.clientWidth;

    let left;
    let top;
    switch (index) {
      // case 'top-left'
      case 0: {
        top = (window.scrollY + rect.top - tooltipHeight) + 'px';
        left = (rect.left - tooltipWidth) + 'px';
        break;
      }
      // case 'top-inner-left'
      case 1: {
        top = (window.scrollY + rect.top - tooltipHeight) + 'px';
        left = rect.left + 'px';
        break;
      }
      // case 'top-right'
      case 2: {
        top = (window.scrollY + rect.top - tooltipHeight) + 'px';
        left = rect.right + 'px';
        break;
      }
      // case 'top-inner-right'
      case 3: {
        top = (window.scrollY + rect.top - tooltipHeight) + 'px';
        left = (rect.right - tooltipWidth) + 'px';
        break;
      }
      // case 'bottom-left'
      case 4: {
        top = (window.scrollY + rect.bottom) + 'px';
        left = (rect.left - tooltipWidth) + 'px';
        break;
      }
      // case 'bottom-inner-left'
      case 5: {
        top = (window.scrollY + rect.bottom) + 'px';
        left = rect.left + 'px';
        break;
      }
      // case 'bottom-inner-right'
      case 6: {
        top = (window.scrollY + rect.bottom) + 'px';
        left = (rect.right - tooltipWidth) + 'px';
        break;
      }
      // case 'bottom-right'
      case 7: {
        top = (window.scrollY + rect.bottom) + 'px';
        left = rect.right + 'px';
        break;
      }
      default: {
        top = 0;
        left = 0;
      }
    }

    return {
      top: top,
      left: left
    };
}
