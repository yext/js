import { HoursType, DayType } from "../../hours/types.js";

const validateHoursType = (hours: any): hours is HoursType => {
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

const validateDayType = (hours: any): hours is DayType => {
  if (
    typeof hours === "object" &&
    "isClosed" in hours &&
    Array.isArray(hours.openIntervals)
  ) {
    if (hours.openIntervals.length === 0) {
      return true;
    }
    let result = true;
    hours.openIntervals.forEach((interval: any) => {
      result =
        result &&
        typeof interval === "object" &&
        "start" in interval &&
        "end" in interval;
    });
    return result;
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

const getHoursByDay = (
  hours: DayType | undefined,
  hoursMap: Map<string, Array<string>>,
  day: string
) => {
  if (!validateDayType(hours) || hours.isClosed) {
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
