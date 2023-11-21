import { injectAxe, getAxeResults } from "axe-playwright";
import { Page } from "playwright-core";
import { runOnly } from "./wcagConfig";
import { TestRunnerConfig } from "@storybook/test-runner";
import assert from "assert";
import { Result } from "axe-core";

/**
 * See https://storybook.js.org/docs/react/writing-tests/test-runner#test-hook-api-experimental
 * to learn more about the test-runner hooks API.
 */
const renderFunctions: TestRunnerConfig = {
  async preRender(page: Page) {
    await injectAxe(page);
  },
  async postRender(page: Page) {
    const { violations, incomplete } = await getAxeResults(
      page,
      "#storybook-root",
      { runOnly }
    );
    const failedResults = [...violations, ...incomplete];
    failedResults.length && logResults(failedResults);

    assert.strictEqual(
      failedResults.length,
      0,
      `${violations.length} violated and ${incomplete.length} incomplete accessibility checks were detected`
    );
  },
};

function logResults(results: Result[]) {
  console.table(
    results.map(({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    }))
  );
  console.table(getNodeViolations(results));
}

function getNodeViolations(results: Result[]) {
  const aggregate: Record<
    string,
    {
      target: string;
      html: string;
      rules: number[];
    }
  > = {};

  results.map(({ nodes }, index) => {
    nodes.forEach(({ target, html }) => {
      const key = JSON.stringify(target) + html;
      if (aggregate[key]) {
        aggregate[key].rules.push(index);
      } else {
        aggregate[key] = {
          target: JSON.stringify(target),
          html,
          rules: [index],
        };
      }
    });
  });

  return Object.values(aggregate).map(({ target, html, rules }) => ({
    target,
    html,
    rules: JSON.stringify(rules),
  }));
}

export default renderFunctions;
