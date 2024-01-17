import React, { useEffect, useState } from 'react';
import c from "classnames";
import { Hours, HoursInterval } from './hours.js';
import { DateTime } from "luxon";
import { HoursType } from './types.js';

export interface StatusParams {
  isOpen: boolean,
  currentInterval: HoursInterval | null,
  futureInterval: HoursInterval | null,
  timeOptions?: Intl.DateTimeFormatOptions,
  dayOptions?: Intl.DateTimeFormatOptions,
};

export interface TemplateParams {
  currentTemplate?: (s: StatusParams) => React.ReactNode,
  separatorTemplate?: (s: StatusParams) => React.ReactNode,
  futureTemplate?: (s: StatusParams) => React.ReactNode,
  timeTemplate?: (s: StatusParams) => React.ReactNode,
  dayOfWeekTemplate?: (s: StatusParams) => React.ReactNode,
}

export interface StatusTemplateParams extends StatusParams, TemplateParams {}

export interface HoursStatusProps extends TemplateParams {
  hours: HoursType,
  timezone: string,
  timeOptions?: Intl.DateTimeFormatOptions,
  dayOptions?: Intl.DateTimeFormatOptions,
  statusTemplate?: (s: StatusParams) => React.ReactNode,
  className?: string,
};

function isOpen24h(params: StatusParams): boolean {
  return (params.currentInterval && params.currentInterval.is24h()) || false;
}

function isIndefinitelyClosed(params: StatusParams): boolean {
  return !params.futureInterval;
}

function defaultCurrentTemplate(params: StatusParams): React.ReactNode {
  if (isOpen24h(params)) {
    return <span className="HoursStatus-current">Open 24 Hours</span>;
  }
  if (isIndefinitelyClosed(params)){
    return <span className="HoursStatus-current">Temporarily Closed</span>;
  }
  return <span className="HoursStatus-current">{params.isOpen ? 'Open Now' : 'Closed'}</span>;
};

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
  return <span className="HoursStatus-future">{params.isOpen ? 'Closes at': 'Opens at'}</span>;
}

function defaultTimeTemplate(params: StatusParams): React.ReactNode {
  if (isOpen24h(params) || isIndefinitelyClosed(params)) {
    return null;
  }
  let time = '';
  if (params.isOpen) {
    const interval = params.currentInterval;
    time += interval ? interval.getEndTime('en-US', params.timeOptions) : '';
  } else {
    const interval = params.futureInterval;
    time += interval ? interval.getStartTime('en-US', params.timeOptions) : '';
  }
  return <span className="HoursStatus-time"> {time}</span>;
}

function defaultDayOfWeekTemplate(params: StatusParams): React.ReactNode {
  if (isOpen24h(params) || isIndefinitelyClosed(params)) {
    return null;
  }
  const dayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    ...(params.dayOptions ?? {}),
  };

  let dayOfWeek = '';
  if (params.isOpen) {
    const interval = params.currentInterval;
    dayOfWeek += interval?.end?.setLocale('en-US').toLocaleString(dayOptions) || '';
  } else {
    const interval = params.futureInterval;
    dayOfWeek += interval?.start?.setLocale('en-US').toLocaleString(dayOptions) || '';
  }
  return <span className="HoursStatus-dayOfWeek"> {dayOfWeek}</span>;
}

function defaultStatusTemplate(params: StatusTemplateParams, props?: HoursStatusProps): React.ReactNode {
  const currentTemplate = params.currentTemplate || defaultCurrentTemplate;
  const separatorTemplate = params.separatorTemplate || defaultSeparatorTemplate;
  const futureTemplate = params.futureTemplate || defaultFutureTemplate;
  const timeTemplate = params.timeTemplate || defaultTimeTemplate;
  const dayOfWeekTemplate = params.dayOfWeekTemplate || defaultDayOfWeekTemplate;

  return (
    <div className={c("HoursStatus", props?.className || '')}>
      {currentTemplate(params)}
      {separatorTemplate(params)}
      {futureTemplate(params)}
      {timeTemplate(params)}
      {dayOfWeekTemplate(params)}
    </div>
  );
}

/*
 * The HoursStatus component uses Hours data to generate a status message
 *  describing the current Open/Closed status of the entity
 * 
 * @param {HoursType} hours data from Yext Streams
 * @param {Intl.DateTimeFormatOptions} timeOptions
 * @param {Intl.DateTimeFormatOptions} dayOptions
 * @param {Function} statusTemplate completely override rendering for this component
 * @param {Function} currentTemplate override rendering for the "current" part of this component "[[Open Now]] - closes at 5:00PM Monday"
 * @param {Function} separatorTemplate override rendering for the "separator" part of this component "Open Now [[-]] closes at 5:00PM Monday"
 * @param {Function} futureTemplate override rendering for the "future" part of this component "Open Now - [[closes at]] 5:00PM Monday"
 * @param {Function} timeTemplate override rendering for the "time" part of this component "Open Now - closes at [[5:00PM]] Monday"
 * @param {Function} dayOfWeekTemplate override rendering for the "dayOfWeek" part of this component "Open Now - closes at 5:00PM [[Monday]]"
 */
const HoursStatus: React.FC<HoursStatusProps> = (props) => {
  const [hasStatusTimeout, setHasStatusTimeout] =  useState(false);

  // Use two rendering passes to avoid SSR issues where server & client rendered content are different
  // https://reactjs.org/docs/react-dom.html#hydrate
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  }

  return (
    <>
      {isClient && statusTemplateFn(statusParams, props)}
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
}