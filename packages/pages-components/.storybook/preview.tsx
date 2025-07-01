import type { Preview } from "@storybook/react";
import { runOnly } from "./wcagConfig.ts";
import { DateTime, Settings } from "luxon";
import { useEffect, useRef } from "react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    mockedLuxonDateTime: undefined as DateTime | undefined, // Type hint for the parameter
    a11y: {
      options: {
        runOnly,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Store the real DateTime
      const originalLuxonSettings = useRef(Settings);

      const mockedLuxonDateTimeFromParams = context.parameters
        .mockedLuxonDateTime as DateTime | undefined;

      const overrideDateTime = () => {
        if (mockedLuxonDateTimeFromParams) {
          Settings.now = () => mockedLuxonDateTimeFromParams.toMillis();
          Settings.defaultZone = "America/New_York";
        } else {
          Settings.now = originalLuxonSettings.current.now;
        }
      };

      const cleanupDateTime = () => {
        Settings.now = originalLuxonSettings.current.now;
        Settings.defaultZone = originalLuxonSettings.current.defaultZone;
      };

      useEffect(() => {
        // When the component mounts, re-mock the DateTime if a date is provided
        overrideDateTime();
        // When the component unmounts, restore the real DateTime
        return cleanupDateTime;
      }, [mockedLuxonDateTimeFromParams]);

      // Mock the DateTime if a date is provided for initial render
      overrideDateTime();
      const component = <Story />;
      cleanupDateTime();

      return component;
    },
  ],
};

export default preview;
