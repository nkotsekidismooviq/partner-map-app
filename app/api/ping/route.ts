import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    await supabase.from("partners").select("id").limit(1);

    return new Response(
      JSON.stringify({ status: "ok" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "ping failed" }),
      { status: 500 }
    );
  }
}
