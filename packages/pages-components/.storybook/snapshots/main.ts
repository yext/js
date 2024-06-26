import baseConfig from "../main.ts";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  ...baseConfig,
  stories: baseConfig.stories.map((glob) => `../${glob}`),
};

export default config;
