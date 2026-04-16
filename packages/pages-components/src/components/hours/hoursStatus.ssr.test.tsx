// @vitest-environment node

import { afterEach, describe, expect, it } from "vitest";
import { DateTime, Settings } from "luxon";
import { renderToString } from "react-dom/server";
import { HoursStatus } from "./hoursStatus.js";
import { HoursData } from "./hoursSampleData.js";

const originalNow = Settings.now;
const originalDefaultZone = Settings.defaultZone;

describe("HoursStatus SSR", () => {
  afterEach(() => {
    Settings.now = originalNow;
    Settings.defaultZone = originalDefaultZone;
    vi.restoreAllMocks();
  });

  it("renders the placeholder without SSR warnings", () => {
    const mockedNow = DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 10 },
      { zone: "America/New_York" }
    );

    Settings.now = () => mockedNow.toMillis();
    Settings.defaultZone = "America/New_York";

    vi.spyOn(globalThis, "setTimeout").mockImplementation((() => 0) as typeof setTimeout);
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const html = renderToString(<HoursStatus hours={HoursData} timezone="America/New_York" />);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(html).toContain('class="HoursStatus"');
    expect(html).toContain("min-height:1.5em");
    expect(html).not.toContain("HoursStatus-current");
    expect(html).not.toContain("Open Now");
    expect(html).not.toContain("Closed");
    expect(html).not.toContain("Closes at");
    expect(html).not.toContain("Opens at");
  });
});
