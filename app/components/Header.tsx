'use client';

interface Props {
  liveCount: number;
  updatedAt?: string;
}

const UAE_TZ = 'Asia/Dubai';

function uaeTime(iso?: string) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: UAE_TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

export default function Header({ liveCount, updatedAt }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-surface-900/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-lg shadow-lg">
            ⚽
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-tight">WC 2026 Live</h1>
            <p className="text-[10px] text-slate-500 leading-tight">FIFA World Cup · UAE Time</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {liveCount > 0 && (
            <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 rounded-full px-2.5 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-bold text-green-400">
                {liveCount} LIVE
              </span>
            </div>
          )}
          {updatedAt && (
            <p className="text-[10px] text-slate-600 hidden sm:block">
              Updated {uaeTime(updatedAt)}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
