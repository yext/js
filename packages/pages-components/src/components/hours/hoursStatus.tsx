import React, { useEffect, useState } from "react";
import c from "classnames";
import { Hours } from "./hours.js";
import { DateTime } from "luxon";
import { HoursStatusProps, StatusParams, StatusTemplateParams } from "./types.js";

function isOpen24h(params: StatusParams): boolean {
  return params?.currentInterval?.is24h?.() || false;
}

function isIndefinitelyClosed(params: StatusParams): boolean {
  return !params.futureInterval;
}

function defaultCurrentTemplate(params: StatusParams): React.ReactNode {
  if (isOpen24h(params)) {
    return <span className="HoursStatus-current">Open 24 Hours</span>;
  }
  if (isIndefinitelyClosed(params)) {
    return <span className="HoursStatus-current">Temporarily Closed</span>;
  }
  return <span className="HoursStatus-current">{params.isOpen ? "Open Now" : "Closed"}</span>;
}

function defaultSeparatorTemplate(params: StatusParams): React.ReactNode {
  if (isOpen24h(params) || isIndefinitelyClosed(params)) {
    return null;
  }
  return <span className="HoursStatus-separator"> • </span>;
}

function defaultFutureTemplate(params: StatusParams): React.ReactNode {
  if (isOpen24h(params) || isIndefinitelyClosed(params)) {
    return null;
  }
  return <span className="HoursStatus-future">{params.isOpen ? "Closes at" : "Opens at"}</span>;
}

function defaultTimeTemplate(params: StatusParams): React.ReactNode {
  if (isOpen24h(params) || isIndefinitelyClosed(params)) {
    return null;
  }
  let time = "";
  if (params.isOpen) {
    const interval = params.currentInterval;
    time += interval ? interval.getEndTime("en-US", params.timeOptions) : "";
  } else {
    const interval = params.futureInterval;
    time += interval ? interval.getStartTime("en-US", params.timeOptions) : "";
  }
  return <span className="HoursStatus-time"> {time}</span>;
}

function defaultDayOfWeekTemplate(params: StatusParams): React.ReactNode {
  if (isOpen24h(params) || isIndefinitelyClosed(params)) {
    return null;
  }
  const dayOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    ...params.dayOptions,
  };

  let dayOfWeek = "";
  if (params.isOpen) {
    const interval = params.currentInterval;
    dayOfWeek += interval?.end?.setLocale("en-US").toLocaleString(dayOptions) || "";
  } else {
    const interval = params.futureInterval;
    dayOfWeek += interval?.start?.setLocale("en-US").toLocaleString(dayOptions) || "";
  }
  return <span className="HoursStatus-dayOfWeek"> {dayOfWeek}</span>;
}

function defaultStatusTemplate(
  params: StatusTemplateParams,
  props?: HoursStatusProps
): React.ReactNode {
  const currentTemplate = params.currentTemplate || defaultCurrentTemplate;
  const separatorTemplate = params.separatorTemplate || defaultSeparatorTemplate;
  const futureTemplate = params.futureTemplate || defaultFutureTemplate;
  const timeTemplate = params.timeTemplate || defaultTimeTemplate;
  const dayOfWeekTemplate = params.dayOfWeekTemplate || defaultDayOfWeekTemplate;

  return (
    <div className={c("HoursStatus", props?.className || "")}>
      {currentTemplate(params)}
      {separatorTemplate(params)}
      {futureTemplate(params)}
      {timeTemplate(params)}
      {dayOfWeekTemplate(params)}
    </div>
  );
}

const emptyStyle = { minHeight: `${1.5}em` };

/**
 * Renders the current open or closed status for a location.
 *
 * The component renders an empty placeholder on the server and then re-renders
 * on the client to avoid SSR hydration mismatches from time-dependent output.
 * Status calculations are driven by the provided `timezone`, so the same hours
 * data can produce different results if a different timezone is passed in.
 */
const HoursStatus: React.FC<HoursStatusProps> = (props) => {
  const [hasStatusTimeout, setHasStatusTimeout] = useState(false);

  // Use two rendering passes to avoid SSR issues where server & client rendered content are different
  // https://reactjs.org/docs/react-dom.html#hydrate
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!props.hours) {
    return <></>;
  }

  const statusTemplateFn = props.statusTemplate || defaultStatusTemplate;
  const h = new Hours(props.hours, props.timezone);
  const isOpen = h.isOpenNow();
  const currentInterval = h.getCurrentInterval();
  const futureInterval = h.getNextInterval();

  // When the current interval ends, or the next interval starts, trigger component rerender
  const isOpenChangeTime = currentInterval?.end || futureInterval?.start;
  if (isOpenChangeTime && !hasStatusTimeout) {
    setHasStatusTimeout(true);
    const delayMS = isOpenChangeTime.toMillis() - DateTime.now().toMillis();
    setTimeout(() => setHasStatusTimeout(false), delayMS);
  }

  const statusParams: StatusParams = {
    isOpen,
    currentInterval,
    futureInterval,
    ...props,
  };

  return (
    <>
      {isClient ? (
        statusTemplateFn(statusParams, props)
      ) : (
        <div style={emptyStyle} className={c("HoursStatus", props?.className || "")} />
      )}
    </>
  );
};

export {
  defaultCurrentTemplate,
  defaultSeparatorTemplate,
  defaultFutureTemplate,
  defaultTimeTemplate,
  defaultDayOfWeekTemplate,
  defaultStatusTemplate,
  isIndefinitelyClosed,
  isOpen24h,
  HoursStatus,
};
