import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getRuntime } from "../../util";
import type { DebuggerTabs, EventData, TabProps, Tooltip, TooltipProps } from "./types";
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
            {tooltips.map((tooltip) => <Tooltip tooltip={tooltip} key={tooltip.key} />)}
        </>
    );
}

function Tooltip(props: TooltipProps) {
    const { tooltip } = props;

    const ref = useRef<HTMLDivElement>(null);
    const [initialPosition, setInitialPosition] = useState(false);
    const [top, setTop] = useState(tooltip.eventEl.getBoundingClientRect().top + window.scrollY);
    const [left, setLeft] = useState(tooltip.eventEl.getBoundingClientRect().left);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        // Set the initial tooltip position to the top-left corner of the event element.
        if (!initialPosition) {
            setTop(top => ref.current ? top - ref.current.clientHeight : top);
            setLeft(left => ref.current ? left - ref.current.clientWidth : left);
            setInitialPosition(true);
            return;
        }

        // After the initial position is set, check that the tooltip is within the window bounds.
        // TODO: Also need to check that tooltips are not overlapping each other.
        if (isOutsideWindowBounds(
            ref.current.getBoundingClientRect().left,
            ref.current.getBoundingClientRect().top,
            ref.current.getBoundingClientRect().right,
            ref.current.getBoundingClientRect().bottom,
        )) {
            // Move to bottom-right corner if out of bounds.
            setTop(tooltip.eventEl.getBoundingClientRect().bottom + window.scrollY);
            setLeft(tooltip.eventEl.getBoundingClientRect().right);
        }
    }, [ref.current]);

    return (
        <div
            style={{
                inset: `${top}px auto auto ${left}px`,
                visibility: ref.current ? 'visible' : 'hidden',
            }}
            className="analytics-debugger-tooltip" key={tooltip.key}
            ref={ref}
        >
            <span>{tooltip.eventName}</span>
        </div>
    );
}

const isOutsideWindowBounds = (x1: number, y1: number, x2: number, y2: number) => {
    return (x1 < 0 || x2 > window.innerWidth) ||
      (y1 < 0 || y2 > document.body.getBoundingClientRect().height);
};

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
