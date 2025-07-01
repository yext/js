import { DateTime } from "luxon";
import {
  Day,
  DayType,
  HolidayType,
  HoursType,
  IntervalType,
  WeekType,
} from "./types.js";

export function luxonDateToDay(d: DateTime): Day {
  const dayMap: Record<number, Day> = {
    1: Day.Monday,
    2: Day.Tuesday,
    3: Day.Wednesday,
    4: Day.Thursday,
    5: Day.Friday,
    6: Day.Saturday,
    7: Day.Sunday,
  };

  if (d.weekday in dayMap) {
    return dayMap[d.weekday];
  } else {
    throw new Error(`Invalid DateTime.weekday property: ${d}, ${d.weekday}`);
  }
}

export function defaultDayName(d: Day): string {
  const nameMap = {
    [Day.Monday]: "Monday",
    [Day.Tuesday]: "Tuesday",
    [Day.Wednesday]: "Wednesday",
    [Day.Thursday]: "Thursday",
    [Day.Friday]: "Friday",
    [Day.Saturday]: "Saturday",
    [Day.Sunday]: "Sunday",
  };

  return nameMap[d];
}

export const dayToDayKey: Record<Day, keyof WeekType> = {
  [Day.Monday]: "monday",
  [Day.Tuesday]: "tuesday",
  [Day.Wednesday]: "wednesday",
  [Day.Thursday]: "thursday",
  [Day.Friday]: "friday",
  [Day.Saturday]: "saturday",
  [Day.Sunday]: "sunday",
};

export class HoursInterval {
  end: DateTime;
  start: DateTime;

  /**
   * @param date - DateTime the DateTime for the day on which the interval starts
   * @param interval - the Yext Streams interval data
   */
  constructor(date: DateTime, interval: IntervalType, zone: string) {
    this.end = date.setZone(zone);
    this.start = date.setZone(zone);

    [interval.start, interval.end].forEach((time) => {
      if (time.split(":").length !== 2) {
        throw new Error(
          `expected interval start and end data to be in the format "HH:MM"`
        );
      }
    });

    const [startHour, startMinute] = interval.start.split(":").map(Number);
    const [endHour, endMinute] = interval.end.split(":").map(Number);

    let dayIncrement = 0;
    if (endHour < startHour) {
      dayIncrement = 1;
    }

    this.end = this.end.set({
      hour: endHour,
      minute: endMinute,
      day: this.end.day + dayIncrement,
    });
    this.start = this.start.set({
      hour: startHour,
      minute: startMinute,
    });

    if (this.end.minute === 59) {
      this.end = this.end.set({ minute: 60 });
    }
  }

  /**
   * @param date - A moment in time
   * @returns boolean - True if the given moment is within the interval
   */
  contains(date: DateTime): boolean {
    return this.start <= date && date < this.end;
  }

  /**
   * @param opts - intl.DateTimeFormatOptions
   * @param locale - defaults to 'en-US'
   * @returns string - representation of this interval's start time
   */
  getStartTime(locale?: string, opts?: Intl.DateTimeFormatOptions): string {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      ...opts,
    };

    return this.start.setLocale(locale || "en-US").toLocaleString(timeOptions);
  }

  /**
   * @param opts - intl.DateTimeFormatOptions
   * @param locale - defaults to 'en-US'
   * @returns string representation of this interval's end time
   */
  getEndTime(locale?: string, opts?: Intl.DateTimeFormatOptions): string {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      ...opts,
    };

    return this.end.setLocale(locale || "en-US").toLocaleString(timeOptions);
  }

  /**
   * @returns boolean if this interval and 'other' have the same start/end
   */
  timeIsEqualTo(other: HoursInterval): boolean {
    const startEqual = this.getStartTime() === other.getStartTime();
    const endEqual = this.getEndTime() === other.getEndTime();
    return startEqual && endEqual;
  }

  /**
   * @returns boolean if this interval is 24 hours
   */
  is24h(): boolean {
    const startIs00 = this.start.minute === 0 && this.start.hour === 0;
    const endIs00 = this.end.minute === 0 && this.end.hour === 0;
    const daysAreConsecutive =
      this.end.day - this.start.day === 1 || this.end.day === 1;
    return startIs00 && endIs00 && daysAreConsecutive;
  }
}

export class Hours {
  holidayHoursByDate: Record<string, HolidayType>;
  hours: HoursType;
  timezone: string;

  /**
   * @param hours - Hours object in the format returned by Yext Streams
   */
  constructor(hours: HoursType, timezone: string) {
    this.holidayHoursByDate = Object.fromEntries(
      (hours.holidayHours || []).map((hours) => [hours.date, hours])
    );
    this.hours = hours;
    this.timezone = timezone;
  }

  /**
   * @param date - A moment in time
   * @returns HoursInterval? The first interval that contains the given moment, null if none
   */
  getInterval(date: DateTime): HoursInterval | null {
    if (this.isTemporarilyClosedAt(date)) {
      return null;
    }

    // Also need to check yesterday in case the interval crosses dates
    // (Assumes intervals will be no longer than 24 hours)
    const priorDate = date.minus({ days: 1 });

    for (const hoursDate of [priorDate, date]) {
      const hours = this.getHours(hoursDate);

      if (hours && !hours.isClosed) {
        for (const interval of hours.openIntervals || []) {
          const hoursInterval = new HoursInterval(
            hoursDate,
            interval,
            this.timezone
          );

          if (hoursInterval.contains(date)) {
            return hoursInterval;
          }
        }
      }
    }

    return null;
  }

  /**
   * @returns HoursInterval? The first interval that contains the current time, null if none
   */
  getCurrentInterval(): HoursInterval | null {
    return this.getInterval(DateTime.now());
  }

