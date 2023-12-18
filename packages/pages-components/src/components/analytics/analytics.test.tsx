import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
  Mock,
} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemplateProps } from "./types.js";
import { Link } from "../link/index.js";
import { AnalyticsProvider } from "./provider.js";
import { AnalyticsScopeProvider } from "./scope.js";

vi.mock("../../util/runtime.js", () => {
  const runtime = {
    name: "browser",
    isServerSide: false,
    version:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
  };
  return {
    getRuntime: () => runtime,
  };
});

// The following section of mocks just exists to supress an error that occurs
// because Vitest does not implement a window.location.navigate.  See:
// https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/
// for details.
const oldWindowLocation = global.location;

beforeAll(() => {
  global.process = {
    ...global.process,
    env: {
      NODE_ENV: "development",
    },
  };
  // @ts-ignore
  delete global.location;

  // @ts-ignore
  global.location = Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(oldWindowLocation),
      assign: {
        configurable: true,
        value: vi.fn(),
      },
    }
  );

  // this mock allows us to inspect the fetch requests sent by the analytics
  // package and ensure they are generated correctly.
  global.fetch = vi.fn().mockImplementation(
    vi.fn(() => {
      return Promise.resolve({ status: 200 });
    }) as Mock
  );

  vi.spyOn(global, "fetch");
});

afterAll(() => {
  // restore window location so we don't side effect other tests.
  window.location = oldWindowLocation;

  // @ts-ignore
  delete global.fetch;
  global.process = currentProcess;
});

const baseProps: TemplateProps = {
  document: {
    __: {
      entityPageSet: {},
      name: "foo",
    },
    uid: 0,
    businessId: 0,
    siteId: 0,
  },
};

const currentProcess = global.process;

afterEach(() => {
  // @ts-ignore
  global.fetch.mockClear();
});

describe("Analytics", () => {
  it("should fire a page view once", () => {
    const App = () => {
      return (
        <AnalyticsProvider
          apiKey="key"
          templateData={baseProps}
          requireOptIn={false}
          productionDomains={["localhost"]}
        />
      );
    };
    const { rerender } = render(<App />);
    rerender(<App />);

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should not fire a page view when opt in is required", () => {
    render(
      <AnalyticsProvider
        apiKey="key"
        templateData={baseProps}
        requireOptIn={true}
        productionDomains={["localhost"]}
      />
    );

    expect(global.fetch).toHaveBeenCalledTimes(0);
  });

  it("should track a click", () => {
    render(
      <AnalyticsProvider
        apiKey="key"
        templateData={baseProps}
        requireOptIn={false}
        productionDomains={["localhost"]}
      >
        <Link href="https://yext.com" onClick={(e) => e.preventDefault()}>
          Click Me
        </Link>
      </AnalyticsProvider>
    );

    fireEvent.click(screen.getByRole("link"));
    // @ts-ignore
    const callstack = global.fetch.mock.calls;
    const payload = JSON.parse(callstack[callstack.length - 1][1].body);

    expect(payload.action).toBe("C_link");
    expect(payload.label).toBe("");
    expect(payload.sites.legacyEventName).toBe("link");
  });

  it("should track a click with scoping", async () => {
    const App = () => {
      return (
        <AnalyticsProvider
          apiKey="key"
          templateData={baseProps}
          requireOptIn={false}
          productionDomains={["localhost"]}
        >
          <AnalyticsScopeProvider name="header">
            <AnalyticsScopeProvider name="menu">
              <Link href="https://yext.com">one</Link>
            </AnalyticsScopeProvider>
            <AnalyticsScopeProvider name="drop down">
              <Link cta={{ link: "https://yext.com" }}>two</Link>
            </AnalyticsScopeProvider>
          </AnalyticsScopeProvider>
          <Link href="https://yext.com" eventName="fooclick">
            three
          </Link>
        </AnalyticsProvider>
      );
    };

    const { rerender } = render(<App />);
    rerender(<App />);

    const testClicks: {
      expectedAction: string;
      expectedLabel: string;
      expectedTag: string;
      matcher: RegExp;
    }[] = [
      {
        expectedAction: "C_link",
        expectedLabel: "header_menu",
        expectedTag: "header_menu_link",
        matcher: /one/,
      },
      {
        expectedAction: "CTA_CLICK",
        expectedLabel: "header_dropdown",
        expectedTag: "header_dropdown_cta",
        matcher: /two/,
      },
      {
        expectedAction: "C_fooclick",
        expectedLabel: "",
        expectedTag: "fooclick",
        matcher: /three/,
      },
    ];

    // expect.assertions(testClicks.length);

    // @ts-ignore
    const user = userEvent.setup();

    // @ts-ignore
    const callstack = global.fetch.mock.calls;

    for (const {
      matcher,
      expectedAction,
      expectedLabel,
      expectedTag,
    } of testClicks) {
      await user.click(screen.getByText(matcher));
      const payload = JSON.parse(callstack[callstack.length - 1][1].body);

      expect(payload.action).toBe(expectedAction);
      expect(payload.label).toBe(expectedLabel);
      expect(payload.sites.legacyEventName).toBe(expectedTag);
    }
  });

  it("turns off session tracking", () => {
    render(
      <AnalyticsProvider
        apiKey="key"
        templateData={baseProps}
        requireOptIn={false}
        productionDomains={["localhost"]}
        disableSessionTracking={true}
      >
        <Link href="https://yext.com" onClick={(e) => e.preventDefault()}>
          Click Me
        </Link>
      </AnalyticsProvider>
    );

    fireEvent.click(screen.getByRole("link"));
    // @ts-ignore
    const callstack = global.fetch.mock.calls;
    const payload = JSON.parse(callstack[callstack.length - 1][1].body);

    expect(payload.sessionId).toBeUndefined();
  });
});
