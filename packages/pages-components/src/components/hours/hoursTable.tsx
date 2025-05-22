import React, { useEffect, useState } from "react";
import c from "classnames";
import "./hoursTable.css";
import {
  Day,
  DayOfWeekNames,
  HoursTableDayData,
  HoursTableProps,
} from "./types.js";
import {
  Hours,
  HoursInterval,
  arrayShift,
  defaultDayName,
  intervalsListsAreEqual,
  luxonDateToDay,
} from "./hours.js";
import { DateTime, WeekdayNumbers } from "luxon";

/**
 *
 * @param hoursDays - HoursTableDayData[]
 * @returns HoursTableDayData[] where adjacent days with the same intervals are combined
 */
export function collapseDays(
  hoursDays: HoursTableDayData[],
  dayNames?: DayOfWeekNames
): HoursTableDayData[] {
  const collapsedDays: HoursTableDayData[] = [];
  hoursDays.forEach((hoursDay) => {
    const latestGroup = collapsedDays[collapsedDays.length - 1];

    // latestGroup = undefined indicates that this is the first group of days
    //  add a new 'collapsedDay'
    if (!latestGroup) {
      collapsedDays.push({
        ...hoursDay,
      });
    } else {
      // Check if this `hoursDay`s intervals matches latestGroup's intervals
      if (intervalsListsAreEqual(latestGroup.intervals, hoursDay.intervals)) {
        // If it is a match, update the latestGroup to include this 'hoursDay'
        latestGroup.endDay = hoursDay.endDay;
        latestGroup.isToday = latestGroup.isToday || hoursDay.isToday;
      } else {
        // Otherwise, add a new 'collapsedDay'
        collapsedDays.push({
          ...hoursDay,
        });
      }
    }
  });

  return collapsedDays.map((day) => {
    const startDayName: string =
      dayNames && defaultDayName(day.startDay) in dayNames
        ? (dayNames as any)[defaultDayName(day.startDay)] || ""
        : defaultDayName(day.startDay);
    const endDayName: string =
      dayNames && defaultDayName(day.endDay) in dayNames
        ? (dayNames as any)[defaultDayName(day.endDay)] || ""
        : defaultDayName(day.endDay);

    return {
      ...day,
      dayOfWeek: "Collapsed",
      dayName:
        day.startDay === day.endDay
          ? `${startDayName}`
          : `${startDayName} - ${endDayName}`,
    };
  });
}

function defaultIntervalStringsBuilder(
  dayData: HoursTableDayData,
  timeOptions?: Intl.DateTimeFormatOptions
): string[] {
  const intervalStrings: string[] = [];
  const isOpen24h =
    dayData.intervals.length > 0 && dayData.intervals[0].is24h();
  if (dayData.intervals.length === 0) {
    intervalStrings.push("Closed");
  } else if (isOpen24h) {
    intervalStrings.push("Open 24 hours");
  } else {
    dayData.intervals.forEach((interval) => {
      const startTime = interval.getStartTime("en-US", timeOptions);
      const endTime = interval.getEndTime("en-US", timeOptions);
      intervalStrings.push(`${startTime} - ${endTime}`);
    });
  }
  return intervalStrings;
}

export function intervalsToHoursDays(
  intervals: HoursInterval[],
  now: DateTime,
  dayOfWeekNames?: DayOfWeekNames
): HoursTableDayData[] {
  // Split intervals into buckets by day of week
  const hoursDays: HoursTableDayData[] = [];
  // These are Luxon weekdays. 1 = Monday, 7 = Sunday.
  for (let i = 1; i <= 7; i++) {
    const luxDay = DateTime.fromObject({ weekday: i as WeekdayNumbers });
    const day = luxonDateToDay(luxDay);
    hoursDays.push({
      startDay: day,
      endDay: day,
      dayName:
        dayOfWeekNames && defaultDayName(day).toLowerCase() in dayOfWeekNames
          ? (dayOfWeekNames as any)[defaultDayName(day).toLowerCase()] || ""
          : defaultDayName(day),
      intervals: intervals.filter((interval) => interval.start.weekday === i),
      isToday: now.weekday === i,
    });
  }

  return hoursDays;
}

/*
 * The HoursTable component uses Hours data to generate a table
 *  listing the business hours of the entity.
 *
 * @param {HoursType} hours data from Yext Streams
 * @param {Intl.DateTimeFormatOptions} timeOptions
 * @param {String[]} dayOfWeekNames label for each day of week, ordered starting from Sunday
 * @param {String} startOfWeek set the day of the first row of the table
 * @param {Boolean} collapseDays combine adjacent rows (days) with the same intervals
 * @param {Function} intervalStringsBuilderFn override rendering for the interval on each table row
 */
const HoursTable: React.FC<HoursTableProps> = (props) => {
  // Use two rendering passes to avoid SSR issues where server & client rendered content is different
  //  On the first pass, don't render any content in this component, only set `state.isClient`
  //  On the second pass (After the page has been loaded), render the content
  // https://reactjs.org/docs/react-dom.html#hydrate
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const h = new Hours(
    props.hours,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const now = DateTime.now();

  // Fetch intervals for the next 7 days
  const allIntervals = h.getIntervalsForNDays(7, now);

  // Split intervals into buckets by day of week
  let hoursDays = intervalsToHoursDays(allIntervals, now, props.dayOfWeekNames);

  function startOfWeekOptionToDay(option: HoursTableProps["startOfWeek"]): Day {
    if (!option) return Day.Sunday;

    const map = {
      today: luxonDateToDay(now),
      monday: Day.Monday,
      tuesday: Day.Tuesday,
      wednesday: Day.Wednesday,
      thursday: Day.Thursday,
      friday: Day.Friday,
      saturday: Day.Saturday,
      sunday: Day.Sunday,
    };
    return map[option];
  }

  // Sort the days
  let sortOrder = [
    Day.Sunday,
    Day.Monday,
    Day.Tuesday,
    Day.Wednesday,
    Day.Thursday,
    Day.Friday,
    Day.Saturday,
  ];
  const startIndex = sortOrder.indexOf(
    startOfWeekOptionToDay(props.startOfWeek)
  );
  sortOrder = arrayShift(sortOrder, 7 - startIndex);

  hoursDays.sort(
    (d1, d2) => sortOrder.indexOf(d1.startDay) - sortOrder.indexOf(d2.startDay)
  );

  // Collapse the days
  if (props.collapseDays) {
    hoursDays = collapseDays(hoursDays, props.dayOfWeekNames);
  }

  const emptyStyle = React.useMemo(
    () => ({ minHeight: `${hoursDays.length * 1.5}em` }),
    [hoursDays.length]
  );

  return (
    <>
      {isClient ? (
        <div className={c("HoursTable", props.className)}>
          {hoursDays.map((dayData) => {
            const intervalStringsBuilderFn =
              props.intervalStringsBuilderFn || defaultIntervalStringsBuilder;
            const intervalStrings = intervalStringsBuilderFn(
              dayData,
              props.timeOptions
            );

            return (
              <div
                className={c("HoursTable-row", { "is-today": dayData.isToday })}
                key={dayData.dayName}
              >
                <span className="HoursTable-day">{dayData.dayName}</span>
                <span className="HoursTable-intervals">
                  {intervalStrings.map((intervalString, idx) => (
                    <span className="HoursTable-interval" key={idx}>
                      {intervalString}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={emptyStyle}/>
      )}
    </>
  );
};

export { HoursTable };
