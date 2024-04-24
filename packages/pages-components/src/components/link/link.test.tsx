import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Link } from "./link.js";

describe("Link", () => {
  it("renders component when given href + children", () => {
    render(<Link href="https://yext.com">Click Me</Link>);
  });

  it("renders component when given partial cta and children", () => {
    render(<Link cta={{ link: "https://yext.com" }}>Click Me</Link>);
  });

  it("renders component when given full cta prop and no children", () => {
    render(
      <Link
        cta={{ link: "https://yext.com", label: "Click Me", linkType: "URL" }}
      />
    );
  });

  it("renders component when given full cta prop, no children, and just a link", () => {
    render(<Link cta={{ link: "https://yext.com" }} />);
  });
});

vi.mock("../../components/analytics", () => {
  const trackClick = () => {
    return () => {
      throw new Error("Error");
    };
  };
  return {
    useAnalytics: () => {
      return { trackClick };
    },
  };
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
// Check obfuscated label
// Check obfuscated href
// Check children is label if present
// Check fallback to link for label
