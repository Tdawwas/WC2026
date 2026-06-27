'use client';

import Image from 'next/image';
import type { GroupStanding } from '../api/standings/route';
import type { Match } from '../api/matches/route';

const UAE_TZ = 'Asia/Dubai';

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: UAE_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

function fmtShortDate(iso: string) {
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: UAE_TZ,
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

function extractMatchday(round: string): string {
  const m = round.match(/matchday\s*(\d)/i);
  return m ? `Matchday ${m[1]}` : '';
}

interface Props {
  group: GroupStanding;
  matches: Match[];
}

export default function GroupTable({ group, matches }: Props) {
  // Sort matches by date
  const sorted = [...matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group matches by matchday
  const byMatchday = new Map<string, Match[]>();
  for (const m of sorted) {
    const md = extractMatchday(m.round ?? '') || 'Matches';
    if (!byMatchday.has(md)) byMatchday.set(md, []);
    byMatchday.get(md)!.push(m);
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-surface-800 overflow-hidden mb-4 animate-fade-in">
      {/* Group header */}
      <div className="px-4 py-2.5 bg-surface-700 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
          {group.name}
        </h3>
        {group.entries.length > 0 && (
          <span className="text-[10px] text-slate-500">{group.entries.length} teams</span>
        )}
      </div>

      {/* Standings table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[380px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">#</th>
              <th className="text-left px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Team</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">P</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">W</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">D</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">L</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">GF</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">GA</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">GD</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-white/70">PTS</th>
            </tr>
          </thead>
          <tbody>
            {group.entries.map((entry, idx) => {
              const isQualified = idx < 2;
              const isBestThird = idx === 2;
              return (
                <tr
                  key={entry.team.abbreviation}
                  className={`border-b border-white/5 last:border-0 ${
                    isQualified ? 'bg-green-500/5' : isBestThird ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1 h-4 rounded-full ${
                        isQualified ? 'bg-green-500' : isBestThird ? 'bg-amber-400' : 'bg-transparent'
                      }`} />
                      <span className="text-slate-400 text-xs">{idx + 1}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-700 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {entry.team.logo ? (
                          <Image src={entry.team.logo} alt={entry.team.abbreviation}
                            width={24} height={24} className="object-contain p-0.5" unoptimized />
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300">{entry.team.abbreviation.slice(0, 3)}</span>
                        )}
                      </div>
                      <span className={`font-semibold text-xs truncate max-w-[80px] ${isQualified ? 'text-white' : 'text-slate-300'}`}>
                        {entry.team.shortName}
                      </span>
                    </div>
                  </td>
                  <td className="text-center px-2 py-2.5 text-slate-400 text-xs">{entry.gamesPlayed}</td>
                  <td className="text-center px-2 py-2.5 text-slate-400 text-xs">{entry.wins}</td>
                  <td className="text-center px-2 py-2.5 text-slate-400 text-xs">{entry.draws}</td>
                  <td className="text-center px-2 py-2.5 text-slate-400 text-xs">{entry.losses}</td>
                  <td className="text-center px-2 py-2.5 text-slate-400 text-xs">{entry.goalsFor}</td>
                  <td className="text-center px-2 py-2.5 text-slate-400 text-xs">{entry.goalsAgainst}</td>
                  <td className={`text-center px-2 py-2.5 text-xs font-medium ${
                    entry.goalDiff > 0 ? 'text-green-400' : entry.goalDiff < 0 ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {entry.goalDiff > 0 ? `+${entry.goalDiff}` : entry.goalDiff}
                  </td>
                  <td className="text-center px-2 py-2.5">
                    <span className={`font-black text-sm ${isQualified ? 'text-white' : 'text-slate-300'}`}>
                      {entry.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Qualification legend */}
      <div className="px-4 py-2 flex items-center gap-4 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-slate-500">Advance to R32</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[10px] text-slate-500">Possible best 3rd</span>
        </div>
      </div>

      {/* Group matches */}
      {sorted.length > 0 && (
        <div className="border-t border-white/5">
          <div className="px-4 py-2 bg-surface-700/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Matches</p>
          </div>

          {[...byMatchday.entries()].map(([label, mdMatches]) => (
            <div key={label}>
              {/* Matchday sub-header */}
              <div className="px-4 py-1.5 border-t border-white/5">
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">{label}</p>
              </div>

              {mdMatches.map(m => (
                <MatchRow key={m.id} match={m} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchRow({ match: m }: { match: Match }) {
  const isLive = m.isLive;
  const isDone = m.isCompleted;

  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 border-t border-white/5 ${isLive ? 'bg-green-500/5' : ''}`}>
      {/* Date/time */}
      <div className="w-16 shrink-0 text-right">
        {isLive ? (
          <span className="text-[10px] font-bold text-green-400">{m.clock ?? 'LIVE'}</span>
        ) : (
          <>
            <p className="text-[10px] text-slate-500 leading-tight">{fmtShortDate(m.date)}</p>
            <p className="text-[10px] text-slate-600 leading-tight">{fmtTime(m.date)}</p>
          </>
        )}
      </div>

      {/* Home team */}
      <div className="flex items-center gap-1 flex-1 justify-end min-w-0">
        <span className={`text-xs font-semibold truncate ${
          isDone && m.home.winner ? 'text-white' : isDone ? 'text-slate-400' : 'text-slate-200'
        }`}>
          {m.home.shortName}
        </span>
        <TeamBadge team={m.home} />
      </div>

      {/* Score */}
      <div className="shrink-0 w-14 text-center">
        {isDone || isLive ? (
          <span className="text-sm font-black text-white tabular-nums">
            {m.home.score ?? '0'} – {m.away.score ?? '0'}
          </span>
        ) : (
          <span className="text-xs font-bold text-amber-400">vs</span>
        )}
      </div>

      {/* Away team */}
      <div className="flex items-center gap-1 flex-1 justify-start min-w-0">
        <TeamBadge team={m.away} />
        <span className={`text-xs font-semibold truncate ${
          isDone && m.away.winner ? 'text-white' : isDone ? 'text-slate-400' : 'text-slate-200'
        }`}>
          {m.away.shortName}
        </span>
      </div>

      {/* FT / live badge */}
      <div className="w-8 shrink-0 text-center">
        {isDone && <span className="text-[9px] font-bold text-slate-600">FT</span>}
        {isLive && (
          <span className="relative flex h-2 w-2 mx-auto">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        )}
      </div>
    </div>
  );
}

function TeamBadge({ team }: { team: Match['home'] }) {
  if (!team.logo) return null;
  return (
    <div className="w-5 h-5 rounded-full bg-surface-700 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
      <Image src={team.logo} alt={team.abbreviation} width={20} height={20}
        className="object-contain p-0.5" unoptimized />
    </div>
  );
}