  /**
   * @param date - A moment in time
   * @returns HoursInterval? The next interval that hasn't started as of the given moment
   */
  getIntervalAfter(date: DateTime): HoursInterval | null {
    // Look ahead up to 8 days for the next interval
    const intervalsList = this.getIntervalsForNDays(8, date);

    // Ensure the intervals are sorted by start time
    const sortFn = (interval1: HoursInterval, interval2: HoursInterval) => {
      if (interval1.start === interval2.start) return 0;
      return interval1.start > interval2.start ? 1 : -1;
    };
    const sortedIntervals = intervalsList.sort(sortFn);

    // If we find the current interval, return the next one
    for (const [idx, hoursInterval] of sortedIntervals.entries()) {
      if (hoursInterval.contains(date)) {
        // If this is the last interval, can't return the next one
        if (sortedIntervals.length > idx + 1) {
          return sortedIntervals[idx + 1];
        }
      }
    }

    // Otherwise, look for the first interval which starts after the current datetime
    for (const hoursInterval of sortedIntervals) {
      if (hoursInterval.start > date) {
        return hoursInterval;
      }
    }

    // Return null if no next interval found
    return null;
  }

  /*
   * @param {number} n number of days to check
   * @param {DateTime} startDate first day to check
   * @returns {HoursInterval[]} list of intervals in range [startDate, startDate+7]
   */
  getIntervalsForNDays(n: number, startDate: DateTime): HoursInterval[] {
    const intervalsList: HoursInterval[] = [];
    for (let i = 0; i < n; i++) {
      let theDate = startDate;
      theDate = theDate.plus({ days: i });

      const hours = this.getHours(theDate);
      if (hours?.openIntervals && !hours.isClosed) {
        intervalsList.push(
          ...hours.openIntervals.map(
            (interval: IntervalType) =>
              new HoursInterval(theDate, interval, this.timezone)
          )
        );
      }
    }

    return intervalsList;
  }

  /**
   * @param date - The day to get the hours for
   * @returns Object? The daily holiday hours object from the original Streams response for the
   *   given date, null if none
   */
  getHolidayHours(date: DateTime): HolidayType | null {
    if (this.isTemporarilyClosedAt(date)) {
      return null;
    }

    return (
      this.holidayHoursByDate[(date.toISO() || "").replace(/T.*/, "")] || null
    );
  }

  /**
   * @param date - The day to get the hours for
   * @returns Object? The daily normal hours object from the original Streams response for the
   *   given date, null if none
   */
  getNormalHours(date: DateTime): DayType | null {
    if (this.isTemporarilyClosedAt(date)) {
      return null;
    }
    const dayName = defaultDayName(luxonDateToDay(date)).toLowerCase();
    const hoursForDay = (this.hours as any)[dayName] as DayType;
    return hoursForDay;
  }

  /**
   * @param date - The day to get the hours for
   * @returns Object? The daily hours object from the original Streams response for the given
   *   date, null if none
   */
  getHours(date: DateTime): DayType | null {
    const holidayHours = this.getHolidayHours(date);
    if (!holidayHours || holidayHours.isRegularHours) {
      return this.getNormalHours(date);
    }
    return holidayHours;
  }

  /**
   * @returns HoursInterval? The next interval that hasn't started as of the current time
   */
  getNextInterval(): HoursInterval | null {
    return this.getIntervalAfter(DateTime.now());
  }

  /**
   * @param date - A day
   * @returns Boolean True if the given day has holiday hours
   */
  isHoliday(date: DateTime): boolean {
    return !!this.getHolidayHours(date);
  }

  /**
   * Yext platform uses the field `hours.reopenDate` to indicate an entity is
   *  temporarily closed for more than one day.
   * @returns Boolean True if the given date is before 'reopenDate'
   */
  isTemporarilyClosedAt(targetDate: DateTime): boolean {
    if (!this.hours.reopenDate) {
      return false;
    }

    const reopenDateParts = this.hours.reopenDate.split("-");
    if (reopenDateParts.length === 3) {
      const [year, month, date] = reopenDateParts;
      const reopenDate = DateTime.fromObject(
        { year: Number(year), month: Number(month), day: Number(date) },
        { zone: this.timezone }
      );
      if (targetDate < reopenDate) {
        return true;
      }
    }

    return false;
  }

  /**
   * @param date - A moment in time
   * @returns Boolean True if the given moment falls within any interval
   */
  isOpenAt(date: DateTime): boolean {
    if (this.isTemporarilyClosedAt(date)) {
      return false;
    }

    // Otherwise, just look for an interval
    return !!this.getInterval(date);
  }

  /**
   * @returns Boolean True if the current time falls within any interval
   */
  isOpenNow(): boolean {
    return this.isOpenAt(DateTime.now());
  }
}

/**
 * @param arr - Any array
 * @param n - amount to shift
 * @returns Array<any> a new array shifted 'n' elements to the right, looping from the end back to the start
 */
export function arrayShift(arr: Array<any>, n: number): Array<any> {
  // Make a local copy of the array to mutate
  const myArr = [...arr];
  // Handle the (invalid) case where n > arr.length
  n = n % myArr.length;
  return myArr.concat(myArr.splice(0, myArr.length - n));
}

/**
 * @returns boolean whether the two intervals lists are equal
 */
export function intervalsListsAreEqual(
  il1: HoursInterval[],
  il2: HoursInterval[]
): boolean {
  if (il1.length !== il2.length) {
    return false;
  }

  for (const [idx, interval] of il1.entries()) {
    if (!interval.timeIsEqualTo(il2[idx])) {
      return false;
    }
  }

  return true;
}
