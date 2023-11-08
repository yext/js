import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import LegacyRichText from "./LegacyRichText.js";

const meta: Meta<typeof LegacyRichText> = {
  title: 'Legacy Rich Text',
  component: LegacyRichText
};
export default meta;

export const Primary: StoryFn<typeof LegacyRichText> = () => <LegacyRichText markdown="Some ++underline++, ~~strikethrough~~, sub~script~, and super^script^ text!"/>;