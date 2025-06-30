import { Meta, StoryObj } from "@storybook/react";
import { HoursStatus } from "./hoursStatus.js";
import {
  Hours247,
  HoursData,
  HoursTemporarilyClosed,
  HoursWithMultipleIntervalsData,
} from "./hoursSampleData.js";
import { DateTime } from "luxon";

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
      { year: 2025, month: 1, day: 6, hour: 14 } // Monday 2 PM
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
};

export const Timezone: Story = {
  args: {
    hours: HoursData,
    timezone: "America/Los_Angeles",
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 10 } // Tuesday 10 AM ET
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
    currentTemplate: (s) => (s.isOpen ? "✅" : "⛔️"),
    timeTemplate: () => <></>,
    dayOfWeekTemplate: (s) => (
      <span style={green}>
        {s.isOpen
          ? s.currentInterval?.getEndTime()
          : s.futureInterval?.getStartTime()}
      </span>
    ),
    separatorTemplate: () => " :: ",
    futureTemplate: (params) => {
      return (
        <span className="HoursStatus-future">
          {params.isOpen ? "Will be closing at" : "Will be opening at"}
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
    currentTemplate: (s) => (s.isOpen ? "✅" : "⛔️"),
    timeTemplate: () => <></>,
    dayOfWeekTemplate: (s) => (
      <span style={green}>
        {s.isOpen
          ? s.currentInterval?.getEndTime()
          : s.futureInterval?.getStartTime()}
      </span>
    ),
    separatorTemplate: () => " :: ",
    futureTemplate: (params) => {
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
    statusTemplate: (s) => (s.isOpen ? "We are open" : "We are closed"),
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
    statusTemplate: (s) => (s.isOpen ? "We are open" : "We are closed"),
  },
  parameters: {
    mockedLuxonDateTime: DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 22 } // Tuesday 10 PM
    ),
  },
};

// export const MissingHours: Story = {
//   args: {
//     hours: undefined,
//   },
// };
