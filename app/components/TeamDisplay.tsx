'use client';

import Image from 'next/image';
import type { Team } from '../api/matches/route';

interface Props {
  team: Team;
  align?: 'left' | 'right';
  large?: boolean;
}

export default function TeamDisplay({ team, align = 'left', large = false }: Props) {
  const size = large ? 52 : 40;

  return (
    <div
      className={`flex items-center gap-2 flex-1 ${
        align === 'right' ? 'flex-row-reverse text-right' : 'text-left'
      }`}
    >
      <div
        className="rounded-full bg-surface-700 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden"
        style={{ width: size, height: size }}
      >
        {team.logo ? (
          <Image
            src={team.logo}
            alt={team.abbreviation}
            width={size}
            height={size}
            className="object-contain p-1"
            unoptimized
          />
        ) : (
          <span className="text-xs font-bold text-slate-300">{team.abbreviation}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className={`font-bold text-white leading-tight truncate ${large ? 'text-base' : 'text-sm'}`}>
          {team.shortName}
        </p>
        <p className="text-xs text-slate-400 truncate hidden sm:block">{team.name}</p>
      </div>
    </div>
  );
}
