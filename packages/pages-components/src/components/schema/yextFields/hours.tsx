import { HoursType, DayType } from "../../hours/types.js";

type OpeningHoursSpecification = {
  "@type": "OpeningHoursSpecification";
  dayOfWeek?: string;
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

  const mondayHours = getHoursSpecificationByDay(hours.monday, "Monday");
  const tuesdayHours = getHoursSpecificationByDay(hours.tuesday, "Tuesday");
  const wednesdayHours = getHoursSpecificationByDay(
    hours.wednesday,
    "Wednesday"
  );
  const thursdayHours = getHoursSpecificationByDay(hours.thursday, "Thursday");
  const fridayHours = getHoursSpecificationByDay(hours.friday, "Friday");
  const saturdayHours = getHoursSpecificationByDay(hours.saturday, "Saturday");
  const sundayHours = getHoursSpecificationByDay(hours.sunday, "Sunday");

  const openingHoursSpecificationSchema: {
    openingHoursSpecification?: OpeningHoursSpecification[];
    specialOpeningHoursSpecification?: OpeningHoursSpecification[];
  } = {
    openingHoursSpecification: [
      ...mondayHours,
      ...tuesdayHours,
      ...wednesdayHours,
      ...thursdayHours,
      ...fridayHours,
      ...saturdayHours,
      ...sundayHours,
    ],
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

const getHoursSpecificationByDay = (
  hours: DayType | undefined,
  day?: string
): OpeningHoursSpecification[] => {
  if (!validateDayType(hours) || hours.isClosed || !hours.openIntervals) {
    return [];
  }

  return hours.openIntervals.map((interval) => {
    const specification: OpeningHoursSpecification = {
      "@type": "OpeningHoursSpecification",
      opens: interval.start,
      closes: interval.end,
    };

    if (day) {
      specification.dayOfWeek = `https://schema.org/${day}`;
    }

    return specification;
  });
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
      });
    } else {
      holidayHoursSpecifications.push(
        ...getHoursSpecificationByDay(holiday, undefined).map(
          (holidayHours) => ({
            ...holidayHours,
            validFrom: holiday.date,
            validThrough: holiday.date,
          })
        )
      );
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
