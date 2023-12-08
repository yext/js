import type { Preview } from "@storybook/react";
import { runOnly } from "./wcagConfig.ts";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    a11y: {
      options: {
        runOnly,
      },
    },
  },
};

export default preview;
