import { Page } from "playwright-core";
import {
  TestRunnerConfig,
  waitForPageReady,
  TestContext,
} from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

const customSnapshotsDir = `${process.cwd()}/.storybook/snapshots/__snapshots__`;

/**
 * See https://storybook.js.org/docs/react/writing-tests/test-runner#test-hook-api-experimental
 * to learn more about the test-runner hooks API.
 */
const renderFunctions: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page: Page, context: TestContext) {
    await waitForPageReady(page);
    await waitForImagesToLoad(page);

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
    });
  },
};

/**
 * `page.waitForLoadState` does not work as expected, so function
 * is needed to wait for images to load before taking a screenshot
 */
async function waitForImagesToLoad(page: Page) {
  await page.waitForFunction(() => {
    const images = [...document.querySelectorAll("img")];
    return images.every((img) => img.complete);
  });
}
export default renderFunctions;
