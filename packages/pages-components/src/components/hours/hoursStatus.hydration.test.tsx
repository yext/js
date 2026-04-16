import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { act } from "react-dom/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { DateTime, Settings } from "luxon";
import { HoursStatus } from "./hoursStatus.js";
import { HoursData } from "./hoursSampleData.js";

const originalNow = Settings.now;
const originalDefaultZone = Settings.defaultZone;
const originalActEnvironment = (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT;

describe("HoursStatus hydration", () => {
  afterEach(async () => {
    Settings.now = originalNow;
    Settings.defaultZone = originalDefaultZone;
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
      originalActEnvironment;
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("hydrates from the placeholder to the current status without warnings", async () => {
    const mockedNow = DateTime.fromObject(
      { year: 2025, month: 1, day: 7, hour: 10 },
      { zone: "America/New_York" }
    );

    Settings.now = () => mockedNow.toMillis();
    Settings.defaultZone = "America/New_York";
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

    vi.spyOn(globalThis, "setTimeout").mockImplementation((() => 0) as typeof setTimeout);
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const container = document.createElement("div");
    container.innerHTML = renderToString(
      <div style={{ minHeight: "1.5em" }} className="HoursStatus" />
    );
    document.body.appendChild(container);

    expect(container.textContent).toBe("");

    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, <HoursStatus hours={HoursData} timezone="America/New_York" />);
      await Promise.resolve();
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(container.textContent).toContain("Open Now");
    expect(container.textContent).toContain("Closes at");
    expect(container.textContent).toContain("6:02 PM");
    expect(container.textContent).toContain("Tuesday");

    await act(async () => {
      root?.unmount();
    });
  });
});
