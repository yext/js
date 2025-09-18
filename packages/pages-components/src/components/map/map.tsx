import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import { GoogleMaps } from "../../map/providers/google.js";
import { Map as MapType, MapOptions } from "../../map/map.js";
import { GeoBounds } from "../../map/geoBounds.js";
import { Coordinate } from "../../map/coordinate.js";
import type { MapProps, MapContextType } from "./types.js";
import { MapProvider } from "../../map/mapProvider.js";

export const MapContext = createContext<MapContextType | null>(null);

export function useMapContext() {
  const ctx = useContext(MapContext);

  if (!ctx || ctx.map === undefined) {
    throw new Error("Attempted to call useMapContext() outside of <Map>.");
  }

  return ctx.map;
}

export const Map = ({
  apiKey,
  bounds,
  children,
  className,
  clientKey,
  controls = true,
  defaultCenter = { latitude: 39.83, longitude: -98.58 },
  defaultZoom = 4,
  mapRef,
  padding = { bottom: 50, left: 50, right: 50, top: 50 },
  panHandler = () => null,
  panStartHandler = () => null,
  provider = GoogleMaps,
  providerOptions = {},
  singleZoom = 14,
}: MapProps) => {
  const wrapper = useRef(null);

  const [center, setCenter] = useState(new Coordinate(defaultCenter));
  const [loaded, setLoaded] = useState(false);
  const [map, setMap] = useState<MapType>();
  const [zoom, setZoom] = useState(defaultZoom);

  // Update center on map move
  const _panHandler = (previous?: GeoBounds, current?: GeoBounds) => {
    panHandler(previous, current);
    if (current) {
      setCenter(current.getCenter());
    }
  };

  // On map move
  useEffect(() => {
    if (!loaded || !map) {
      return;
    }

    setZoom(map.getZoom());
  }, [center]);

  // On bounds change / init
  useEffect(() => {
    if (!bounds || !loaded || !map) {
      return;
    }

    const coordinates = bounds.map((bound) => new Coordinate(bound));
    map.fitCoordinates(coordinates);
  }, [JSON.stringify(bounds), map]);

  // On map provider load
  useEffect(() => {
    if (!loaded || map) {
      return;
    }

    const iframeWindow = typeof document !== "undefined"
        ? (document.getElementById("preview-frame") as HTMLIFrameElement).contentWindow ?? undefined
        : undefined
    const mapboxInstance = (iframeWindow as Window & { mapboxgl?: typeof mapboxgl })?.mapboxgl ?? mapboxgl;
    mapboxInstance.accessToken = apiKey ?? "";

    const newMap = new MapOptions()
      .withControlEnabled(controls)
      .withDefaultCenter(center)
      .withDefaultZoom(zoom)
      .withPadding(padding)
      .withPanHandler(_panHandler)
      .withPanStartHandler(panStartHandler)
      .withProvider(provider)
      .withProviderOptions(providerOptions)
      .withSinglePinZoom(singleZoom)
      .withWrapper(wrapper.current)
      .withInstance(mapboxInstance)
      .build();

    setMap(newMap);

    if (mapRef) {
      mapRef.current = newMap;
    }
  }, [loaded]);

  // On mount
  useEffect(() => {
    if (loaded || map || !wrapper.current) {
      return;
    }

    if (provider instanceof MapProvider) {
      provider
        .load(apiKey, {
          ...providerOptions,
          ...(clientKey && { client: clientKey }),
        })
        .then(() => setLoaded(true));
    }
  }, []);

  return (
    <div
      className={classnames(
        {
          "is-loaded": loaded,
        },
        className
      )}
      id="map"
      ref={wrapper}
      data-testid="map"
    >
      {map && (
        <MapContext.Provider value={{ map, provider }}>
          {children}
        </MapContext.Provider>
      )}
    </div>
  );
};
