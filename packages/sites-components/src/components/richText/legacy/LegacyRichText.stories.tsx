import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import LegacyRichText from "./LegacyRichText.js";

const meta: Meta<typeof LegacyRichText> = {
  title: 'components/LegacyRichText',
  component: LegacyRichText
};
export default meta;

const Template: StoryFn<typeof LegacyRichText> = (args) => <LegacyRichText {...args} />;

const markdown = "Some ++underline++, ~~strikethrough~~, sub~script~, and super^script^ text!";
export const Primary: StoryFn<typeof LegacyRichText> = Template.bind({});
Primary.args = { markdown };