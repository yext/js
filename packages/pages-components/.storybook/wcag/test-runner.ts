import { injectAxe, checkA11y } from "axe-playwright";
import { Page } from "playwright-core";
import { runOnly } from "../wcagConfig.ts";
import { TestRunnerConfig } from "@storybook/test-runner";

/**
 * See https://storybook.js.org/docs/react/writing-tests/test-runner#test-hook-api-experimental
 * to learn more about the test-runner hooks API.
 */
const renderFunctions: TestRunnerConfig = {
  async preVisit(page: Page) {
    await injectAxe(page);
  },
  async postVisit(page: Page) {
    await checkA11y(page, "#storybook-root", {
      axeOptions: { runOnly },
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
};

export default renderFunctions;
