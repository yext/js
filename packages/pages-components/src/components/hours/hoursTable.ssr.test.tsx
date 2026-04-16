// @vitest-environment node

import { afterEach, describe, expect, it } from "vitest";
import { DateTime, Settings } from "luxon";
import { renderToString } from "react-dom/server";
import { HoursTable } from "./hoursTable.js";
import { HoursData } from "./hoursSampleData.js";

const originalNow = Settings.now;
const originalDefaultZone = Settings.defaultZone;

describe("HoursTable SSR", () => {
  afterEach(() => {
    Settings.now = originalNow;
    Settings.defaultZone = originalDefaultZone;
    vi.restoreAllMocks();
  });

  it("renders the server-safe table without SSR warnings", () => {
    const mockedNow = DateTime.fromObject(
      { year: 2025, month: 1, day: 9, hour: 12 },
      { zone: "America/New_York" }
    );

    Settings.now = () => mockedNow.toMillis();
    Settings.defaultZone = "America/New_York";

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const html = renderToString(<HoursTable hours={HoursData} startOfWeek="today" />);
    const dayLabels = [...html.matchAll(/<span class="HoursTable-day">([^<]+)<\/span>/g)].map(
      (match) => match[1]
    );

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(html).toContain("HoursTable-row");
    expect(html).not.toContain("is-today");
    expect(dayLabels[0]).toBe("Sunday");
  });
});
