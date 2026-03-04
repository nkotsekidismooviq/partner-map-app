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

  /* -----------------------------
     Fetch Partners
  ------------------------------ */

  const fetchPartners = async () => {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
    } else {
      setPartners(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log(
      "SUPABASE URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );

    fetchPartners();

    /* -----------------------------
       Realtime Subscription
    ------------------------------ */

    const channel = supabase
      .channel("partners-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "partners" },
        () => {
          fetchPartners();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-88 bg-white border-r border-gray-200 flex flex-col shadow-sm">
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
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
          {loading && (
            <div className="text-sm text-gray-500 text-center mt-10">
              Φόρτωση συνεργατών...
            </div>
          )}

          {!loading && filteredPartners.length === 0 && (
            <div className="text-sm text-gray-500 text-center mt-10">
              Δεν βρέθηκαν αποτελέσματα
            </div>
          )}

          {!loading &&
            filteredPartners.map((p) => {
              const isActive = selectedPartner?.id === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPartner(p)}
                  className={`p-4 rounded-2xl cursor-pointer border transition
                    ${
                      isActive
                        ? "bg-blue-50 border-blue-500"
                        : "bg-gray-50 border-gray-200 hover:bg-white"
                    }`}
                >
                  <div className="font-medium text-gray-900">
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


