import {
  getHoursByDay,
  OpeningHoursSchema,
  OpeningHoursSpecificationSchema,
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
        end: "23:59",
        start: "00:00",
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
  holidayHours: [
    {
      date: "2025-12-25",
      isClosed: true,
    },
    {
      date: "2025-12-31",
      isClosed: false,
      openIntervals: [{ start: "09:00", end: "13:00" }],
    },
    {
      date: "2026-01-01",
      isRegularHours: true,
    },
  ],
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
    expect(OpeningHoursSchema(hours)).toEqual({
      openingHours: [
        "Mo,Tu,We,Th,Su 10:00-22:00",
        "We 07:00-09:00",
        "Fr 00:00-00:00",
        "Sa 00:00-23:59",
      ],
    });
  });
});

describe("OpeningHoursSpecificationSchema", () => {
  it("correctly builds openingHoursSpecification schema", () => {
    const result = OpeningHoursSpecificationSchema(hours);

    // Expected Regular Hours (openingHoursSpecification)
    const expectedRegularHours = [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "https://schema.org/Monday",
          "https://schema.org/Tuesday",
          "https://schema.org/Wednesday",
          "https://schema.org/Thursday",
          "https://schema.org/Sunday",
        ],
        opens: "10:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Wednesday",
        opens: "07:00",
        closes: "09:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Friday",
        opens: "00:00",
        closes: "00:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Saturday",
        opens: "00:00",
        closes: "23:59",
      },
    ];

    // Expected Special Hours (specialOpeningHoursSpecification)
    const expectedSpecialHours = [
      // 2025-12-25 (Closed)
      {
        "@type": "OpeningHoursSpecification",
        validFrom: "2025-12-25",
        validThrough: "2025-12-25",
        opens: "00:00",
        closes: "00:00",
      },
      // 2025-12-31 (Modified Hours)
      {
        "@type": "OpeningHoursSpecification",
        validFrom: "2025-12-31",
        validThrough: "2025-12-31",
        opens: "09:00",
        closes: "13:00",
      },
      // 2026-01-01 (isRegularHours: true) is correctly omitted
    ];

    expect(result.openingHoursSpecification).toEqual(
      expect.arrayContaining(expectedRegularHours)
    );
    expect(result.specialOpeningHoursSpecification).toEqual(
      expect.arrayContaining(expectedSpecialHours)
    );
    expect(result?.openingHoursSpecification?.length).toBe(4);
    expect(result?.specialOpeningHoursSpecification?.length).toBe(2);
  });

  it("handles hours with all days closed", () => {
    const allClosedHours = {
      friday: {
        isClosed: true,
      },
      monday: {
        isClosed: true,
      },
      saturday: {
        isClosed: true,
      },
      sunday: {
        isClosed: true,
      },
      thursday: {
        isClosed: true,
      },
      tuesday: {
        isClosed: true,
      },
      wednesday: {
        isClosed: true,
      },
    };
    expect(OpeningHoursSpecificationSchema(allClosedHours)).toEqual({
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "https://schema.org/Monday",
            "https://schema.org/Tuesday",
            "https://schema.org/Wednesday",
            "https://schema.org/Thursday",
            "https://schema.org/Friday",
            "https://schema.org/Saturday",
            "https://schema.org/Sunday",
          ],
          opens: "00:00",
          closes: "00:00",
        },
      ],
    });
  });

  it("returns empty when invalid data is provided", () => {
    expect(OpeningHoursSpecificationSchema(undefined)).toEqual({});
    expect(OpeningHoursSpecificationSchema({})).toEqual({});
    expect(OpeningHoursSpecificationSchema("hours" as any)).toEqual({});
    expect(
      OpeningHoursSpecificationSchema({
        monday: hours.monday,
        holidayHours: [1, 2, 3] as any,
      })
    ).toEqual({
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "https://schema.org/Monday",
          opens: "10:00",
          closes: "22:00",
        },
      ],
    });
  });
});
