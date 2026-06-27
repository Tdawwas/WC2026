'use client';

import type { GroupStanding } from '../api/standings/route';
import type { Match } from '../api/matches/route';
import GroupTable from './GroupTable';

interface Props {
  groups: GroupStanding[];
  scheduleMatches: Match[];
  isLoading: boolean;
  error?: boolean;
}

function extractGroupLetter(round: string): string | null {
  // Matches "Group A", "Group A - Matchday 1", "Group A Matchday 2", etc.
  const m = round.match(/Group\s+([A-La-l])\b/i);
  return m ? m[1].toUpperCase() : null;
}

export default function GroupsView({ groups, scheduleMatches, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-48 rounded-2xl bg-surface-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || groups.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-4xl mb-4">📊</p>
        <p className="text-white font-bold">Group standings unavailable</p>
        <p className="text-slate-400 text-sm mt-2">
          Standings appear once the group stage begins
        </p>
      </div>
    );
  }

  // Build a map: group letter → matches
  const matchesByGroup = new Map<string, Match[]>();
  for (const m of scheduleMatches) {
    const letter = extractGroupLetter(m.round ?? '');
    if (!letter) continue;
    if (!matchesByGroup.has(letter)) matchesByGroup.set(letter, []);
    matchesByGroup.get(letter)!.push(m);
  }

  // Sort groups alphabetically
  const sorted = [...groups].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <p className="text-[11px] text-slate-500 mb-4">
        Top 2 from each group advance · 8 best 3rd-place teams also qualify · All times UAE (GMT+4)
      </p>
      {sorted.map(g => {
        const letter = g.shortName.replace('Group ', '').trim();
        const groupMatches = matchesByGroup.get(letter) ?? [];
        return (
          <GroupTable key={g.name} group={g} matches={groupMatches} />
        );
      })}
    </div>
  );
}
