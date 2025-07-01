import React, { useEffect, useState } from "react";
import c from "classnames";
import "./hoursTable.css";
import {
  Day,
  DayOfWeekNames,
  HoursTableDayData,
  HoursTableIntervalTranslations,
  HoursTableProps,
} from "./types.js";
import {
  Hours,
  HoursInterval,
  arrayShift,
  dayToDayKey,
  defaultDayName,
  intervalsListsAreEqual,
  luxonDateToDay,
  days,
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
      dayNames && dayToDayKey[day.startDay] in dayNames
        ? (dayNames as any)[dayToDayKey[day.startDay]] || ""
        : defaultDayName(day.startDay);
    const endDayName: string =
      dayNames && dayToDayKey[day.endDay] in dayNames
        ? (dayNames as any)[dayToDayKey[day.endDay]] || ""
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
  timeOptions?: Intl.DateTimeFormatOptions,
  translations?: HoursTableIntervalTranslations
): string[] {
  const intervalStrings: string[] = [];
  const isOpen24h =
    dayData.intervals.length > 0 && dayData.intervals[0].is24h();
  if (dayData.intervals.length === 0) {
    intervalStrings.push(translations?.isClosed || "Closed");
  } else if (isOpen24h) {
    intervalStrings.push(translations?.open24Hours || "Open 24 hours");
  } else {
    dayData.intervals.forEach((interval) => {
      const startTime = interval.getStartTime(
        translations?.timeFormatLocale || "en-US",
        timeOptions
      );
      const endTime = interval.getEndTime(
        translations?.timeFormatLocale || "en-US",
        timeOptions
      );
      intervalStrings.push(`${startTime} - ${endTime}`);
    });
  }
  return intervalStrings;
}

export function intervalsToHoursDays(
  intervals: HoursInterval[],
  now?: DateTime,
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
      isToday: now?.weekday === i,
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
 * @param {HoursTableIntervalTranslations} intervalTranslations override hardcoded strings
 */
const HoursTable: React.FC<HoursTableProps> = (props) => {
  // Use two rendering passes to avoid SSR issues where server & client rendered content is different
  //  On the first pass, render the hours statically without regard to the current date
  //  On the second pass (After the page has been loaded), render the content
  // https://reactjs.org/docs/react-dom.html#hydrate
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!props.hours) {
    return <></>;
  }

  return (
    <>
      {isClient ? (
        <ClientSideHoursTable {...props} />
      ) : (
        <ServerSideHoursTable {...props} />
      )}
    </>
  );
};

export const ClientSideHoursTable: React.FC<HoursTableProps> = (props) => {
  const h = new Hours(
    props.hours,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const now = DateTime.now();

  // Fetch intervals for the next 7 days
  const allIntervals = h.getIntervalsForNDays(7, now);

  // Split intervals into buckets by day of week
  const hoursDays = intervalsToHoursDays(
    allIntervals,
    now,
    props.dayOfWeekNames
  );

  return <HoursTableComponent {...props} hoursData={hoursDays} isClient />;
};

export const ServerSideHoursTable: React.FC<HoursTableProps> = (props) => {
  const { hours, dayOfWeekNames, intervalTranslations } = props;

  const hoursTableData: HoursTableDayData[] = days.map((day) => {
    const dayKey = dayToDayKey[day];
    return {
      dayName: dayOfWeekNames?.[dayKey] || defaultDayName(day),
      startDay: day,
      endDay: day,
      isToday: false,
      intervals:
        hours[dayKey]?.openIntervals?.map(
          (interval) => new HoursInterval(DateTime.now(), interval, "UTC")
        ) ?? [],
    };
  });

  const holidayHoursData: HoursTableDayData[] | undefined =
    hours.holidayHours?.map((holiday) => {
      const date = DateTime.fromFormat(holiday.date, "yyyy-MM-dd");
      const day = luxonDateToDay(date);
      return {
        dayName: date
          .setLocale(intervalTranslations?.timeFormatLocale || "en-US")
          .toLocaleString(),
        isToday: false,
        startDay: day,
        endDay: day,
        intervals:
          (holiday.isRegularHours
            ? holiday.openIntervals?.map(
                (interval) => new HoursInterval(date, interval, "UTC")
              )
            : hoursTableData.find((d) => (d.startDay = day))?.intervals) ?? [],
      };
    });

  return (
    <>
      <HoursTableComponent
        {...props}
        hoursData={hoursTableData}
        isClient={false}
      />
      {holidayHoursData && holidayHoursData.length > 0 && (
        <HoursTableComponent
          {...props}
          hoursData={holidayHoursData}
          isClient={false}
          isHolidayHours
        />
      )}
      {hours.reopenDate && (
        <div className="HoursTable-row">
          <span className="HoursTable-day">
            {intervalTranslations?.reopenDate || "Reopen Date"}
          </span>
          <span className="HoursTable-intervals">
            {DateTime.fromFormat(hours.reopenDate, "yyyy-MM-dd")
              .setLocale(intervalTranslations?.timeFormatLocale || "en-US")
              .toLocaleString()}
          </span>
        </div>
      )}
    </>
  );
};

interface HoursTableComponentProps extends Omit<HoursTableProps, "hours"> {
  hoursData: HoursTableDayData[];
  isClient: boolean;
  isHolidayHours?: boolean;
}

const HoursTableComponent = (props: HoursTableComponentProps) => {
  const {
    intervalStringsBuilderFn,
    className,
    timeOptions,
    intervalTranslations,
    dayOfWeekNames,
    startOfWeek,
    isClient,
    isHolidayHours,
  } = props;
  let hoursData = props.hoursData;

  function startOfWeekOptionToDay(option: HoursTableProps["startOfWeek"]): Day {
    if (!option) return Day.Sunday;

    const map = {
      today: luxonDateToDay(DateTime.now()),
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
  const startIndex = days.indexOf(
    startOfWeekOptionToDay(
      isClient || startOfWeek !== "today" ? startOfWeek : "sunday"
    )
  );
  const sortOrder = arrayShift(days, 7 - startIndex);

  if (!isHolidayHours) {
    hoursData.sort(
      (d1, d2) =>
        sortOrder.indexOf(d1.startDay) - sortOrder.indexOf(d2.startDay)
    );
    if (props.collapseDays) {
      hoursData = collapseDays(hoursData, dayOfWeekNames);
    }
  }

  return (
    <div className={c("HoursTable", className)}>
      {hoursData.map((dayData) => {
        const builderFn =
          intervalStringsBuilderFn || defaultIntervalStringsBuilder;
        const intervalStrings = builderFn(
          dayData,
          timeOptions,
          intervalTranslations
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
  );
};

export { HoursTable };
