"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useMemberCount } from "@/lib/use-member-count";

export default function QrPage() {
  const [joinUrl, setJoinUrl] = useState("");
  const count = useMemberCount();

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/join`);
  }, []);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <p className="text-xs uppercase tracking-[0.32em] text-gold">Scan to join Vouch</p>
      <div className="mt-8 rounded-3xl bg-paper p-6">
        {joinUrl ? (
          <QRCodeSVG
            value={joinUrl}
            size={280}
            bgColor="#f4efe4"
            fgColor="#0c0b09"
            level="M"
            includeMargin={false}
          />
        ) : (
          <div className="h-[280px] w-[280px]" />
        )}
      </div>
      <p className="mt-6 text-sm text-mute">{joinUrl || "loading…"}</p>
      <p className="mt-10 font-serif text-7xl tabular-nums text-paper">
        {count === null ? "—" : count}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.22em] text-mute">
        {count === 1 ? "builder in" : "builders in"}
      </p>
    </main>
  );
}
