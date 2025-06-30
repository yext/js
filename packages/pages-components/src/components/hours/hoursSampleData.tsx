import { DateTime } from "luxon";
import { HoursType } from "./types.js";

const now = DateTime.now();
const nextMonday = now.plus({ days: (1 - now.weekday + 7) % 7 });
const nextWednesday = now.plus({ days: (3 - now.weekday + 7) % 7 });
const nextSaturday = now.plus({ days: (6 - now.weekday + 7) % 7 });

export const HoursData: HoursType = {
  monday: {
    isClosed: false,
    openIntervals: [{ start: "9:01", end: "18:01" }],
  },
  tuesday: {
    isClosed: false,
    openIntervals: [{ start: "9:02", end: "18:02" }],
  },
  wednesday: {
    isClosed: false,
    openIntervals: [{ start: "9:03", end: "18:03" }],
  },
  thursday: {
    isClosed: false,
    openIntervals: [{ start: "9:04", end: "18:04" }],
  },
  friday: {
    isClosed: false,
    openIntervals: [{ start: "9:05", end: "18:05" }],
  },
  saturday: {
    isClosed: false,
    openIntervals: [{ start: "9:06", end: "18:06" }],
  },
  sunday: {
    isClosed: true,
  },
};

export const CollapsableHoursData: HoursType = {
  monday: {
    isClosed: false,
    openIntervals: [{ start: "9:01", end: "18:01" }],
  },
  tuesday: {
    isClosed: false,
    openIntervals: [{ start: "9:01", end: "18:01" }],
  },
  wednesday: {
    isClosed: false,
    openIntervals: [{ start: "9:01", end: "18:01" }],
  },
  thursday: {
    isClosed: false,
    openIntervals: [{ start: "9:04", end: "18:04" }],
  },
  friday: {
    isClosed: false,
    openIntervals: [{ start: "9:04", end: "18:04" }],
  },
  saturday: {
    isClosed: true,
  },
  sunday: {
    isClosed: true,
  },
};

export const HoursWithMultipleIntervalsData: HoursType = {
  friday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
  },
  monday: {
    openIntervals: [
      { end: "13:00", start: "10:00" },
      { end: "19:00", start: "14:00" },
    ],
  },
  saturday: {
    openIntervals: [
      { end: "15:00", start: "08:00" },
      { end: "20:00", start: "16:00" },
    ],
  },
  sunday: {
    openIntervals: [],
  },
  thursday: {
    // overnight
    openIntervals: [{ end: "2:00", start: "10:00" }],
  },
  tuesday: {
    openIntervals: [
      { end: "15:00", start: "10:00" },
      { end: "19:00", start: "17:00" },
    ],
  },
  wednesday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
  },
};

export const HoursTemporarilyClosed: HoursType = {
  reopenDate: "2025-07-01",
  friday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
  },
  monday: {
    openIntervals: [
      { end: "13:00", start: "10:00" },
      { end: "19:00", start: "14:00" },
    ],
  },
  saturday: {
    openIntervals: [
      { end: "15:00", start: "08:00" },
      { end: "20:00", start: "16:00" },
    ],
  },
  sunday: {
    openIntervals: [],
  },
  thursday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
  },
  tuesday: {
    openIntervals: [
      { end: "15:00", start: "10:00" },
      { end: "19:00", start: "17:00" },
    ],
  },
  wednesday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
  },
};

export const HoursWithHolidayHours: HoursType = {
  holidayHours: [
    // holiday in past
    {
      date: now.minus({ weeks: 2 }).toFormat("yyyy-MM-dd"),
      isClosed: true,
    },
    // current holiday - closed
    {
      date: nextMonday.toFormat("yyyy-MM-dd"),
      isClosed: true,
    },
    // current holiday - normal hours
    {
      date: nextWednesday.toFormat("yyyy-MM-dd"),
      isRegularHours: true,
    },
    // current holiday - different hours
    {
      date: nextSaturday.toFormat("yyyy-MM-dd"),
      openIntervals: [{ end: "15:00", start: "08:00" }],
    },
    // holiday in future
    {
      date: DateTime.now().plus({ weeks: 2 }).toFormat("yyyy-MM-dd"),
      isClosed: true,
    },
  ],
  friday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
  },
  monday: {
    openIntervals: [
      { end: "13:00", start: "10:00" },
      { end: "19:00", start: "14:00" },
    ],
  },
  saturday: {
    openIntervals: [
      { end: "15:00", start: "08:00" },
      { end: "20:00", start: "16:00" },
    ],
  },
  sunday: {
    openIntervals: [],
  },
  thursday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
  },
  tuesday: {
    openIntervals: [
      { end: "15:00", start: "10:00" },
      { end: "19:00", start: "17:00" },
    ],
  },
  wednesday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
  },
};

export const Hours247: HoursType = {
  monday: {
    openIntervals: [{ start: "0:00", end: "23:59" }],
  },
  tuesday: {
    openIntervals: [{ start: "0:00", end: "23:59" }],
  },
  wednesday: {
    openIntervals: [{ start: "0:00", end: "23:59" }],
  },
  thursday: {
    openIntervals: [{ start: "0:00", end: "23:59" }],
  },
  friday: {
    openIntervals: [{ start: "0:00", end: "23:59" }],
  },
  saturday: {
    openIntervals: [{ start: "0:00", end: "23:59" }],
  },
  sunday: {
    openIntervals: [{ start: "0:00", end: "23:59" }],
  },
};

export const DSTHours: HoursType = {
  saturday: {
    openIntervals: [{ start: "10:00", end: "2:00" }],
  },
  sunday: {
    openIntervals: [{ start: "10:00", end: "02:00" }],
  },
};
