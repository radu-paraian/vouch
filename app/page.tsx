import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-gold">Vouch</p>
      <h1 className="mt-6 max-w-xl font-serif text-5xl leading-tight text-paper">
        One shared memory of London builders.
      </h1>
      <p className="mt-4 max-w-md text-mute">
        Dashboard tabs land next. Join now — it takes 30 seconds.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/join"
          className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform active:scale-[0.97]"
        >
          Join Vouch
        </Link>
        <Link
          href="/qr"
          className="rounded-full border border-line px-6 py-3 text-sm text-paper transition-transform active:scale-[0.97]"
        >
          Screen QR
        </Link>
      </div>
    </main>
  );
}
