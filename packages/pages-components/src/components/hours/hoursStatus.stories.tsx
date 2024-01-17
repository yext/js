import { Meta, StoryFn } from "@storybook/react";
import { HoursStatus } from './hoursStatus.js';
import { HoursData } from './hoursSampleData.js';

const meta: Meta<typeof HoursStatus> = {
  title: "components/HoursStatus",
  component: HoursStatus,
};

export default meta;

const Template: StoryFn<typeof HoursStatus> = (args) => (
  <HoursStatus {...args} />
);

export const DefaultComponent: StoryFn<typeof HoursStatus> = Template.bind({});
DefaultComponent.args = {
  hours: HoursData,
};


export const TwentyFourHoursClock: StoryFn<typeof HoursStatus> = Template.bind({});
TwentyFourHoursClock.args = {
  hours: HoursData,
  timeOptions: { hour12: false },
};

export const CustomTemplateOverride: StoryFn<typeof HoursStatus>  = Template.bind({});
CustomTemplateOverride.args = {
  hours: HoursData,
  separatorTemplate: () => ' :: ',
  futureTemplate: (params) => {
    return <span className="HoursStatus-future">{params.isOpen ? 'Will be closing at': 'Will be opening at'}</span>;
  }
};