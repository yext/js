import { Meta, StoryFn } from "@storybook/react";
import { HoursTable } from "./hoursTable.js";
import {
  HoursData,
  HoursWithMultipleIntervalsData,
} from "./hoursSampleData.js";

const meta: Meta<typeof HoursTable> = {
  title: "components/Hours",
  component: HoursTable,
};

export default meta;

const Template: StoryFn<typeof HoursTable> = (args) => <HoursTable {...args} />;

export const NormalHours: StoryFn<typeof HoursTable> = Template.bind({});

NormalHours.args = {
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
};

// Hours table with normal hours in military time

export const NormalHours24: StoryFn<typeof HoursTable> = Template.bind({});

NormalHours24.args = {
  hours: HoursData,
  timeOptions: {
    hour12: false,
  },
};

export const HourswithIntervals: StoryFn<typeof HoursTable> = Template.bind({});

HourswithIntervals.args = {
  hours: HoursWithMultipleIntervalsData,
};
