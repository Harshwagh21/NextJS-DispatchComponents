"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
    center: [number, number];
    tileUrl: string;
    attribution: string;
}

function MapFlyTo({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        console.log('MapFlyTo called with center:', center);
        if (center && Array.isArray(center)) {
            map.flyTo(center, map.getZoom(), { duration: 1.2 });
        }
    }, [center, map]);
    return null;
}

export default function MapComponent({ center, tileUrl, attribution }: MapComponentProps) {
    const [mountKey, setMountKey] = useState<string | null>(null);
    useEffect(() => {
        // Force a fresh container per mount (helps with Strict Mode double-mount in dev)
        setMountKey(`${Date.now()}-${Math.random()}`);
    }, []);

    if (!mountKey) return null;
    type LooseMapProps = {
        center?: [number, number];
        zoom?: number;
        style?: React.CSSProperties;
        zoomControl?: boolean;
        children?: React.ReactNode;
    };
    const AnyMapContainer = MapContainer as unknown as React.ComponentType<LooseMapProps>;
    return (
        <AnyMapContainer
            key={`${mountKey}-${tileUrl}`}
            center={center}
            zoom={12}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
            zoomControl={false}
        >
            <TileLayer
                url={tileUrl}
                // @ts-expect-error react-leaflet types may not expose attribution prop in v4
                attribution={attribution}
            />
            <MapFlyTo center={center} />
        </AnyMapContainer>
    );
}

