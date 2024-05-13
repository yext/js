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
import { Action } from "@yext/analytics";

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

beforeAll(() => {
  global.process = {
    ...global.process,
    env: {
      NODE_ENV: "development",
    },
  };

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
          currency="USD"
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
        currency="USD"
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
        currency="USD"
        templateData={baseProps}
        requireOptIn={false}
        productionDomains={["localhost"]}
      >
        <Link href="#">Click Me</Link>
      </AnalyticsProvider>
    );

    fireEvent.click(screen.getByRole("link"));
    // @ts-ignore
    const callstack = global.fetch.mock.calls;
    const payload = JSON.parse(callstack[callstack.length - 1][1].body);

    expect(payload.action).toBe("LINK");
    expect(payload.pages.scope).toBe(undefined);
    expect(payload.pages.originalEventName).toBe("link");
  });

  it("should track a click with scoping", async () => {
    const App = () => {
      return (
        <AnalyticsProvider
          apiKey="key"
          currency="USD"
          templateData={baseProps}
          requireOptIn={false}
          productionDomains={["localhost"]}
        >
          <AnalyticsScopeProvider name="header">
            <AnalyticsScopeProvider name="menu">
              <Link href="#">one</Link>
            </AnalyticsScopeProvider>
            <AnalyticsScopeProvider name="drop down">
              <Link cta={{ link: "#" }}>two</Link>
            </AnalyticsScopeProvider>
          </AnalyticsScopeProvider>
          <Link href="#" eventName="fooclick">
            three
          </Link>
        </AnalyticsProvider>
      );
    };

    const { rerender } = render(<App />);
    rerender(<App />);

    const testClicks: {
      expectedAction: Action;
      expectedScope: string | undefined;
      expectedOriginalEventName: string;
      matcher: RegExp;
    }[] = [
      {
        expectedAction: "LINK",
        expectedScope: "header_menu",
        expectedOriginalEventName: "header_menu_link",
        matcher: /one/,
      },
      {
        expectedAction: "CTA_CLICK",
        expectedScope: "header_dropdown",
        expectedOriginalEventName: "header_dropdown_cta",
        matcher: /two/,
      },
      {
        expectedAction: "LINK",
        expectedScope: undefined,
        expectedOriginalEventName: "fooclick",
        matcher: /three/,
      },
    ];

    // @ts-ignore
    const user = userEvent.setup();

    // @ts-ignore
    const callstack = global.fetch.mock.calls;

    for (const {
      matcher,
      expectedAction,
      expectedScope,
      expectedOriginalEventName,
    } of testClicks) {
      await user.click(screen.getByText(matcher));
      const payload = JSON.parse(callstack[callstack.length - 1][1].body);

      expect(payload.action).toBe(expectedAction);
      expect(payload.pages.scope).toBe(expectedScope);
      expect(payload.pages.originalEventName).toBe(expectedOriginalEventName);
    }
  });

  it("turns off session tracking", () => {
    render(
      <AnalyticsProvider
        apiKey="key"
        currency="USD"
        templateData={baseProps}
        requireOptIn={false}
        productionDomains={["localhost"]}
        disableSessionTracking={true}
      >
        <Link href="#" onClick={(e) => e.preventDefault()}>
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

  it("overrides AnalyticsScopeProvider", () => {
    render(
      <AnalyticsProvider
        apiKey="key"
        currency="USD"
        templateData={baseProps}
        requireOptIn={false}
        productionDomains={["localhost"]}
      >
        <AnalyticsScopeProvider name="header">
          <AnalyticsScopeProvider name="menu">
            <Link href="#" scope="custom scope">
              one
            </Link>
          </AnalyticsScopeProvider>
        </AnalyticsScopeProvider>
      </AnalyticsProvider>
    );

    fireEvent.click(screen.getByRole("link"));
    // @ts-ignore
    const callstack = global.fetch.mock.calls;
    const payload = JSON.parse(callstack[callstack.length - 1][1].body);

    expect(payload.action).toBe("LINK");
    expect(payload.pages.scope).toBe("customscope");
    expect(payload.pages.originalEventName).toBe("customscope_link");
  });
});
