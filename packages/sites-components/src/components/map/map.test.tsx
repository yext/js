import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MapboxMaps } from "../../map/providers/mapbox.js";
import { Clusterer, Map, Marker, useMapContext } from "./index.js";

describe("Map", () => {
  it("renders with Google Maps", async () => {
    render(<Map clientKey="gme-yextinc" />);
  });

  it("renders with Mapbox", async () => {
    render(<Map provider={MapboxMaps} apiKey={process.env.MAPBOX_APIKEY} />);
  });

  it("renders with Markers", async () => {
    render(
      <Map clientKey="gme-yextinc">
        <Marker
          id="1"
          coordinate={{ latitude: 38.8974, longitude: -97.0638 }}
        />
      </Map>
    );
  });

  it("userMapContext in map child component", async () => {
    const MapChildComponent = () => {
      const map = useMapContext();
      return <div>{map.getCenter()}</div>;
    };

    render(
      <Map clientKey="gme-yextinc">
        <MapChildComponent />
      </Map>
    );
  });

  it("userMapContext in non map child component", () => {
    vi.spyOn(console, "error");
    // @ts-ignore
    console.error.mockImplementation(() => null);

    const MapSiblingComponent = () => {
      useMapContext();
      return <div />;
    };

    expect(() => render(<MapSiblingComponent />)).toThrow();

    // @ts-ignore
    console.error.mockRestore();
  });

  it("renders with Clusterer", async () => {
    render(
      <Map clientKey="gme-yextinc">
        <Clusterer>
          <Marker
            id="1"
            coordinate={{ latitude: 38.8974, longitude: -97.0638 }}
          />
          <Marker
            id="1"
            coordinate={{ latitude: 38.9974, longitude: -97.1638 }}
          />
        </Clusterer>
      </Map>
    );
  });
});
