'use client';

import Image from 'next/image';
import type { GroupStanding } from '../api/standings/route';

interface Props {
  group: GroupStanding;
}

export default function GroupTable({ group }: Props) {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface-800 overflow-hidden mb-4 animate-fade-in">
      {/* Group header */}
      <div className="px-4 py-2.5 bg-surface-700 border-b border-white/5">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
          {group.name}
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-6">#</th>
              <th className="text-left px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Team</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">P</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">W</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">D</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">L</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">GF</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">GA</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">GD</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-black text-white/60">PTS</th>
            </tr>
          </thead>
          <tbody>
            {group.entries.map((entry, idx) => {
              const isQualified = idx < 2; // top 2 auto qualify
              const isBestThird = idx === 2; // 3rd place might qualify

              return (
                <tr
                  key={entry.team.abbreviation}
                  className={`border-b border-white/5 last:border-0 ${
                    isQualified ? 'bg-green-500/5' : isBestThird ? 'bg-amber-500/5' : ''
                  }`}
                >
                  {/* Rank + qualification bar */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-1 h-5 rounded-full ${
                          isQualified
                            ? 'bg-green-500'
                            : isBestThird
                            ? 'bg-amber-400'
                            : 'bg-transparent'
                        }`}
                      />
                      <span className="text-slate-400 text-xs w-3">{idx + 1}</span>
                    </div>
                  </td>

                  {/* Team */}
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-700 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {entry.team.logo ? (
                          <Image
                            src={entry.team.logo}
                            alt={entry.team.abbreviation}
                            width={24}
                            height={24}
                            className="object-contain p-0.5"
                            unoptimized
                          />
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300">
                            {entry.team.abbreviation.slice(0, 3)}
                          </span>
                        )}
                      </div>
                      <span className={`font-semibold text-sm truncate max-w-[90px] ${isQualified ? 'text-white' : 'text-slate-300'}`}>
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
                  <td className={`text-center px-2 py-2.5 text-xs ${entry.goalDiff > 0 ? 'text-green-400' : entry.goalDiff < 0 ? 'text-red-400' : 'text-slate-400'}`}>
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

      {/* Legend */}
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
    </div>
  );
}
