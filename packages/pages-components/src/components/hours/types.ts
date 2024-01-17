import { HoursIntervalManipulator } from "./hoursManipulator.js";

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
  isClosed: boolean;
  openIntervals: IntervalType[];
}

export interface HolidayType {
  date: string;
  isClosed?: boolean;
  openIntervals: IntervalType[];
  isRegularHours: boolean;
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
  dayOfWeek: string;
  intervals: HoursIntervalManipulator[];
  sortIdx: number;
  isToday: boolean;
  startDay?: string; // used for 'collapseDays' logic
  endDay?: string; // used for 'collapseDays' logic
}
