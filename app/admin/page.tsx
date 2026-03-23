"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function extractCoords(url: string) {
    try {
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = url.match(regex);

      if (!match) return null;

      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
      };
    } catch {
      return null;
    }
  }

  async function addPartner() {
    setLoading(true);
    setMessage("");

    const coords = extractCoords(mapsLink);

    if (!coords) {
      setMessage("❌ Δεν βρέθηκαν συντεταγμένες στο link");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("partners").insert([
      {
        name: name,
        lat: coords.lat,
        lng: coords.lng,
        google_maps_link: mapsLink,
      },
    ]);

    if (error) {
      setMessage("❌ Σφάλμα αποθήκευσης");
    } else {
      setMessage("✅ Partner προστέθηκε!");
      setName("");
      setMapsLink("");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Όνομα συνεργάτη"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Google Maps link"
          value={mapsLink}
          onChange={(e) => setMapsLink(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button
          onClick={addPartner}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Προσθήκη Partner
        </button>

        {message && (
          <div className="text-sm">{message}</div>
        )}

      </div>
    </div>
  );
}

