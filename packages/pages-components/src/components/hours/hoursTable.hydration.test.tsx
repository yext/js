import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { act } from "react-dom/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { DateTime, Settings } from "luxon";
import { HoursTable, ServerSideHoursTable } from "./hoursTable.js";
import { HoursData } from "./hoursSampleData.js";

const originalNow = Settings.now;
const originalDefaultZone = Settings.defaultZone;
const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
const originalActEnvironment = (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT;

describe("HoursTable hydration", () => {
  afterEach(() => {
    Settings.now = originalNow;
    Settings.defaultZone = originalDefaultZone;
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
      originalActEnvironment;
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("hydrates from the server-safe table to the client-aware table without warnings", async () => {
    const mockedNow = DateTime.fromObject(
      { year: 2025, month: 1, day: 9, hour: 12 },
      { zone: "America/New_York" }
    );

    Settings.now = () => mockedNow.toMillis();
    Settings.defaultZone = "America/New_York";
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

    vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockImplementation(
      function (this: Intl.DateTimeFormat) {
        return {
          ...originalResolvedOptions.call(this),
          timeZone: "America/New_York",
        };
      }
    );

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const serverHtml = renderToString(
      <ServerSideHoursTable hours={HoursData} startOfWeek="today" />
    );
    const container = document.createElement("div");
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    const getDayLabels = () =>
      Array.from(container.querySelectorAll(".HoursTable-day"), (element) => element.textContent);

    expect(getDayLabels()[0]).toBe("Sunday");
    expect(container.querySelector(".HoursTable-row.is-today")).toBeNull();

    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, <HoursTable hours={HoursData} startOfWeek="today" />);
      await Promise.resolve();
    });

    const todayRow = container.querySelector(".HoursTable-row.is-today");

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(getDayLabels()[0]).toBe("Thursday");
    expect(todayRow?.querySelector(".HoursTable-day")?.textContent).toBe("Thursday");
    expect(todayRow?.querySelector(".HoursTable-intervals")?.textContent).toContain(
      "9:04 AM - 6:04 PM"
    );

    await act(async () => {
      root?.unmount();
    });
  });
});
