'use client';

import type { Match } from '../api/matches/route';
import TeamDisplay from './TeamDisplay';

const UAE_TZ = 'Asia/Dubai';

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: UAE_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

interface Props {
  match: Match;
  highlighted?: boolean;
}

export default function MatchCard({ match, highlighted = false }: Props) {
  const { home, away, isLive, isCompleted, statusDetail, clock, period, venue, city, round, date } = match;

  const periodLabel = period === 1 ? '1st Half' : period === 2 ? '2nd Half' : period === 3 ? 'Extra Time' : period === 4 ? 'Penalties' : '';

  return (
    <div
      className={`
        relative rounded-2xl border transition-all duration-200
        ${highlighted
          ? 'bg-gradient-to-br from-surface-700 via-surface-800 to-surface-900 border-amber-500/40 shadow-lg shadow-amber-500/10'
          : 'bg-surface-800 border-white/5 hover:border-white/15'
        }
        ${isLive ? 'ring-1 ring-green-500/30' : ''}
        p-4
      `}
    >
      {/* Live indicator pulse */}
      {isLive && (
        <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
      )}

      {/* Round / Stage label */}
      {round && (
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/80 mb-2 pr-6">
          {round}
        </p>
      )}

      {/* Match row */}
      <div className="flex items-center gap-3">
        <TeamDisplay team={home} align="left" />

        {/* Score / Time centre */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 min-w-[72px]">
          {(isLive || isCompleted) ? (
            <>
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl font-black tabular-nums ${
                    home.winner ? 'text-white' : isCompleted ? 'text-slate-400' : 'text-white'
                  }`}
                >
                  {home.score ?? '0'}
                </span>
                <span className="text-slate-600 font-bold">–</span>
                <span
                  className={`text-2xl font-black tabular-nums ${
                    away.winner ? 'text-white' : isCompleted ? 'text-slate-400' : 'text-white'
                  }`}
                >
                  {away.score ?? '0'}
                </span>
              </div>
              {isLive && clock && (
                <span className="text-[11px] font-bold text-green-400">
                  {clock} {periodLabel}
                </span>
              )}
              {isCompleted && (
                <span className="text-[10px] text-slate-500">FT</span>
              )}
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-amber-400">{formatTime(date)}</span>
              <span className="text-[10px] text-slate-500">UAE</span>
            </>
          )}
        </div>

        <TeamDisplay team={away} align="right" />
      </div>

      {/* Venue */}
      {(venue || city) && (
        <p className="mt-2.5 text-[11px] text-slate-500 text-center truncate">
          {[venue, city].filter(Boolean).join(' · ')}
        </p>
      )}

      {/* Status detail for non-live, non-completed */}
      {!isLive && !isCompleted && statusDetail && statusDetail !== '' && (
        <p className="mt-1 text-[10px] text-slate-600 text-center">{statusDetail}</p>
      )}
    </div>
  );
}
