import { HoursType } from "./types.js";

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
    isClosed: false,
    openIntervals: [{ start: "9:07", end: "18:07" }],
  },
};

export const HoursWithMultipleIntervalsData: HoursType = {
  friday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
    isClosed: false,
  },
  monday: {
    openIntervals: [
      { end: "13:00", start: "10:00" },
      { end: "19:00", start: "14:00" },
    ],
    isClosed: false,
  },
  saturday: {
    openIntervals: [
      { end: "15:00", start: "08:00" },
      { end: "20:00", start: "16:00" },
    ],
    isClosed: false,
  },
  sunday: {
    openIntervals: [],
    isClosed: true,
  },
  thursday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
    isClosed: false,
  },
  tuesday: {
    openIntervals: [
      { end: "15:00", start: "10:00" },
      { end: "19:00", start: "17:00" },
    ],
    isClosed: false,
  },
  wednesday: {
    openIntervals: [{ end: "19:00", start: "10:00" }],
    isClosed: false,
  },
};
