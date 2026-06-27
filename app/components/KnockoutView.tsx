'use client';

import Image from 'next/image';
import type { Match } from '../api/matches/route';

const UAE_TZ = 'Asia/Dubai';

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: UAE_TZ, hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}
function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: UAE_TZ, weekday: 'short', month: 'short', day: 'numeric',
  }).format(new Date(iso));
}

const ROUND_ORDER: Record<string, number> = {
  'round of 32': 1, 'round of 16': 2,
  'quarterfinal': 3, 'quarterfinals': 3, 'quarter-final': 3, 'quarter-finals': 3,
  'semifinal': 4, 'semifinals': 4, 'semi-final': 4, 'semi-finals': 4,
  'third place': 5, 'third-place': 5, '3rd place': 5,
  'final': 6,
};

const ROUND_META: Record<number, { label: string; nextLabel: string; color: string; teams: number }> = {
  1: { label: 'Round of 32',    nextLabel: 'Round of 16',    color: '#6366f1', teams: 32 },
  2: { label: 'Round of 16',    nextLabel: 'Quarter-finals', color: '#8b5cf6', teams: 16 },
  3: { label: 'Quarter-finals', nextLabel: 'Semi-finals',    color: '#f97316', teams: 8  },
  4: { label: 'Semi-finals',    nextLabel: 'Final',          color: '#ef4444', teams: 4  },
  5: { label: 'Third Place',    nextLabel: '',               color: '#78716c', teams: 2  },
  6: { label: 'Final',          nextLabel: '',               color: '#f59e0b', teams: 2  },
};

function getRoundOrder(round: string): number {
  if (!round) return 0;
  const lower = round.toLowerCase();
  for (const [key, val] of Object.entries(ROUND_ORDER)) {
    if (lower.includes(key)) return val;
  }
  return 0;
}

function isTBD(name: string) {
  return !name || name === 'TBD' || name.toLowerCase().includes('winner') || name.toLowerCase().includes('tbd');
}

interface Props { matches: Match[]; isLoading: boolean; }

