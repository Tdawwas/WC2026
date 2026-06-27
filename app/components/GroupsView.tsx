'use client';

import type { GroupStanding } from '../api/standings/route';
import GroupTable from './GroupTable';

interface Props {
  groups: GroupStanding[];
  isLoading: boolean;
  error?: boolean;
}

export default function GroupsView({ groups, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 rounded-2xl bg-surface-800 animate-pulse" />
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
          Standings will appear here once the group stage begins
        </p>
      </div>
    );
  }

  // Sort groups alphabetically by name
  const sorted = [...groups].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <p className="text-[11px] text-slate-500 mb-4">
        Top 2 from each group advance · 8 best 3rd-place teams also advance to Round of 32
      </p>
      {sorted.map(g => (
        <GroupTable key={g.name} group={g} />
      ))}
    </div>
  );
}
