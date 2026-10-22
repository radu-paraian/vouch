"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "./supabase";

export function useMemberCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const supabase = getSupabase();

    const refresh = async () => {
      const { count: n, error } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true })
        .eq("consent", true);
      if (!error && typeof n === "number") setCount(n);
    };

    void refresh();

    const channel = supabase
      .channel("members-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members" },
        () => {
          void refresh();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
