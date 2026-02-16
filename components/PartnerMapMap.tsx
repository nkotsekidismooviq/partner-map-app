"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Partner = {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  website?: string;
  category?: string;
  latitude: number;
  longitude: number;
  notes?: string;
};

export default function PartnerMapMap({ partners }: { partners: Partner[] }) {
  return (
    <MapContainer
      center={[39, 22]} // Κέντρο Ελλάδας
      zoom={6}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {partners.map((p) => (
        <Marker key={p.id} position={[p.latitude, p.longitude]}>
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.category && <span>Κατηγορία: {p.category}<br /></span>}
            {p.phone && <span>Τηλέφωνο: {p.phone}<br /></span>}
            {p.email && <span>Email: {p.email}<br /></span>}
            {p.website && <span>Website: {p.website}</span>}
            {p.notes && <p>{p.notes}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
