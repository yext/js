import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { LexicalRichText } from "./index.js";
import { LEXICAL_RICH_TEXT_SERIALIZED_AST } from "./sampleData.js";

const meta: Meta<typeof LexicalRichText> = {
  title: "components/LexicalRichText",
  component: LexicalRichText,
};
export default meta;

export const Primary: StoryFn<typeof LexicalRichText> = (args) => (
  <LexicalRichText {...args} />
);
Primary.args = {
  serializedAST: JSON.stringify(LEXICAL_RICH_TEXT_SERIALIZED_AST),
};
