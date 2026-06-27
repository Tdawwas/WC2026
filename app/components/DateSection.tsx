'use client';

import type { Match } from '../api/matches/route';
import MatchCard from './MatchCard';

const UAE_TZ = 'Asia/Dubai';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const uaeDate = new Intl.DateTimeFormat('en-CA', { timeZone: UAE_TZ }).format(d);
  const todayUAE = new Intl.DateTimeFormat('en-CA', { timeZone: UAE_TZ }).format(today);
  const tomorrowUAE = new Intl.DateTimeFormat('en-CA', { timeZone: UAE_TZ }).format(tomorrow);

  if (uaeDate === todayUAE) return 'Today';
  if (uaeDate === tomorrowUAE) return 'Tomorrow';

  return new Intl.DateTimeFormat('en-AE', {
    timeZone: UAE_TZ,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

interface Props {
  matches: Match[];
  title?: string;
}

export default function DateSection({ matches, title }: Props) {
  if (matches.length === 0) return null;

  const label = title ?? formatDate(matches[0].date);

  const isToday = label === 'Today';

  return (
    <section className="mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <h2
          className={`text-xs font-bold uppercase tracking-wider ${
            isToday ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          {label}
        </h2>
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-xs text-slate-600">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
      </div>
      <div className="flex flex-col gap-3">
        {matches.map(m => (
          <MatchCard key={m.id} match={m} highlighted={isToday} />
        ))}
      </div>
    </section>
  );
}
