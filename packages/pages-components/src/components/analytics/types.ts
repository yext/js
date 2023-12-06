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

export type EventNode = {
  scope: HTMLElement;
  events: HTMLElement[];
}

export type EventData = Record<string,EventNode>;

export type DebuggerTabs = "Events" | "Scopes";

export type Tooltip = {
  eventEl: HTMLElement;
  eventName: string;
  key: string;
}

export type TabProps = {
  data: EventData;
  setTooltips: React.Dispatch<React.SetStateAction<Tooltip[]>>;
}

export type TooltipHandlerProps = {
  tooltips: Tooltip[];
}

export type TooltipProps = {
  tooltip: Tooltip;
}

export type TooltipsRefItem = {
  el: HTMLDivElement;
  tooltip: Tooltip;
}
