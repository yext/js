import { Meta, StoryObj } from "@storybook/react";
import { HoursStatus } from "./hoursStatus.js";
import {
  DSTHours,
  Hours247,
  HoursData,
  HoursTemporarilyClosed,
  HoursWithHolidayHours,
  HoursWithMultipleIntervalsData,
} from "./hoursSampleData.js";
import { DateTime } from "luxon";
import { StatusParams } from "./types.js";

const meta: Meta<typeof HoursStatus> = {
  title: "components/HoursStatus",
  component: HoursStatus,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenNow: Story = {
  args: {
    hours: HoursData,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 10 } // Tuesday 10 AM
    ),
  },
};

export const ClosedNow: Story = {
  args: {
    hours: HoursData,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 19 } // Tuesday 10 PM
    ),
  },
};

export const OpenNowWithIntervals: Story = {
  args: {
    hours: HoursWithMultipleIntervalsData,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 6, hour: 11 } // Monday 11 AM
    ),
  },
};

export const ClosedNowWithIntervals: Story = {
  args: {
    hours: HoursWithMultipleIntervalsData,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 6, hour: 13, minute: 30 } // Monday 1:30 PM
    ),
  },
};

export const OpenWithOvernightInterval: Story = {
  args: {
    hours: HoursWithMultipleIntervalsData,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 10, hour: 1, minute: 30 } // Friday 1:30 AM
    ),
  },
};

export const Open247: Story = {
  args: {
    hours: Hours247,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 6, hour: 11 } // Monday 11 AM
    ),
  },
};

export const IndefinitelyClosedActive: Story = {
  args: {
    hours: HoursTemporarilyClosed,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 19 } // before reopenDate
    ),
  },
};

export const IndefinitelyClosedInactive: Story = {
  args: {
    hours: HoursTemporarilyClosed,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 8, day: 5, hour: 10 } // after reopenDate
    ),
  },
};

export const TwentyFourHourClock: Story = {
  args: { hours: HoursData, timeOptions: { hour12: false } },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 14 } // Tuesday 2 PM
    ),
  },
};

export const Timezone: Story = {
  args: {
    hours: HoursData,
    timezone: "America/Los_Angeles",
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      // Should be closed because it opens at 9:01 AM PT
      { year: 2025, month: 1, day: 7, hour: 10 } // Tuesday 10 AM ET
    ),
  },
};

export const HolidayHoursNormal: Story = {
  args: {
    hours: HoursWithHolidayHours,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 15, hour: 12 } // January 15, 2025 - Wednesday
    ),
  },
};

export const HolidayHoursClosed: Story = {
  args: {
    hours: HoursWithHolidayHours,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 16, hour: 12 } // January 16, 2025 - Thursday
    ),
  },
};

export const HolidayHoursNextDayClosed: Story = {
  args: {
    hours: HoursWithHolidayHours,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 12, hour: 22 } // January 12, 2025 - Sunday
    ),
  },
};

export const HolidayHoursModified: Story = {
  args: {
    hours: HoursWithHolidayHours,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 18, hour: 17 } // January 18, 2025 - Saturday
    ),
  },
};

export const DayTimeOptions: Story = {
  args: {
    hours: HoursData,
    timeOptions: {
      hour: "2-digit",
      dayPeriod: "long",
      timeZoneName: "shortGeneric",
    },
    dayOptions: {
      weekday: "short",
    },
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 10 } // Tuesday 10 AM ET
    ),
  },
};

const green = { color: "green" };

export const IndividualTemplatesOverrideOpen: Story = {
  args: {
    hours: HoursData,
    currentTemplate: (s: StatusParams) => (s.isOpen ? "✅" : "⛔️"),
    timeTemplate: () => <></>,
    dayOfWeekTemplate: (s: StatusParams) => (
      <span style={green}>
        {s.isOpen
          ? s.currentInterval?.getEndTime()
          : s.futureInterval?.getStartTime()}
      </span>
    ),
    separatorTemplate: () => " :: ",
    futureTemplate: (params: StatusParams) => {
      return (
        <span className="HoursStatus-future">
          {params.isOpen ? "Will be closing at " : "Will be opening at "}
        </span>
      );
    },
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 10 } // Tuesday 10 AM
    ),
  },
};

export const IndividualTemplatesOverrideClosed: Story = {
  args: {
    hours: HoursData,
    currentTemplate: (s: StatusParams) => (s.isOpen ? "✅" : "⛔️"),
    timeTemplate: () => <></>,
    dayOfWeekTemplate: (s: StatusParams) => (
      <span style={green}>
        {s.isOpen
          ? s.currentInterval?.getEndTime()
          : s.futureInterval?.getStartTime()}
      </span>
    ),
    separatorTemplate: () => " :: ",
    futureTemplate: (params: StatusParams) => {
      return (
        <span className="HoursStatus-future">
          {params.isOpen ? "Will be closing at " : "Will be opening at "}
        </span>
      );
    },
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 22 } // Tuesday 10 PM
    ),
  },
};

export const CompleteTemplateOverrideOpen: Story = {
  args: {
    hours: HoursData,
    statusTemplate: (s: StatusParams) =>
      s.isOpen ? "We are open" : "We are closed",
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 10 } // Tuesday 10 AM
    ),
  },
};

export const CompleteTemplateOverrideClosed: Story = {
  args: {
    hours: HoursData,
    statusTemplate: (s: StatusParams) =>
      s.isOpen ? "We are open" : "We are closed",
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 22 } // Tuesday 10 PM
    ),
  },
};

export const SpringDST: Story = {
  args: {
    hours: DSTHours,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      // DST Day
      { year: 2025, month: 3, day: 9, hour: 1 } // March 9, 2025 - Sunday
    ),
  },
};

export const SpringDST2: Story = {
  args: {
    hours: DSTHours,
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      // Day after DST
      { year: 2025, month: 3, day: 10, hour: 1 } // March 10, 2025 - Monday
    ),
  },
};

export const MissingHours: Story = {
  args: {
    hours: undefined,
  },
};
