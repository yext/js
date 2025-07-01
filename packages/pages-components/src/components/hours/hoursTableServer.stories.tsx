import { Meta, StoryObj } from "@storybook/react";
import { ServerSideHoursTable } from "./hoursTable.js";
import {
  CollapsableHoursData,
  Hours247,
  HoursData,
  HoursTemporarilyClosed,
  HoursWithHolidayHours,
  HoursWithMultipleIntervalsData,
} from "./hoursSampleData.js";
import { DateTime } from "luxon";
import { HoursTableDayData } from "./types.js";

// Creates a random DateTime in 2025
const getRandomTime = () => {
  const start = DateTime.utc(2025, 1, 1).toMillis();
  const end = DateTime.utc(2025, 12, 31).toMillis();

  const randomMillis = start + Math.random() * (end - start);

  return DateTime.fromMillis(randomMillis);
};

const meta: Meta<typeof ServerSideHoursTable> = {
  title: "components/ServerSideHoursTable",
  component: ServerSideHoursTable,
  parameters: {
    mockedLuxonDateTime: getRandomTime(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NormalHours: Story = {
  args: {
    hours: HoursData,
  },
};

export const NormalHoursWedStart: Story = {
  args: {
    hours: HoursData,
    startOfWeek: "wednesday",
  },
};

export const NormalHoursTodayStart: Story = {
  args: {
    hours: HoursData,
    startOfWeek: "today",
  },
};

export const NormalHoursWithIntervals: Story = {
  args: {
    hours: HoursWithMultipleIntervalsData,
  },
};

export const Open247: Story = {
  args: {
    hours: Hours247,
  },
};

export const ModifiedDayOfWeekNames: Story = {
  args: {
    hours: HoursData,
    dayOfWeekNames: {
      sunday: "Sun",
      monday: "Mon",
      tuesday: "Tues",
      wednesday: "Wed",
      thursday: "Thur",
      friday: "Fri",
      saturday: "Sat",
    },
  },
};

export const PartiallyModifiedDayOfWeekNames: Story = {
  args: {
    hours: HoursData,
    dayOfWeekNames: {
      sunday: "Sun",
      monday: "Mon",
      friday: "Fri",
      saturday: "Sat",
    },
  },
};

export const CollapseDaysDefaultNames: Story = {
  args: {
    hours: CollapsableHoursData,
    collapseDays: true,
  },
};

export const CollapseDaysCustomNames: Story = {
  args: {
    hours: CollapsableHoursData,
    collapseDays: true,
    dayOfWeekNames: {
      sunday: "Sun",
      monday: "Mon",
      tuesday: "Tues",
      wednesday: "Wed",
      thursday: "Thur",
      friday: "Fri",
      saturday: "Sat",
    },
  },
};

export const CollapseDaysTodayStart: Story = {
  args: {
    hours: CollapsableHoursData,
    collapseDays: true,
    startOfWeek: "today",
  },
};

export const NormalHours24HoursFormat: Story = {
  args: {
    hours: HoursData,
    timeOptions: {
      hour12: false,
    },
  },
};

export const TemporarilyClosed: Story = {
  args: {
    hours: HoursTemporarilyClosed,
  },
};

export const HolidayHours: Story = {
  args: {
    hours: HoursWithHolidayHours,
  },
};

const intervalFn = (h: HoursTableDayData, _t?: Intl.DateTimeFormatOptions) => {
  if (h.intervals.length === 0) {
    return ["⛔️"];
  }

  return h.intervals.map((i) => `${i.getStartTime()} -> ${i.getEndTime()}`);
};

export const IntervalStringsBuilderFn: Story = {
  args: {
    hours: CollapsableHoursData,
    intervalStringsBuilderFn: intervalFn,
  },
};

export const IntervalStringsBuilderFnCollapseDays: Story = {
  args: {
    collapseDays: true,
    hours: CollapsableHoursData,
    intervalStringsBuilderFn: intervalFn,
  },
};
