import { Meta, StoryObj } from "@storybook/react";
import { HoursTable } from "./hoursTable.js";
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

const meta: Meta<typeof HoursTable> = {
  title: "components/Hours",
  component: HoursTable,
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
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 9, hour: 12 } // January 9, 2025 - Thursday
    ),
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
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 12 } // January 7, 2025 - Tuesday
    ),
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

export const TemporarilyClosedActive: Story = {
  args: {
    hours: HoursTemporarilyClosed,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 1, hour: 12 } // before reopenDate
    ),
  },
};

export const TemporarilyClosedInactive: Story = {
  args: {
    hours: HoursTemporarilyClosed,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 8, day: 1, hour: 12 } // before reopenDate
    ),
  },
};

export const HolidayHours: Story = {
  args: {
    hours: HoursWithHolidayHours, // includes active and inactive holidays
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
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 8, hour: 12 } // January 8, 2025 - Wednesday
    ),
  },
};

export const IntervalStringsBuilderFnCollapseDays: Story = {
  args: {
    collapseDays: true,
    hours: CollapsableHoursData,
    intervalStringsBuilderFn: intervalFn,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 8, hour: 12 } // January 8, 2025 - Wednesday
    ),
  },
};

export const MissingHours: Story = {
  args: {
    hours: undefined,
  },
};