export default function KnockoutView({ matches, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-surface-800 animate-pulse" />)}
      </div>
    );
  }

  const knockoutMatches = matches.filter(m => getRoundOrder(m.round ?? '') > 0);

  if (knockoutMatches.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-5xl mb-4">🏆</p>
        <p className="text-white font-bold text-lg">Bracket not yet available</p>
        <p className="text-slate-400 text-sm mt-2">Round of 32 begins June 28</p>
      </div>
    );
  }

  const byRound = new Map<number, Match[]>();
  for (const m of knockoutMatches) {
    const o = getRoundOrder(m.round ?? '');
    if (!byRound.has(o)) byRound.set(o, []);
    byRound.get(o)!.push(m);
  }
  for (const [, ms] of byRound) {
    ms.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const sortedRounds = [...byRound.entries()].sort(([a], [b]) => a - b);

  return (
    <div>
      {sortedRounds.map(([order, roundMatches], roundIdx) => {
        const meta = ROUND_META[order] ?? { label: `Round`, nextLabel: '', color: '#64748b', teams: 0 };
        const live = roundMatches.filter(m => m.isLive).length;
        const done = roundMatches.filter(m => m.isCompleted).length;
        const total = roundMatches.length;
        const isLast = roundIdx === sortedRounds.length - 1;

        return (
          <div key={order}>
            {/* Round section */}
            <section className="mb-2 animate-fade-in">
              {/* Round header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-2 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black text-white">{meta.label}</h2>
                    {live > 0 && (
                      <span className="flex items-center gap-1 bg-green-500/15 border border-green-500/30 rounded-full px-2 py-0.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                        <span className="text-[10px] font-bold text-green-400">{live} LIVE</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1 rounded-full bg-surface-700 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${total > 0 ? (done / total) * 100 : 0}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{done}/{total}</span>
                  </div>
                </div>
              </div>

              {/* Matches — shown in pairs to reflect bracket */}
              <div className="flex flex-col gap-2">
                {roundMatches.map((m, idx) => (
                  <div key={m.id}>
                    <KnockoutMatchRow match={m} roundColor={meta.color} />
                    {/* Bracket pair connector: every 2nd match, show "winners meet in next round" */}
                    {meta.nextLabel && idx % 2 === 1 && (
                      <div className="flex items-center gap-2 py-2 pl-4">
                        <div className="flex flex-col items-center gap-0">
                          <div className="w-px h-3 bg-white/10" />
                          <div className="w-2 h-2 rounded-full border border-white/20 bg-surface-800" />
                          <div className="w-px h-3 bg-white/10" />
                        </div>
                        <p className="text-[10px] text-slate-600 italic">
                          Winners meet in {meta.nextLabel}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Arrow connector between rounds */}
            {!isLast && meta.nextLabel && (
              <div className="flex flex-col items-center py-3 mb-2">
                <div className="w-px h-5 bg-white/10" />
                <div className="flex items-center gap-2 bg-surface-700 border border-white/5 rounded-full px-3 py-1">
                  <span className="text-[10px] font-semibold text-slate-400">
                    ↓ {done} winner{done !== 1 ? 's' : ''} advance to {meta.nextLabel}
                  </span>
                </div>
                <div className="w-px h-5 bg-white/10" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function KnockoutMatchRow({ match: m, roundColor }: { match: Match; roundColor: string }) {
  const homeTBD = isTBD(m.home.name);
  const awayTBD = isTBD(m.away.name);
  const isLive = m.isLive;
  const isDone = m.isCompleted;

  return (
    <div
      className={`
        rounded-xl border overflow-hidden transition-all
        ${isLive
          ? 'border-green-500/30 bg-green-500/5 ring-1 ring-green-500/20'
          : 'border-white/5 bg-surface-800'
        }
      `}
    >
      {/* Round note (e.g. "Round of 32 – Match 1") */}
      {m.round && (
        <div className="px-3 pt-2 pb-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: roundColor }}>
            {m.round}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Home */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TeamIcon team={m.home} />
          <span className={`text-sm font-bold truncate ${
            homeTBD ? 'text-slate-600 italic' :
            isDone && m.home.winner ? 'text-white' :
            isDone ? 'text-slate-400' : 'text-slate-100'
          }`}>
            {m.home.shortName}
          </span>
          {isDone && m.home.winner && <span className="text-amber-400 text-xs">✓</span>}
        </div>

        {/* Score / time / vs */}
        <div className="shrink-0 text-center min-w-[72px]">
          {(isDone || isLive) ? (
            <div>
              <div className="flex items-center justify-center gap-2">
                <span className={`text-xl font-black tabular-nums ${isDone && !m.home.winner ? 'text-slate-500' : 'text-white'}`}>
                  {m.home.score ?? '0'}
                </span>
                <span className="text-slate-600 text-sm">–</span>
                <span className={`text-xl font-black tabular-nums ${isDone && !m.away.winner ? 'text-slate-500' : 'text-white'}`}>
                  {m.away.score ?? '0'}
                </span>
              </div>
              {isLive && m.clock && (
                <p className="text-[10px] font-bold text-green-400 mt-0.5">{m.clock}</p>
              )}
              {isDone && <p className="text-[9px] text-slate-600 mt-0.5">FT</p>}
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-amber-400">{fmtTime(m.date)}</p>
              <p className="text-[10px] text-slate-600">{fmtDate(m.date)}</p>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
          {isDone && m.away.winner && <span className="text-amber-400 text-xs">✓</span>}
          <span className={`text-sm font-bold truncate text-right ${
            awayTBD ? 'text-slate-600 italic' :
            isDone && m.away.winner ? 'text-white' :
            isDone ? 'text-slate-400' : 'text-slate-100'
          }`}>
            {m.away.shortName}
          </span>
          <TeamIcon team={m.away} />
        </div>
      </div>

      {/* Venue */}
      {m.venue && (
        <p className="px-3 pb-2 text-[10px] text-slate-600 text-center truncate">
          {[m.venue, m.city].filter(Boolean).join(' · ')}
        </p>
      )}
    </div>
  );
}

function TeamIcon({ team }: { team: Match['home'] }) {
  if (!team.logo) return null;
  return (
    <div className="w-7 h-7 rounded-full bg-surface-700 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
      <Image src={team.logo} alt={team.abbreviation} width={28} height={28}
        className="object-contain p-0.5" unoptimized />
    </div>
  );
}
