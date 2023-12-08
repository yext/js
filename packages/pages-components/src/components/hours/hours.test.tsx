import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hours } from "./index.js";
import { HOURS, HOURS_WITH_REOPEN_DATE } from "./sampleData.js";

describe("Hours", () => {
  beforeAll(() => {
    vi.spyOn(global.Date.prototype, "toISOString").mockReturnValue(
      "6-11-2022 00:00:00"
    );
  });

  it("properly renders a full week", () => {
    render(<Hours hours={HOURS} />);

    expect(screen.getByText("sunday")).toBeTruthy();
    expect(screen.getByText("monday")).toBeTruthy();
    expect(screen.getByText("tuesday")).toBeTruthy();
    expect(screen.getByText("wednesday")).toBeTruthy();
    expect(screen.getByText("thursday")).toBeTruthy();
    expect(screen.getByText("friday")).toBeTruthy();
    expect(screen.getByText("saturday")).toBeTruthy();
  });

  it("properly renders with a custom day label", () => {
    const label = "ice cream sundae";
    render(<Hours hours={HOURS} dayOfWeekNames={{ sunday: label }} />);

    expect(screen.getByText(label)).toBeTruthy();
    expect(screen.queryByText("sunday")).toBeFalsy();
  });

  it("properly renders with collapsed days", () => {
    render(<Hours hours={HOURS_WITH_REOPEN_DATE} collapseDays={true} />);

    expect(screen.getByText("sunday - saturday")).toBeTruthy();
  });
});
