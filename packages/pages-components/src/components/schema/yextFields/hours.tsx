import { HoursType, DayType } from "../../hours/types.js";

type OpeningHoursSpecification = {
  "@type": "OpeningHoursSpecification";
  dayOfWeek?: string | string[];
  opens?: string;
  closes?: string;
  validFrom?: string;
  validThrough?: string;
};

export const validateHoursType = (hours: any): hours is HoursType => {
  if (typeof hours !== "object") {
    return false;
  }
  return (
    "monday" in hours ||
    "tuesday" in hours ||
    "wednesday" in hours ||
    "thursday" in hours ||
    "friday" in hours ||
    "saturday" in hours ||
    "sunday" in hours
  );
};

export const validateDayType = (hours: any): hours is DayType => {
  if (typeof hours !== "object") {
    return false;
  }

  if (hours.isClosed) {
    return true;
  }

  if (
    "openIntervals" in hours &&
    Array.isArray(hours.openIntervals) &&
    hours.openIntervals.length
  ) {
    return hours.openIntervals.every((interval: any) => {
      return (
        typeof interval === "object" && "start" in interval && "end" in interval
      );
    });
  }

  return false;
};

// example output: ["Mo-Fr 10:00-19:00", "Sa 10:00-22:00", "Su 10:00-21:00"]
// weekdays are indicated as Mo, Tu, We, Th, Fr, Sa, Su
export const OpeningHoursSchema = (hours?: HoursType) => {
  if (!validateHoursType(hours)) {
    return {};
  }

  let hoursMap = new Map<string, Array<string>>();

  hoursMap = getHoursByDay(hours.monday, hoursMap, "Mo");
  hoursMap = getHoursByDay(hours.tuesday, hoursMap, "Tu");
  hoursMap = getHoursByDay(hours.wednesday, hoursMap, "We");
  hoursMap = getHoursByDay(hours.thursday, hoursMap, "Th");
  hoursMap = getHoursByDay(hours.friday, hoursMap, "Fr");
  hoursMap = getHoursByDay(hours.saturday, hoursMap, "Sa");
  hoursMap = getHoursByDay(hours.sunday, hoursMap, "Su");

  const hoursArray = new Array<string>();

  for (const [interval, days] of hoursMap) {
    const daysOfWeek = days.join(",");
    hoursArray.push(daysOfWeek + " " + interval);
  }

  return {
    openingHours: hoursArray,
  };
};

export const OpeningHoursSpecificationSchema = (
  hours?: HoursType
): {
  openingHoursSpecification?: OpeningHoursSpecification[];
  specialOpeningHoursSpecification?: OpeningHoursSpecification[];
} => {
  if (!validateHoursType(hours)) {
    return {};
  }

  let hoursMap = new Map<string, Array<string>>();
  hoursMap = getHoursByDay(hours.monday, hoursMap, "Monday");
  hoursMap = getHoursByDay(hours.tuesday, hoursMap, "Tuesday");
  hoursMap = getHoursByDay(hours.wednesday, hoursMap, "Wednesday");
  hoursMap = getHoursByDay(hours.thursday, hoursMap, "Thursday");
  hoursMap = getHoursByDay(hours.friday, hoursMap, "Friday");
  hoursMap = getHoursByDay(hours.saturday, hoursMap, "Saturday");
  hoursMap = getHoursByDay(hours.sunday, hoursMap, "Sunday");

  const specifications: OpeningHoursSpecification[] = [];
  hoursMap.forEach((days, interval) => {
    if (interval.split("-").length !== 2) {
      return;
    }
    specifications.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek:
        days.length === 1
          ? `https://schema.org/${days[0]}`
          : days.map((d) => `https://schema.org/${d}`),
      opens: interval.split("-")[0],
      closes: interval.split("-")[1],
    });
  });

  const openingHoursSpecificationSchema: {
    openingHoursSpecification?: OpeningHoursSpecification[];
    specialOpeningHoursSpecification?: OpeningHoursSpecification[];
  } = {
    openingHoursSpecification: specifications,
  };

  const holidayHoursSpecifications = getHolidayHoursSpecification(
    hours.holidayHours
  );
  if (holidayHoursSpecifications?.length) {
    openingHoursSpecificationSchema.specialOpeningHoursSpecification =
      holidayHoursSpecifications;
  }

  return openingHoursSpecificationSchema;
};

const getHolidayHoursSpecification = (
  holidayHours: HoursType["holidayHours"]
): OpeningHoursSpecification[] => {
  if (!holidayHours || !Array.isArray(holidayHours)) {
    return [];
  }

  const holidayHoursSpecifications: OpeningHoursSpecification[] = [];
  for (const holiday of holidayHours) {
    if (holiday.isRegularHours || !holiday.date) {
      continue;
    }

    if (holiday.isClosed) {
      holidayHoursSpecifications.push({
        "@type": "OpeningHoursSpecification",
        validFrom: holiday.date,
        validThrough: holiday.date,
        opens: "00:00",
        closes: "00:00",
      });
    } else {
      holiday.openIntervals?.forEach((interval) => {
        if (!interval.start || !interval.end) {
          return;
        }

        holidayHoursSpecifications.push({
          "@type": "OpeningHoursSpecification",
          validFrom: holiday.date,
          validThrough: holiday.date,
          opens: interval.start,
          closes: interval.end,
        });
      });
    }
  }

  return holidayHoursSpecifications;
};

export const getHoursByDay = (
  hours: DayType | undefined,
  hoursMap: Map<string, Array<string>>,
  day: string
) => {
  if (!validateDayType(hours)) {
    return hoursMap;
  }

  if (hours.isClosed || !hours.openIntervals) {
    const interval = "00:00-00:00";
    const days = hoursMap.get(interval) ?? [];
    days.push(day);
    hoursMap.set(interval, days);

    return hoursMap;
  }

  for (let i = 0; i < hours.openIntervals.length; i++) {
    const interval =
      hours.openIntervals[i].start + "-" + hours.openIntervals[i].end;
    const days = hoursMap.get(interval) ?? [];
    days.push(day);
    hoursMap.set(interval, days);
  }

  return hoursMap;
};
