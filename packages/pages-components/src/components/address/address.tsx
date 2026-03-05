import * as React from "react";
import type { AddressLine } from "./types.js";
import { AddressProps, AddressLineProps } from "./types.js";
import { localeAddressFormat } from "./i18n.js";
import { getUnabbreviated } from "./methods.js";
import "./address.css";

const cleanupAddressLine = (line: AddressLine): AddressLine => {
  const trimmed = [...line];

  while (trimmed[0] === ",") {
    trimmed.shift();
  }

  while (trimmed[trimmed.length - 1] === ",") {
    trimmed.pop();
  }

  const cleaned: AddressLine = [];
  for (const token of trimmed) {
    if (token === "," && cleaned[cleaned.length - 1] === ",") {
      continue;
    }
    cleaned.push(token);
  }

  return cleaned;
};

/**
 * Renders an HTML address based from the Yext Knowledge Graph. Example of using the component to render
 * a location entity's address from Yext Knowledge Graph:
 * ```
 * import { Address } from "@yext/pages/components";
 *
 * const address = (<Address address={document.address} />);
 *   --> 1101 Wilson Blvd., Suite 2300,
 *       Arlington, VA, 22201,
 *       US
 * const customAddress = (<Address address={document.address} lines={[['line1', 'city', 'region']]} />);
 *   --> 1101 Wilson Blvd., Arlington, VA
 * const addressWithoutCountryOrRegion = (<Address address={document.address} showCountry={false} showRegion={false} />);
 *   --> 1101 Wilson Blvd., Suite 2300,
 *       Arlington, 22201
 * ```
 *
 * `showCountry` and `showRegion` only apply when using locale-based default formatting (no custom `lines`).
 *
 * @public
 */
export const Address = ({
  address,
  lines,
  separator = ",",
  showCountry = true,
  showRegion = true,
  ...props
}: AddressProps) => {
  const baseLines = lines || localeAddressFormat(address.countryCode);
  const renderedLinesToUse = lines
    ? baseLines
    : baseLines
        .map((line) =>
          line.filter((field) => {
            if (!showCountry && field === "countryCode") {
              return false;
            }
            if (!showRegion && field === "region") {
              return false;
            }
            return true;
          })
        )
        .map(cleanupAddressLine)
        .filter((line) => line.length > 0);

  const renderedLines = renderedLinesToUse.map((line) => (
    <AddressLine key={line.toString()} address={address} line={line} separator={separator} />
  ));

  return (
    <div {...props} key={address.toString()}>
      {renderedLines}
    </div>
  );
};

const AddressLine = ({ address, line, separator }: AddressLineProps): React.ReactElement => {
  const addressDOM: React.ReactElement[] = [];
  let separatorCount = 0;

  for (const field of line) {
    if (field === ",") {
      addressDOM.push(<span key={`separator-${separatorCount++}`}>{separator}</span>);
      continue;
    }

    const value = address[field];
    if (!value) {
      continue;
    }

    // Include unabbreviated title if available
    const unabbreviated = getUnabbreviated(field, address);
    if (unabbreviated) {
      addressDOM.push(
        <React.Fragment key={field}>
          {" "}
          <abbr title={unabbreviated}>{value}</abbr>
        </React.Fragment>
      );
      continue;
    }

    addressDOM.push(<span key={field}>{" " + value}</span>);
  }

  return <div className="address-line">{addressDOM}</div>;
};
