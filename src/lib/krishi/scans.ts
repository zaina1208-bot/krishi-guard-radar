import { supabase } from "@/integrations/supabase/client";
import type { Scan } from "./data";

export async function fetchScans(): Promise<Scan[]> {
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) throw error;
  return (data ?? []) as unknown as Scan[];
}

export type NewScan = Omit<Scan, "id" | "created_at">;

export async function insertScan(scan: NewScan): Promise<Scan> {
  const { data, error } = await supabase.from("scans").insert(scan).select().single();
  if (error) throw error;
  return data as unknown as Scan;
}

export const scansQuery = {
  queryKey: ["scans"] as const,
  queryFn: fetchScans,
  refetchInterval: 15000,
};
