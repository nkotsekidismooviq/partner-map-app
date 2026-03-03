"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* -----------------------------
   FIX Leaflet marker icon issue
------------------------------ */

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* -----------------------------
   Types
------------------------------ */

export interface Partner {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface Props {
  partners: Partner[];
  selectedPartner: Partner | null;
}

/* -----------------------------
   Fly to selected partner
------------------------------ */

function FlyToPartner({ partner }: { partner: Partner | null }) {
  const map = useMap();

  useEffect(() => {
    if (partner) {
      map.flyTo([partner.lat, partner.lng], 14, {
        duration: 1.5,
      });
    }
  }, [partner, map]);

  return null;
}

/* -----------------------------
   Main Component
------------------------------ */

export default function PartnerMap({
  partners,
  selectedPartner,
}: Props) {
  return (
    <MapContainer
      center={[39.0742, 21.8243]} // Κέντρο Ελλάδας
      zoom={6}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <FlyToPartner partner={selectedPartner} />

      {partners.map((p) => {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

        return (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <div className="space-y-2">
                <div className="font-semibold">{p.name}</div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Οδηγίες μέσω Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
