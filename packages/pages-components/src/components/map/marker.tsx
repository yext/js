import React, { useContext, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { MapPin, MapPinOptions } from "../../map/mapPin.js";
import { MapContext } from "./map.js";
import { MapContextType, MarkerProps } from "./types.js";
import { ClustererContext } from "./clusterer.js";
import { HTMLProviderPin } from "../../map/providerPin.js";
import { Coordinate } from "../../map/coordinate.js";

const defaultMarkerIcon = (
  <svg
    width="30"
    height="38"
    viewBox="0 0 30 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 15.0882C30 23.4212 23.3333 30.7353 15 38C7.22222 31.2941 0 23.4212 0 15.0882C0 6.75523 6.71573 0 15 0C23.2843 0 30 6.75523 30 15.0882Z"
      fill="red"
    />
  </svg>
);

export const Marker = ({
  children,
  coordinate,
  hideOffscreen = false,
  id,
  icon = defaultMarkerIcon,
  onClick = () => null,
  onFocus = () => null,
  onHover = () => null,
  zIndex,
  hasPinUrl,
}: MarkerProps): JSX.Element | null => {
  const { map, provider } = useContext(MapContext) as MapContextType;
  const cluster = useContext(ClustererContext);

  const marker: MapPin = useMemo(() => {
    return new MapPinOptions()
      .withCoordinate(coordinate as Coordinate)
      .withHideOffscreen(hideOffscreen)
      .withProvider(provider)
      .withHasPinUrl(hasPinUrl)
      .build();
  }, []);

  // Sync z-index
  useEffect(() => {
    if (zIndex !== 0 && !zIndex) {
      return;
    }
    const wrapper: HTMLElement | null = (marker.getProviderPin() as HTMLProviderPin).getWrapperElement();
    if (wrapper) {
      wrapper.style.zIndex = zIndex.toString();
    }
  }, [zIndex]);

  // Sync events
  useEffect(() => {
    marker.setMap(map);
    marker.setClickHandler(() => onClick(id));
    marker.setFocusHandler((focused: boolean) => onFocus(focused, id));
    marker.setHoverHandler((hovered: boolean) => onHover(hovered, id));

    // Add the pin to the pinStore if it is not a cluster marker.
    const isClusterMarker = cluster?.clusterIds.includes(id);
    if (cluster && !isClusterMarker) {
      cluster.setPinStore((pinStore) => [
        ...pinStore,
        {
          pin: marker,
          id,
        },
      ]);
    }

    return () => {
      marker.setMap(null);

      if (cluster) {
        cluster.setPinStore((pinStore) =>
          pinStore.filter((pin) => pin.id !== id)
        );
      }
    };
  }, []);

  const elementToRender = children ? children : icon;

  if (elementToRender) {
    const pinEl = (marker.getProviderPin() as HTMLProviderPin).getPinElement();
    Object.assign(pinEl.style, {
      height: "auto",
      width: "auto",
    });
    return createPortal(elementToRender, pinEl);
  }

  return null;
};
