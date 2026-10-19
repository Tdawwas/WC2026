'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { GroupStanding, StandingEntry } from '../api/standings/route';
import type { Match } from '../api/matches/route';
import MatchCard from './MatchCard';

interface TeamInfo {
  name: string;
  shortName: string;
  abbreviation: string;
  logo?: string;
  group?: string;
  standing?: StandingEntry;
}

interface Props {
  groups: GroupStanding[];
  scheduleMatches: Match[];
  isLoading: boolean;
}

function extractGroupLetter(round: string): string | null {
  const m = round.match(/Group\s+([A-La-l])\b/i);
  return m ? m[1].toUpperCase() : null;
}

function isPlaceholder(abbr: string, name: string) {
  return abbr === '???' || name === 'TBD';
}

// Teams come from standings; the schedule fills in anyone standings lack.
function collectTeams(groups: GroupStanding[], matches: Match[]): TeamInfo[] {
  const byAbbr = new Map<string, TeamInfo>();

  for (const g of groups) {
    const letter = g.shortName.replace('Group ', '').trim();
    for (const e of g.entries) {
      byAbbr.set(e.team.abbreviation, { ...e.team, group: letter, standing: e });
    }
  }

  for (const m of matches) {
    const letter = extractGroupLetter(m.round ?? '') ?? undefined;
    for (const t of [m.home, m.away]) {
      if (isPlaceholder(t.abbreviation, t.name)) continue;
      const existing = byAbbr.get(t.abbreviation);
      if (!existing) {
        byAbbr.set(t.abbreviation, {
          name: t.name, shortName: t.shortName, abbreviation: t.abbreviation, logo: t.logo, group: letter,
        });
      } else if (!existing.group && letter) {
        existing.group = letter;
      }
    }
  }

  return [...byAbbr.values()];
}

function Flag({ team, size }: { team: TeamInfo; size: number }) {
  return (
    <div
      className="rounded-full bg-surface-700 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      {team.logo ? (
        <Image src={team.logo} alt={team.abbreviation} width={size} height={size} className="object-contain p-1" unoptimized />
      ) : (
        <span className="text-[10px] font-bold text-slate-300">{team.abbreviation}</span>
      )}
    </div>
  );
}

function TeamDetail({ team, matches, onBack }: { team: TeamInfo; matches: Match[]; onBack: () => void }) {
  const teamMatches = matches
    .filter(m => m.home.abbreviation === team.abbreviation || m.away.abbreviation === team.abbreviation)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let w = 0, d = 0, l = 0;
  for (const m of teamMatches) {
    if (!m.isCompleted) continue;
    const isHome = m.home.abbreviation === team.abbreviation;
    const us = isHome ? m.home : m.away;
    const them = isHome ? m.away : m.home;
    if (us.winner) w++;
    else if (them.winner) l++;
    else d++;
  }

  const s = team.standing;
  const stats: [string, number | string][] = s
    ? [['Pos', s.rank], ['P', s.gamesPlayed], ['W', s.wins], ['D', s.draws], ['L', s.losses], ['GD', s.goalDiff > 0 ? `+${s.goalDiff}` : s.goalDiff], ['Pts', s.points]]
    : [['W', w], ['D', d], ['L', l]];

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="text-sm text-slate-400 hover:text-white mb-4">
        ← All teams
      </button>

      <div className="rounded-2xl border border-white/5 bg-surface-800 p-4 mb-5">
        <div className="flex items-center gap-3">
          <Flag team={team} size={56} />
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{team.name}</h2>
            {team.group && (
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">Group {team.group}</p>
            )}
          </div>
        </div>

        <div className="grid gap-1 mt-4 text-center" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
          {stats.map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-semibold uppercase text-slate-500">{label}</p>
              <p className="text-base font-bold text-white tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        {s?.qualificationNote && (
          <p className="mt-3 text-[11px] text-slate-400 text-center">{s.qualificationNote}</p>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Matches</h3>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {teamMatches.length === 0 ? (
        <p className="text-sm text-slate-500 text-center mt-6">No matches scheduled yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {teamMatches.map(m => <MatchCard key={m.id} match={m} highlighted={m.isLive} />)}
        </div>
      )}
    </div>
  );
}

export default function TeamsView({ groups, scheduleMatches, isLoading }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-14 rounded-2xl bg-surface-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const teams = collectTeams(groups, scheduleMatches);

  if (teams.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-4xl mb-4">🏳️</p>
        <p className="text-white font-bold">Teams unavailable</p>
        <p className="text-slate-400 text-sm mt-2">Team data appears once the schedule loads</p>
      </div>
    );
  }

  const current = selected ? teams.find(t => t.abbreviation === selected) : undefined;
  if (current) {
    return <TeamDetail team={current} matches={scheduleMatches} onBack={() => setSelected(null)} />;
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? teams.filter(t => t.name.toLowerCase().includes(q) || t.abbreviation.toLowerCase().includes(q))
    : teams;

  const byGroup = new Map<string, TeamInfo[]>();
  for (const t of filtered) {
    const key = t.group ?? '—';
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key)!.push(t);
  }
  const groupKeys = [...byGroup.keys()].sort();

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search teams"
        className="w-full mb-5 rounded-xl bg-surface-800 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
      />

      {filtered.length === 0 && (
        <p className="text-sm text-slate-500 text-center mt-6">No teams match “{query}”</p>
      )}

      {groupKeys.map(key => {
        const list = byGroup.get(key)!.sort(
          (a, b) => (a.standing?.rank ?? 99) - (b.standing?.rank ?? 99) || a.name.localeCompare(b.name)
        );
        return (
          <section key={key} className="mb-5 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {key === '—' ? 'Other' : `Group ${key}`}
              </h2>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {list.map(t => (
                <button
                  key={t.abbreviation}
                  onClick={() => setSelected(t.abbreviation)}
                  className="flex items-center gap-2 rounded-xl bg-surface-800 border border-white/5 hover:border-white/15 p-2.5 text-left"
                >
                  <Flag team={t} size={32} />
                  <span className="min-w-0 flex-1 text-sm font-semibold text-white truncate">{t.shortName}</span>
                  {t.standing && (
                    <span className="text-xs font-bold text-slate-400 tabular-nums">{t.standing.points} pts</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
