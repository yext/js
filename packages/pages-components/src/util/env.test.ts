// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { isProduction } from "./env.js";

describe("isProduction", () => {
  it("returns true when IS_PRODUCTION is true", async () => {
    const windowSpy = vi.spyOn(window, "window", "get") as unknown as any;
    windowSpy.mockImplementation(() => ({
      IS_PRODUCTION: true,
    }));

    expect(isProduction()).toBeTruthy();

    windowSpy.mockRestore();
  });

  it("returns true when IS_PRODUCTION is true and domains passed", async () => {
    const windowSpy = vi.spyOn(window, "window", "get") as unknown as any;
    windowSpy.mockImplementation(() => ({
      IS_PRODUCTION: true,
    }));

    expect(isProduction("random")).toBeTruthy();

    windowSpy.mockRestore();
  });

  it("returns false when IS_PRODUCTION is false", async () => {
    const windowSpy = vi.spyOn(window, "window", "get") as unknown as any;
    windowSpy.mockImplementation(() => ({
      IS_PRODUCTION: false,
    }));

    expect(isProduction()).toBeFalsy();

    windowSpy.mockRestore();
  });

  it("returns true when IS_PRODUCTION is false and domains contains current hostname", async () => {
    const windowSpy = vi.spyOn(window, "window", "get") as unknown as any;
    const hostName = "thisismyhostname.com";
    windowSpy.mockImplementation(() => ({
      IS_PRODUCTION: false,
      location: {
        hostname: hostName,
      },
    }));

    expect(isProduction(hostName)).toBeTruthy();

    windowSpy.mockRestore();
  });

  it("returns false when IS_PRODUCTION is false and domains doesn't contain current hostname", async () => {
    const windowSpy = vi.spyOn(window, "window", "get") as unknown as any;
    windowSpy.mockImplementation(() => ({
      IS_PRODUCTION: false,
      location: {
        hostname: "thisismyhostname.com",
      },
    }));

    expect(isProduction("anotherhost.com")).toBeFalsy();

    windowSpy.mockRestore();
  });

  it("returns false when IS_PRODUCTION is not defined", async () => {
    expect(isProduction()).toBeFalsy();
  });
});
