import { useEffect, useRef, useState } from "react";
import { getRuntime } from "../../util";
import c from "classnames";
import "./debugger.css";

/**
 * Scope clicked:
 * - Show tooltip for all events within scope
 */

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

const data: EventData = {};

export function AnalyticsDebugger(props: AnalyticsDebuggerProps) {
    const { enableDebugging } = props;
    const [activeTab, setActiveTab] = useState<Tabs>();

    // Track the event elements that need to have a tooltip added.
    const [toolTips, setToolTips] = useState<Tooltip[]>([]);

    useEffect(() => {
        if (!enableDebugging || getRuntime().name !== "browser") {
            return;
        }

        const scopes: NodeListOf<HTMLElement> = document.querySelectorAll('[data-ya-scope]');
        scopes.forEach(scope => {
            const scopeName = scope.dataset.yaScope;
            const events: NodeListOf<HTMLElement> = scope.querySelectorAll('[data-ya-track]');

            events.forEach((event, idx) => {
                const eventName = event.dataset.yaTrack;

                // Show tooltip when element is hovered.
                event.addEventListener('mouseenter', () => {
                    console.log("mouse over")
                    setToolTips([{
                        eventEl: event,
                        eventName: `${scopeName}_${eventName}`,
                        key: `${scopeName}_${eventName}_${idx}`,
                    }]);
                });

                // Remove tooltip.
                event.addEventListener('mouseleave', () => {
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
    }, [enableDebugging]);

    if (!enableDebugging || getRuntime().name !== "browser") {
        return null;
    }

    document.documentElement.classList.add('xYextDebug');


    const handleToggle = (tabName: Tabs) => {
        if (activeTab === tabName) {
            setActiveTab(undefined);
        } else {
            setActiveTab(tabName);
        }
    }

    {/* TOOD(jhood): Might need to createPortal this to the body el. That way we avoid creating multiple */}
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
        {/*
            These keys are not unique when being passed the same eventname. Ex: if two links have the same event name
            the tooltip won't be rerendered.
        */}
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

    const [yOffset, setYOffset] = useState(30);
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
    const [activeButton, setActiveButton] = useState<HTMLElement>();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, scopeName: string, eventEl: HTMLElement, key: string) => {
        const fullEventName = `${scopeName}_${eventEl.dataset.yaTrack}`;

        eventEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        if (activeEventEl) {
            activeEventEl.classList.remove('analytics-event-highlight')
        }

        if (activeButton) {
            activeButton.classList.remove('is-active');
        }

        setActiveButton(e.currentTarget)
        e.currentTarget.classList.add('is-active');

        setActiveEventEl(eventEl);
        eventEl.classList.add('analytics-event-highlight');

        setToolTips([{
            eventEl,
            eventName: fullEventName,
            key
        }]);
    }

    return (
        <div className="analytics-debugger-tab">
            <h2 className="analytics-debugger-tab-title">Event Names</h2>
            <ul className="analytics-debugger-list">
                {Object.entries(data).map(([scopeName, value]) => value.events.map((event, idx) => (
                    <li className="analytics-debugger-listItem" key={`${scopeName}_${event.dataset.yaTrack}_${idx}`}>
                        <button className="analytics-debugger-button" onClick={(e) => handleClick(e, scopeName, event,`${scopeName}_${event.dataset.yaTrack}_${idx}`)}>
                            {`${scopeName}_${event.dataset.yaTrack}`}
                        </button>
                    </li>
                )))};
            </ul>
        </div>
    );
}

function ScopesTab(props: TabProps) {
    const {
        data,
        setToolTips,
    } = props;

    const handleClick = (scopeName: string, node: EventNode) => {
        node.scope.scrollIntoView({ behavior: "smooth", block: "nearest" });

        setToolTips(node.events.map((event, idx) => ({
            eventEl: event,
            eventName: `${scopeName}_${event.dataset.yaTrack}`,
            key: `${scopeName}_${event.dataset.yaTrack}_${idx}`,
        })));
    }

    return (
        <div className="analytics-debugger-tab">
            <h2 className="analytics-debugger-tab-title">Scope Names</h2>
            <ul className="analytics-debugger-list">
                {Object.keys(data).map((scopeName, idx) => (
                    <li className="analytics-debugger-listItem" key={scopeName + idx}>
                        <button className="analytics-debugger-button" onClick={() => handleClick(scopeName, data[scopeName])}>
                            {scopeName}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
