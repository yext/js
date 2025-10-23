import type {
  Map as MapType,
  PaddingFunction,
  PanHandler,
  PanStartHandler,
} from "../../map/map.js";
import type { MapProvider } from "../../map/mapProvider.js";
import type { MapPin } from "../../map/mapPin.js";
import React from "react";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface MapContextType {
  map: MapType;
  provider: MapProvider;
}

export interface MapProps {
  apiKey?: string;
  bounds?: Coordinate[];
  className?: string;
  clientKey?: string;
  children?: any;
  controls?: boolean;
  defaultCenter?: Coordinate;
  defaultZoom?: number;
  mapRef?: React.MutableRefObject<MapType | null>;
  padding?: {
    bottom: number | PaddingFunction;
    left: number | PaddingFunction;
    right: number | PaddingFunction;
    top: number | PaddingFunction;
  };
  panHandler?: PanHandler;
  panStartHandler?: PanStartHandler;
  provider?: MapProvider;
  providerOptions?: { [key: string]: any };
  singleZoom?: number;
  iframeId?: string;
}

// Marker

export interface MarkerProps {
  children?: React.ReactElement;
  coordinate: Coordinate;
  hideOffscreen?: boolean;
  icon?: React.ReactElement;
  id: string;
  onClick?: (id: string) => void;
  onHover?: (hovered: boolean, id: string) => void;
  onFocus?: (focused: boolean, id: string) => void;
  statusOptions?: { [key: string]: boolean };
  zIndex?: number;
  hasPinUrl?: boolean;
}

// Clusterer

export type ClusterTemplateProps = {
  count?: number;
};

export type ClustererProps = {
  clusterRadius?: number;
  children: React.ReactElement[] | React.ReactElement;
  ClusterTemplate?: (props: ClusterTemplateProps) => React.ReactElement;
};

export type PinStoreType = {
  id: string;
  pin: MapPin;
};

export interface ClustererContextType {
  clusters: PinStoreType[][];
  clusterIds: string[];
  setPinStore: React.Dispatch<React.SetStateAction<PinStoreType[]>>;
}
