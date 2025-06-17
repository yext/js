import {
  getHoursByDay,
  OpeningHoursSchema,
  validateDayType,
  validateHoursType,
} from "./hours.js";

const hours = {
  friday: {
    isClosed: true,
  },
  monday: {
    isClosed: false,
    openIntervals: [
      {
        end: "22:00",
        start: "10:00",
      },
    ],
  },
  saturday: {
    openIntervals: [
      {
        end: "22:00",
        start: "10:00",
      },
    ],
  },
  sunday: {
    openIntervals: [
      {
        end: "22:00",
        start: "10:00",
      },
    ],
  },
  thursday: {
    openIntervals: [
      {
        end: "22:00",
        start: "10:00",
      },
    ],
  },
  tuesday: {
    openIntervals: [
      {
        end: "22:00",
        start: "10:00",
      },
    ],
  },
  wednesday: {
    openIntervals: [
      {
        end: "22:00",
        start: "10:00",
      },
      {
        end: "09:00",
        start: "07:00",
      },
    ],
  },
};

describe("validateHoursType", () => {
  it("returns false for invalid hours", () => {
    expect(validateHoursType(undefined)).toBe(false);
    expect(validateHoursType("{}")).toBe(false);
    expect(validateHoursType({})).toBe(false);
  });
  it("returns true for valid hours", () => {
    expect(validateHoursType(hours)).toBe(true);
    expect(validateHoursType({ monday: hours.monday })).toBe(true);
  });
});

describe("validateDayType", () => {
  it("returns false for invalid hours", () => {
    expect(validateDayType(undefined)).toBe(false);
    expect(validateDayType("{}")).toBe(false);
    expect(validateDayType({})).toBe(false);
    expect(validateDayType({ isClosed: false })).toBe(false);
    expect(validateDayType({ openIntervals: {} })).toBe(false);
    expect(validateDayType({ openIntervals: [] })).toBe(false);
    expect(validateDayType({ openIntervals: [1] })).toBe(false);
  });
  it("returns true for valid hours", () => {
    expect(validateDayType({ isClosed: true })).toBe(true);
    expect(validateDayType(hours.monday)).toBe(true);
    expect(validateDayType(hours.tuesday)).toBe(true);
  });
});

describe("getHoursByDay", () => {
  it("returns the existing values for invalid days", () => {
    const map = new Map();
    map.set("00:00-23:59", ["Mo"]);

    expect(getHoursByDay(undefined, map, "Tu")).toBe(map);
  });
  it("adds 00:00-00:00 when closed", () => {
    const map1 = new Map();
    map1.set("00:00-23:59", ["Mo"]);
    const map2 = new Map();
    map2.set("00:00-23:59", ["Mo"]);
    map2.set("00:00-00:00", ["Tu"]);

    expect(getHoursByDay({ isClosed: true }, map1, "Tu")).toEqual(map2);
  });
  it("adds hours when open", () => {
    const map1 = new Map();
    map1.set("00:00-23:59", ["Mo"]);
    const map2 = new Map();
    map2.set("00:00-23:59", ["Mo"]);
    map2.set("10:00-22:00", ["We"]);
    map2.set("07:00-09:00", ["We"]);

    expect(getHoursByDay(hours.wednesday, map1, "We")).toEqual(map2);
    map2.set("10:00-22:00", ["We", "Th"]);
    expect(getHoursByDay(hours.thursday, map1, "Th")).toEqual(map2);
  });
});

describe("OpeningHoursSchema", () => {
  it("returns an empty object when hours are invalid", () => {
    expect(OpeningHoursSchema(undefined)).toEqual({});
    expect(OpeningHoursSchema({})).toEqual({});
    expect(OpeningHoursSchema("hours" as any)).toEqual({});
  });
  it("returns the correct schema", () => {
    console.log(OpeningHoursSchema(hours));
    expect(OpeningHoursSchema(hours)).toEqual({
      openingHours: [
        "Mo,Fr 00:00-00:00",
        "Tu,We,Th,Sa,Su 10:00-22:00",
        "We 07:00-09:00",
      ],
    });
  });
});
