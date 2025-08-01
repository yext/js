import { Meta, StoryObj } from "@storybook/react";
import { ClientSideHoursTable } from "./hoursTable.js";
import {
  CollapsableHoursData,
  DSTHours,
  Hours247,
  HoursData,
  HoursTemporarilyClosed,
  HoursWithHolidayHours,
  HoursWithMultipleIntervalsData,
  TranslationHours,
} from "./hoursSampleData.js";
import { DateTime } from "luxon";
import { HoursTableDayData } from "./types.js";

const meta: Meta<typeof ClientSideHoursTable> = {
  title: "components/Hours",
  component: ClientSideHoursTable,
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
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 15, hour: 12 } // January 15, 2025 - Thursday
    ),
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

export const SpringDST: Story = {
  args: {
    hours: DSTHours,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      // Day before DST
      { year: 2025, month: 3, day: 8 } // March 8, 2025 - Saturday
      // Saturday should go til 3AM because there is no 2AM
      // Sunday should display 2AM
    ),
  },
};

export const Translations: Story = {
  args: {
    hours: TranslationHours,
    intervalTranslations: {
      isClosed: "Cerrado",
      open24Hours: "Abierto las 24 horas",
      reopenDate: "Fecha de reapertura",
      timeFormatLocale: "fr",
    },
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      // Temporarily closed but about to reopen
      { year: 2025, month: 6, day: 29 } // Jun 29, 2025 - Sunday
    ),
  },
};
