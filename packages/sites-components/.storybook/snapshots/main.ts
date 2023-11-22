import baseConfig from "../main";
import type { StorybookConfig } from "@storybook/react-vite";

const stories = baseConfig.stories.map((glob) => `../${glob}`);
const config: StorybookConfig = {
  ...baseConfig,
  stories,
};

export default config;
