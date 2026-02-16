"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Partner } from "@/components/PartnerMap";

const PartnerMap = dynamic(() => import("@/components/PartnerMap"), {
  ssr: false,
});

export default function DashboardPage() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const partners: Partner[] = [
    { id: 1, name: "Partner Αθήνα", lat: 37.9838, lng: 23.7275 },
    { id: 2, name: "Partner Θεσσαλονίκη", lat: 40.6401, lng: 22.9444 },
    { id: 3, name: "Partner Πάτρα", lat: 38.2466, lng: 21.7346 },
  ];

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-88 bg-white border-r border-gray-200 flex flex-col shadow-sm">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            Συνεργάτες
          </h2>

          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Αναζήτηση συνεργάτη..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 
                         text-sm text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">

          {filteredPartners.length === 0 && (
            <div className="text-sm text-gray-500 text-center mt-10">
              Δεν βρέθηκαν αποτελέσματα
            </div>
          )}

          {filteredPartners.map((p) => {
            const isActive = selectedPartner?.id === p.id;

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPartner(p)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 ease-in-out transform
  ${
    isActive
      ? "bg-blue-50 border-blue-500 shadow-md scale-[1.02]"
      : "bg-gray-50 border-gray-200 hover:bg-white hover:shadow-sm hover:scale-[1.01]"
  }`}

              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-medium">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Ελλάδα
                    </div>
                  </div>

                  {isActive && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Map */}
      <main className="flex-1">
        <PartnerMap
          partners={filteredPartners}
          selectedPartner={selectedPartner}
        />
      </main>
    </div>
  );
}

