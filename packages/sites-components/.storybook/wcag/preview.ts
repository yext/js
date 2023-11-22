import type { Preview } from "@storybook/react";
import basePreview from "../preview";
import { runOnly } from "./wcagConfig";

const preview: Preview = {
  parameters: {
    ...basePreview,
    a11y: {
      options: {
        runOnly,
      },
    },
  }
};

export default preview;

