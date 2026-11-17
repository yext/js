import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Link } from "./link.js";
import { CTA } from "./types.js";
import type { AnalyticsMethods } from "../analytics/interfaces.js";

const track = vi.hoisted(() =>
  vi.fn<AnalyticsMethods["track"]>(() => {
    throw new Error("Error");
  })
);

describe("Link", () => {
  it("renders component when given href + children", () => {
    render(<Link href="https://yext.com">Click Me</Link>);
  });

  it("renders component when given partial cta and children", () => {
    render(<Link cta={{ link: "https://yext.com" }}>Click Me</Link>);
  });

  it("renders component when given full cta prop and no children", () => {
    render(<Link cta={{ link: "https://yext.com", label: "Click Me", linkType: "URL" }} />);
  });

  it("renders component when given full cta prop, no children, and just a link", () => {
    render(<Link cta={{ link: "https://yext.com" }} />);
  });

  it("throws an error when cta link is not set", () => {
    expect(() => render(<Link cta={{} as CTA} />)).toThrowError();
  });

  it("renders with obfuscated email when using cta link", () => {
    render(<Link cta={{ link: "mailto:test.com" }} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toEqual("bWFpbHRvOnRlc3QuY29t");
  });

  it("renders with obfuscated email when using href", () => {
    render(<Link href="mailto:test.com" />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toEqual("bWFpbHRvOnRlc3QuY29t");
  });
});

vi.mock("../../components/analytics", () => {
  return {
    useAnalytics: () => {
      return {
        track,
        getDebugEnabled: () => {
          return false;
        },
      };
    },
  };
});

describe("Obfuscated Link clicks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ["an ordinary email", "mailto:test.com"],
    ["an email with a slash in its Base64 encoding", "mailto:test@example.com?subject=Hello"],
  ])("navigates to and tracks the complete destination for %s", async (_, href) => {
    const location = { href: "https://example.com/contact" };
    const testWindow = Object.create(window, { location: { value: location } });
    vi.spyOn(window, "window", "get").mockReturnValue(testWindow);
    track.mockResolvedValueOnce(undefined);
    const onClick = vi.fn();

    render(<Link href={href} onClick={onClick} />);
    const link = screen.getByRole("link");

    await act(async () => link.click());

    expect(location.href).toEqual(href);
    expect(track).toHaveBeenLastCalledWith(expect.objectContaining({ destinationUrl: href }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].defaultPrevented).toBe(true);
  });
});

describe("Link Component Handles Analytics Failures", () => {
  it("registers console.error", () => {
    const errorMock = vi.spyOn(console, "error").mockImplementation(() => null);

    render(<Link cta={{ link: "https://yext.com" }} />);
    const link = screen.getByRole("link");

    act(() => link.click());
    expect(errorMock).toBeCalledTimes(1);
    expect(errorMock).toBeCalledWith("Failed to report click Analytics Event");
  });

  it("still invokes onClick", () => {
    const onClick = vi.fn();
    render(<Link cta={{ link: "https://yext.com" }} onClick={onClick} />);
    const link = screen.getByRole("link");

    act(() => link.click());
    expect(onClick).toHaveBeenCalled();
  });
});

// TODO: Add tests
// Check target="_blank" present on newTab
// Check children is label if present
// Check fallback to link for label
