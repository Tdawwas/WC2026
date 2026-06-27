'use client';

import type { Match } from '../api/matches/route';
import MatchCard from './MatchCard';

// Round display order for WC2026
const ROUND_ORDER: Record<string, number> = {
  'round of 32': 1,
  'round of 16': 2,
  'quarterfinal': 3,
  'quarterfinals': 3,
  'quarter-final': 3,
  'quarter-finals': 3,
  'semifinal': 4,
  'semifinals': 4,
  'semi-final': 4,
  'semi-finals': 4,
  'third place': 5,
  'third-place playoff': 5,
  'third place playoff': 5,
  '3rd place': 5,
  'final': 6,
};

const ROUND_LABELS: Record<number, { label: string; emoji: string }> = {
  1: { label: 'Round of 32', emoji: '🔵' },
  2: { label: 'Round of 16', emoji: '🟣' },
  3: { label: 'Quarter-finals', emoji: '🟠' },
  4: { label: 'Semi-finals', emoji: '🔴' },
  5: { label: 'Third Place', emoji: '🥉' },
  6: { label: 'Final', emoji: '🏆' },
};

function getRoundOrder(roundStr: string): number {
  if (!roundStr) return 0;
  const lower = roundStr.toLowerCase();
  for (const [key, val] of Object.entries(ROUND_ORDER)) {
    if (lower.includes(key)) return val;
  }
  return 0;
}

interface Props {
  matches: Match[];
  isLoading: boolean;
}

export default function KnockoutView({ matches, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 rounded-2xl bg-surface-800 animate-pulse" />
        ))}
      </div>
    );
  }

  // Filter to knockout matches only (non-group stage)
  const knockoutMatches = matches.filter(m => {
    const order = getRoundOrder(m.round ?? '');
    return order > 0;
  });

  if (knockoutMatches.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-4xl mb-4">🏟️</p>
        <p className="text-white font-bold">Knockout stage hasn't started yet</p>
        <p className="text-slate-400 text-sm mt-2">
          Round of 32 begins June 28 — check back soon
        </p>
      </div>
    );
  }

  // Group by round order
  const byRound = new Map<number, Match[]>();
  for (const m of knockoutMatches) {
    const order = getRoundOrder(m.round ?? '');
    if (!byRound.has(order)) byRound.set(order, []);
    byRound.get(order)!.push(m);
  }

  const sortedRounds = [...byRound.entries()].sort(([a], [b]) => a - b);

  return (
    <div>
      {sortedRounds.map(([order, roundMatches]) => {
        const meta = ROUND_LABELS[order] ?? { label: `Round ${order}`, emoji: '⚽' };
        const liveInRound = roundMatches.filter(m => m.isLive).length;
        const completedInRound = roundMatches.filter(m => m.isCompleted).length;
        const total = roundMatches.length;

        return (
          <section key={order} className="mb-7 animate-fade-in">
            {/* Round header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{meta.emoji}</span>
              <h2 className="text-sm font-bold text-white">{meta.label}</h2>
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] text-slate-500">
                {completedInRound}/{total} played
                {liveInRound > 0 && (
                  <span className="ml-1.5 text-green-400 font-bold">• {liveInRound} LIVE</span>
                )}
              </span>
            </div>

            {/* Progress bar */}
            {total > 0 && (
              <div className="h-1 rounded-full bg-surface-700 mb-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                  style={{ width: `${(completedInRound / total) * 100}%` }}
                />
              </div>
            )}

            <div className="flex flex-col gap-3">
              {roundMatches.map(m => (
                <MatchCard key={m.id} match={m} highlighted={m.isLive} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
