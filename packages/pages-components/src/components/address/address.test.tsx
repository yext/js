import { describe, it, expect } from "vitest";
import { Address } from "./address.js";
import { AddressType } from "./types.js";
import { render, screen } from "@testing-library/react";

const address: AddressType = {
  city: "Birmingham",
  countryCode: "US",
  line1: "1716 University Boulevard",
  localizedCountryName: "United States",
  localizedRegionName: "Alabama",
  postalCode: "35294",
  region: "AL",
};

const argentinianAddress: AddressType = {
  city: "Buenos Aires",
  countryCode: "AR",
  line1: "Av. Corrientes 1234",
  localizedCountryName: "Argentina",
  localizedRegionName: "Buenos Aires",
  postalCode: "C1043",
  region: "B",
};

describe("Address", () => {
  it("renders a default US Address", () => {
    render(<Address address={address} />);
  });

  it("includes a cooresponding localized title for all abbreviated values", () => {
    render(<Address address={address} />);

    const abbreviatedCountryEl = screen.getByTitle("United States");
    const abbreviatedRegionEl = screen.getByTitle("Alabama");

    expect(abbreviatedCountryEl && abbreviatedRegionEl).toBeTruthy();
  });

  it("renders with a custom separator", () => {
    const separator = "mySeparator";

    render(<Address address={address} separator={separator} />);

    const separatorEl = screen.getByText(separator);

    expect(separatorEl).toBeTruthy();
  });

  it("renders a custom address format", () => {
    render(<Address address={address} lines={[["line1"]]} />);

    const cityEl = screen.queryByText("Birmingham");
    const regionEl = screen.queryByText("AL");

    expect(cityEl && regionEl).toBeFalsy();
  });

  it("renders custom lines with separators without warnings", () => {
    const originalError = console.error;
    console.error = vi.fn();

    render(
      <Address
        address={address}
        lines={[
          ["line1", ",", "line2"],
          ["city", ",", "region", ",", "postalCode"],
        ]}
      />
    );

    expect(console.error).not.toHaveBeenCalled();

    console.error = originalError;
  });

  it("hides country in default format when showCountry is false", () => {
    render(<Address address={address} showCountry={false} />);

    const countryEl = screen.queryByText("US");

    expect(countryEl).toBeFalsy();
  });

  it("hides region in default format when showRegion is false", () => {
    render(<Address address={address} showRegion={false} />);

    const regionEl = screen.queryByText("AL");

    expect(regionEl).toBeFalsy();
  });

  it("hides both country and region in default format when both are false", () => {
    render(<Address address={address} showCountry={false} showRegion={false} />);

    const countryEl = screen.queryByText("US");
    const regionEl = screen.queryByText("AL");

    expect(countryEl && regionEl).toBeFalsy();
  });

  it("does not apply showCountry/showRegion when custom lines are provided", () => {
    render(<Address address={address} showCountry={false} showRegion={false} lines={[["region"], ["countryCode"]]} />);

    const countryEl = screen.queryByText("US");
    const regionEl = screen.queryByText("AL");

    expect(countryEl && regionEl).toBeTruthy();
  });

  it("does not render a trailing comma in AR default format when showRegion is false", () => {
    render(<Address address={argentinianAddress} showRegion={false} />);

    const separatorEl = screen.queryByText(",");

    expect(separatorEl).toBeFalsy();
  });
});
