import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hours } from "./index.js";
import { HOURS } from "./sampleData.js";

describe("Hours", () => {
  beforeAll(() => {
    vi.spyOn(global.Date.prototype, "toISOString").mockReturnValue(
      "6-11-2022 00:00:00"
    );
  });

  it("properly renders a full week", () => {
    render(<Hours hours={HOURS} />);

    expect(screen.getByText("Sunday")).toBeTruthy();
    expect(screen.getByText("Monday")).toBeTruthy();
    expect(screen.getByText("Tuesday")).toBeTruthy();
    expect(screen.getByText("Wednesday")).toBeTruthy();
    expect(screen.getByText("Thursday")).toBeTruthy();
    expect(screen.getByText("Friday")).toBeTruthy();
    expect(screen.getByText("Saturday")).toBeTruthy();
  });

  it("properly renders with a custom day label", () => {
    const label = "ice cream sundae";
    render(<Hours hours={HOURS} dayOfWeekNames={{ Sunday: label }} />);

    expect(screen.getByText(label)).toBeTruthy();
    expect(screen.queryByText("Sunday")).toBeFalsy();
  });
});
