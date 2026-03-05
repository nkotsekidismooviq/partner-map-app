"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addPartner = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("partners").insert([
      {
        name: name,
        address: address,
        phone: phone,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        maps_url: mapsUrl
      }
    ]);

    if (error) {
      setMessage("Σφάλμα: " + error.message);
    } else {
      setMessage("Ο συνεργάτης προστέθηκε!");
      setName("");
      setAddress("");
      setPhone("");
      setLat("");
      setLng("");
      setMapsUrl("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[420px]">

        <h1 className="text-2xl font-semibold mb-6">
          Προσθήκη Συνεργάτη
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Όνομα συνεργάτη"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Διεύθυνση"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Τηλέφωνο"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Google Maps link"
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            onClick={addPartner}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Προσθήκη..." : "Προσθήκη συνεργάτη"}
          </button>

          {message && (
            <div className="text-sm text-center mt-2">
              {message}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
