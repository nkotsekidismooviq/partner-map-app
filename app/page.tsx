"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import { Partner } from "@/components/PartnerMap";

const PartnerMap = dynamic(() => import("@/components/PartnerMap"), {
  ssr: false,
});

export default function DashboardPage() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch partners
  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setPartners(data || []);
      }

      setLoading(false);
    };

    fetchPartners();
  }, []);

  // 🔄 KEEP ALIVE (πολύ σημαντικό)
  useEffect(() => {
    const interval = setInterval(async () => {
      await supabase.from("partners").select("id").limit(1);
      console.log("🔄 Supabase keep-alive ping");
    }, 5 * 60 * 1000); // κάθε 5 λεπτά

    return () => clearInterval(interval);
  }, []);

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Συνεργάτες
          </h2>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Αναζήτηση συνεργάτη..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                         text-sm text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">

          {loading && (
            <div className="text-sm text-gray-500 text-center">
              Φόρτωση...
            </div>
          )}

          {!loading && filteredPartners.length === 0 && (
            <div className="text-sm text-gray-500 text-center">
              Δεν βρέθηκαν αποτελέσματα
            </div>
          )}

          {filteredPartners.map((p) => {
            const isActive = selectedPartner?.id === p.id;

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPartner(p)}
                className={`p-4 rounded-xl cursor-pointer border transition
                ${
                  isActive
                    ? "bg-blue-50 border-blue-500"
                    : "bg-gray-50 border-gray-200 hover:bg-white"
                }`}
              >
                <div className="text-gray-900 font-medium">
                  {p.name}
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
