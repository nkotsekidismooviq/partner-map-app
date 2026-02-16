"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface Partner {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

/* ---------- ICON FIX ---------- */

const defaultIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ---------- MAP CONTROLLER ---------- */

function MapController({
  selectedPartner,
}: {
  selectedPartner: Partner | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPartner) {
      map.flyTo(
        [selectedPartner.lat, selectedPartner.lng],
        9,
        { duration: 1.2 }
      );
    }
  }, [selectedPartner, map]);

  return null;
}

export default function PartnerMap({
  partners,
  selectedPartner,
}: {
  partners: Partner[];
  selectedPartner: Partner | null;
}) {
  const [mounted, setMounted] = useState(false);
  const markerRefs = useRef<Record<number, L.Marker>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto open popup when selected changes
  useEffect(() => {
    if (selectedPartner) {
      const marker = markerRefs.current[selectedPartner.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedPartner]);

  if (!mounted) return null;

  return (
    <MapContainer
      center={[39, 22]}
      zoom={6}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <MapController selectedPartner={selectedPartner} />

      {partners.map((p) => {
        const isSelected = selectedPartner?.id === p.id;

        return (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={isSelected ? selectedIcon : defaultIcon}
            ref={(ref) => {
              if (ref) markerRefs.current[p.id] = ref;
            }}
          >
            <Popup>
              <strong>{p.name}</strong>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}



