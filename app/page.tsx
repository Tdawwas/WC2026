'use client';

import useSWR from 'swr';
import Header from './components/Header';
import MatchCard from './components/MatchCard';
import DateSection from './components/DateSection';
import type { Match } from './api/matches/route';

const UAE_TZ = 'Asia/Dubai';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function uaeDateKey(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: UAE_TZ }).format(new Date(iso));
}

function todayUAE(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: UAE_TZ }).format(new Date());
}

function yesterdayUAE(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return new Intl.DateTimeFormat('en-CA', { timeZone: UAE_TZ }).format(d);
}

function groupByDate(matches: Match[]): Map<string, Match[]> {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const key = uaeDateKey(m.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return map;
}

export default function Home() {
  const { data, error, isLoading } = useSWR<{ matches: Match[]; updatedAt: string }>(
    '/api/matches',
    fetcher,
    {
      refreshInterval: 30_000,
      revalidateOnFocus: true,
      dedupingInterval: 10_000,
    }
  );

  const matches = data?.matches ?? [];
  const liveMatches = matches.filter(m => m.isLive);
  const nonLiveMatches = matches.filter(m => !m.isLive);

  const today = todayUAE();
  const yesterday = yesterdayUAE();

  const grouped = groupByDate(nonLiveMatches);

  // Separate: results (past), today, upcoming
  const resultsEntries: [string, Match[]][] = [];
  const todayMatches: Match[] = grouped.get(today) ?? [];
  const upcomingEntries: [string, Match[]][] = [];

  for (const [date, ms] of grouped.entries()) {
    if (date < today) {
      resultsEntries.push([date, ms]);
    } else if (date > today) {
      upcomingEntries.push([date, ms]);
    }
  }

  resultsEntries.sort(([a], [b]) => b.localeCompare(a)); // newest first
  upcomingEntries.sort(([a], [b]) => a.localeCompare(b)); // soonest first

  const hasAnyData = matches.length > 0;

  return (
    <div className="min-h-screen bg-surface-900">
      <Header liveCount={liveMatches.length} updatedAt={data?.updatedAt} />

      <main className="max-w-2xl mx-auto px-4 py-5 pb-20">

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex flex-col gap-3 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-2xl bg-surface-800 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="mt-8 text-center">
            <p className="text-3xl mb-3">📡</p>
            <p className="text-white font-semibold">Could not load matches</p>
            <p className="text-slate-400 text-sm mt-1">
              Check your connection — data will refresh automatically
            </p>
          </div>
        )}

        {/* No data after load */}
        {!isLoading && !error && !hasAnyData && (
          <div className="mt-8 text-center">
            <p className="text-5xl mb-4">⚽</p>
            <p className="text-white font-bold text-lg">No matches found</p>
            <p className="text-slate-400 text-sm mt-2">
              FIFA World Cup 2026 data will appear here when available
            </p>
          </div>
        )}

        {/* Live now section */}
        {liveMatches.length > 0 && (
          <section className="mb-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-green-400">Live Now</h2>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="flex flex-col gap-3">
              {liveMatches.map(m => (
                <MatchCard key={m.id} match={m} highlighted />
              ))}
            </div>
          </section>
        )}

        {/* Today's matches */}
        {todayMatches.length > 0 && (
          <DateSection
            matches={todayMatches}
            title={liveMatches.length > 0 ? 'More Today' : 'Today'}
          />
        )}

        {/* Upcoming */}
        {upcomingEntries.map(([, ms]) => (
          <DateSection key={uaeDateKey(ms[0].date)} matches={ms} />
        ))}

        {/* Recent results */}
        {resultsEntries.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer list-none mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recent Results
                </h2>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-slate-600">▾ show</span>
              </div>
            </summary>
            {resultsEntries.map(([, ms]) => (
              <DateSection key={uaeDateKey(ms[0].date)} matches={ms} />
            ))}
          </details>
        )}

        {/* Auto-refresh notice */}
        {hasAnyData && (
          <p className="text-center text-[11px] text-slate-700 mt-8">
            Live scores refresh every 30 seconds · All times UAE (GMT+4)
          </p>
        )}
      </main>
    </div>
  );
}
