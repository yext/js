import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getRuntime } from "../../util";
import c from "classnames";
import "./debugger.css";

/**
 * - DONE: Show tooltip for all events within scope when scope button is clicked
 * - DONE: Show tooltip for single event when event button is clicked
 * 
 * - Only want to add debugger once if there are multuple providers
 *      - One solution for this would be to export the AnalyticsDebugger as an external component that can be added as a child once to a provider.
 *      - 
 * - Tooltip overlap / offscreen fix
 * - DONE: createPortal to body
 */

declare global {
    interface Window {
        debuggerActive: boolean;
    }
}

interface AnalyticsDebuggerProps {
    enableDebugging: boolean;
}

type EventNode = {
    scope: HTMLElement;
    events: HTMLElement[];
};

type EventData = Record<string,EventNode>;
type Tabs = "Events"|"Scopes";
type Tooltip = {
    eventEl: HTMLElement;
    eventName: string;
    key: string;
}

export function AnalyticsDebugger(props: AnalyticsDebuggerProps) {
    const { enableDebugging } = props;

    if (!enableDebugging || getRuntime().name !== "browser") {
        return null;
    }

    return createPortal(<AnalyticsDebuggerInternal />, document.body);
}

// Track scope / event elements.
const data: EventData = {};

export function AnalyticsDebuggerInternal() {
    // Track whether the Events, Scope, or no tab is opened.
    const [activeTab, setActiveTab] = useState<Tabs>();

    // Track the event elements that need to have a tooltip added.
    const [toolTips, setToolTips] = useState<Tooltip[]>([]);

    // If a user renders multiple AnalyticsProviders then we only want to show one debugger.
    const [isFirst, setIsFirst] = useState(false);

    useEffect(() => {
        // Scope styles to only when dugging is enabled.
        document.documentElement.classList.add('xYextDebug');

        // Check if this is the first debugger rendered.
        if (!window.hasOwnProperty("debuggerActive")) {
            window.debuggerActive = true;
            setIsFirst(true);
        }

        const scopes: NodeListOf<HTMLElement> = document.querySelectorAll('[data-ya-scope]');
        scopes.forEach(scope => {
            const scopeName = scope.dataset.yaScope;
            const events: NodeListOf<HTMLElement> = scope.querySelectorAll('[data-ya-track]');

            events.forEach((eventEl, idx) => {
                const eventName = eventEl.dataset.yaTrack;

                // Show tooltip when element is hovered.
                eventEl.addEventListener('mouseenter', () => {
                    setToolTips([{
                        eventEl,
                        eventName: `${scopeName}_${eventName}`,
                        key: `${scopeName}_${eventName}_${idx}`,
                    }]);
                });

                // Remove tooltip.
                eventEl.addEventListener('mouseleave', () => {
                    setToolTips([]);
                });
            });

            // TODO(this can have duplicates if the same scope is used more than once)
            if (scopeName) {
                data[scopeName] = {
                    scope,
                    events: Array.from(events),
                };
            }
        });
    }, []);

    const handleToggle = (tabName: Tabs) => {
        if (activeTab === tabName) {
            setActiveTab(undefined);
        } else {
            setActiveTab(tabName);
        }
    }

    if (!isFirst) {
        return null;
    }

    return (
        <>
            <div className="analytics-debugger">
                <div className="analytics-debugger-toggles">
                    <button
                        className={c("analytics-debugger-toggle", {"is-active": activeTab === "Events"})}
                        onClick={() => handleToggle("Events")}
                    >
                        Events
                    </button>
                    <button
                        className={c("analytics-debugger-toggle", {"is-active": activeTab === "Scopes"})}
                        onClick={() => handleToggle("Scopes")}
                    >
                        Scopes
                    </button>
                </div>
                {activeTab && (
                    <div className="analytics-debugger-tabs">
                        {activeTab === "Events"
                            ? <EventsTab data={data} setToolTips={setToolTips} />
                            : <ScopesTab data={data} setToolTips={setToolTips} />
                        }
                    </div>
                )}
            </div>
            {toolTips.map((tooltip) => <ToolTip tooltip={tooltip} key={tooltip.key} />)}
        </>
    );
}

type ToolTipProps = {
    tooltip: Tooltip;
}

function ToolTip(props: ToolTipProps) {
    const { tooltip } = props;

    const ref = useRef<HTMLDivElement>(null);
    const top = tooltip.eventEl.getBoundingClientRect().top + window.scrollY;
    const left = tooltip.eventEl.getBoundingClientRect().left + window.scrollX;

    const [yOffset, setYOffset] = useState(0);
    const [xOffset, setXOffset] = useState(0);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        setYOffset(ref.current?.clientHeight);
        setXOffset(ref.current?.clientWidth);
    }, [ref.current]);

    return (
        <div
            style={{
                inset: ref.current ? `${top - yOffset}px auto auto ${left - xOffset}px` : 'initial',
                visibility: ref.current ? 'visible' : 'hidden',
            }}
            className="analytics-debugger-tooltip" key={tooltip.key}
            ref={ref}
        >
            <span>{tooltip.eventName}</span>
        </div>
    );
}

type TabProps = {
    data: EventData
    setToolTips: React.Dispatch<React.SetStateAction<Tooltip[]>>;
}

function EventsTab(props: TabProps) {
    const {
        data,
        setToolTips,
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
        setToolTips([{
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
                    )
                }))}
            </ul>
        </div>
    );
}

function ScopesTab(props: TabProps) {
    const {
        data,
        setToolTips,
    } = props;

    const [activeButton, setActiveButton] = useState("");

    const handleClick = (scopeName: string) => {
        const node = data[scopeName];
        node.scope.scrollIntoView({ behavior: "smooth", block: "nearest" });

        setActiveButton(scopeName);

        setToolTips(node.events.map((eventEl, idx) => ({
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
