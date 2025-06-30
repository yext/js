import { HoursInterval } from "./hours.js";

export interface WeekType {
  monday?: DayType;
  tuesday?: DayType;
  wednesday?: DayType;
  thursday?: DayType;
  friday?: DayType;
  saturday?: DayType;
  sunday?: DayType;
}

export interface DayType {
  isClosed?: boolean;
  openIntervals?: IntervalType[];
}

export interface HolidayType extends DayType {
  date: string;
  isRegularHours?: boolean;
}

export interface IntervalType {
  start: string;
  end: string;
}

export interface HoursType extends WeekType {
  holidayHours?: HolidayType[];
  reopenDate?: string;
}

export type DayOfWeekNames = {
  [Property in keyof WeekType]?: string;
};

export interface HoursTableProps {
  /** Hours data from Yext Streams */
  hours: HoursType;
  /** Label for each day of week, ordered starting from Sunday */
  dayOfWeekNames?: DayOfWeekNames;
  /** Set the day of the first row of the table */
  startOfWeek?: keyof DayOfWeekNames | "today";
  timeOptions?: Intl.DateTimeFormatOptions;
  /** Combine adjacent rows (days) with the same intervals */
  collapseDays?: boolean;
  /** Override rendering for the interval on each table row */
  intervalStringsBuilderFn?: (
    h: HoursTableDayData,
    t?: Intl.DateTimeFormatOptions
  ) => string[];
  className?: string;
}

export interface HoursTableDayData {
  dayName: string;
  intervals: HoursInterval[];
  isToday: boolean;
  startDay: Day; // used for 'collapseDays' logic
  endDay: Day; // used for 'collapseDays' logic
}

export enum Day {
  Monday = "MONDAY",
  Tuesday = "TUESDAY",
  Wednesday = "WEDNESDAY",
  Thursday = "THURSDAY",
  Friday = "FRIDAY",
  Saturday = "SATURDAY",
  Sunday = "SUNDAY",
}

export interface StatusParams {
  /** Whether the entity is currently open */
  isOpen: boolean;
  /** The first interval that contains the current time */
  currentInterval: HoursInterval | null;
  /** The next interval that hasn't started */
  futureInterval: HoursInterval | null;
  /** Formatting intended for the "time" part of this component "Open Now - closes at [[5:00PM]] Monday" */
  timeOptions?: Intl.DateTimeFormatOptions;
  /** Formatting intended for the "day" part of this component "Open Now - closes at 5:00PM [[Monday]]" */
  dayOptions?: Intl.DateTimeFormatOptions;
}

export interface TemplateParams {
  /** Override rendering for the "current" part of this component "[[Open Now]] - closes at 5:00PM Monday" */
  currentTemplate?: (s: StatusParams) => React.ReactNode;
  /** Override rendering for the "separator" part of this component "Open Now [[-]] closes at 5:00PM Monday" */
  separatorTemplate?: (s: StatusParams) => React.ReactNode;
  /** FutureTemplate override rendering for the "future" part of this component "Open Now - [[closes at]] 5:00PM Monday" */
  futureTemplate?: (s: StatusParams) => React.ReactNode;
  /** Override rendering for the "time" part of this component "Open Now - closes at [[5:00PM]] Monday" */
  timeTemplate?: (s: StatusParams) => React.ReactNode;
  /** Override rendering for the "dayOfWeek" part of this component "Open Now - closes at 5:00PM [[Monday]]" */
  dayOfWeekTemplate?: (s: StatusParams) => React.ReactNode;
}

export interface StatusTemplateParams extends StatusParams, TemplateParams {}

export interface HoursStatusProps extends TemplateParams {
  /** Hours data from Yext Streams */
  hours: HoursType;
  /** The IANA or UTC Offset timezone of the hours data from Yext Streams */
  timezone: string;
  /** Formatting for the "time" part of this component "Open Now - closes at [[5:00PM]] Monday" */
  timeOptions?: Intl.DateTimeFormatOptions;
  /** Formatting for the "day" part of this component "Open Now - closes at 5:00PM [[Monday]]" */
  dayOptions?: Intl.DateTimeFormatOptions;
  /** Completely override rendering for this component */
  statusTemplate?: (s: StatusParams) => React.ReactNode;
  className?: string;
}
