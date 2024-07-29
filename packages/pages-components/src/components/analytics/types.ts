/**
 * The shape of the data passed directly to the different template functions with the
 * exception of the render function (getPath, getHeadConfig, etc).
 *
 * @public
 */
export interface TemplateProps<T = Record<string, any>> {
  /** The entire document returned after applying the stream to a single entity */
  document: T;
}

export type EventData = {
  action: string;
  originalEventName: string;
  scope: string | undefined;
};

export type Event = {
  eventData: EventData;
  el: HTMLElement;
};

export type EventNode = {
  scopeEl: HTMLElement;
  events: Event[];
};

export type EventMap = Record<string, EventNode>;

export type DebuggerTabs = "Events" | "Scopes";

export type Tooltip = {
  elem: HTMLElement;
  key: string;
  action: string;
  originalEventName: string;
  scope: string | undefined;
};

export type TabProps = {
  data: EventMap;
  setTooltips: React.Dispatch<React.SetStateAction<Tooltip[]>>;
};

export type TooltipHandlerProps = {
  tooltips: Tooltip[];
};

export type TooltipProps = {
  tooltip: Tooltip;
};

export type TooltipsRefItem = {
  el: HTMLDivElement;
  tooltip: Tooltip;
};
