import React from "react";
import { LocationMapProps } from "./types.js";
import { Map } from "../map/map.js";
import { Marker } from "../map/marker.js";
import { Link } from "../link/link.js";

export const LocationMap = ({
  children,
  coordinate,
  linkSameTab,
  pinUrl,
  onClick = () => null,
  onHover = () => null,
  onFocus = () => null,
  ...mapProps
}: LocationMapProps) => {
  return (
    <Map bounds={[coordinate]} {...mapProps}>
      <Marker
        coordinate={coordinate}
        id="location-map-marker"
        onClick={onClick}
        onHover={onHover}
        onFocus={onFocus}
        hasPinUrl={(pinUrl || "")?.length > 0}
      >
        {pinUrl ? (
          <Link
            href={pinUrl}
            target={linkSameTab ? "_self" : "_blank"}
            aria-label="map-marker"
          >
            {children}
          </Link>
        ) : children ? (
          children
        ) : undefined}
      </Marker>
    </Map>
  );
};
