import { NextResponse } from 'next/server';
import type { Match } from '../matches/route';

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parse(event: any): Match {
  const comp = event.competitions?.[0] ?? {};
  const home = comp.competitors?.find((c: any) => c.homeAway === 'home') ?? comp.competitors?.[0] ?? {};
  const away = comp.competitors?.find((c: any) => c.homeAway === 'away') ?? comp.competitors?.[1] ?? {};
  const state: string = event.status?.type?.state ?? 'pre';

  return {
    id: event.id,
    date: event.date,
    home: {
      name: home.team?.displayName ?? home.team?.name ?? 'TBD',
      shortName: home.team?.shortDisplayName ?? home.team?.abbreviation ?? 'TBD',
      abbreviation: home.team?.abbreviation ?? '???',
      logo: home.team?.logo,
      score: home.score,
      winner: home.winner,
    },
    away: {
      name: away.team?.displayName ?? away.team?.name ?? 'TBD',
      shortName: away.team?.shortDisplayName ?? away.team?.abbreviation ?? 'TBD',
      abbreviation: away.team?.abbreviation ?? '???',
      logo: away.team?.logo,
      score: away.score,
      winner: away.winner,
    },
    status: state as 'pre' | 'in' | 'post',
    statusDetail: event.status?.type?.shortDetail ?? event.status?.type?.detail ?? '',
    clock: state === 'in' ? event.status?.displayClock : undefined,
    period: state === 'in' ? event.status?.period : undefined,
    venue: comp.venue?.fullName,
    city: comp.venue?.address?.city,
    round: event.notes?.[0]?.headline ?? '',
    isLive: state === 'in',
    isCompleted: event.status?.type?.completed === true,
  };
}

// Build YYYYMMDD strings from June 11 to July 20 2026
function tournamentDates(): string[] {
  const dates: string[] = [];
  const start = new Date('2026-06-11T00:00:00Z');
  const end = new Date('2026-07-20T00:00:00Z');
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0, 10).replace(/-/g, ''));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

export async function GET() {
  const dates = tournamentDates();

  // Batch requests in groups of 7 days to be efficient
  const batches: string[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    batches.push(dates.slice(i, i + 7));
  }

  const allResults = await Promise.allSettled(
    batches.map(batch => {
      // Try range format first: espn supports YYYYMMDD-YYYYMMDD
      const range = `${batch[0]}-${batch[batch.length - 1]}`;
      return fetch(`${ESPN}/scoreboard?dates=${range}`, {
        headers: { 'User-Agent': 'WC2026-Live/1.0' },
        next: { revalidate: 60 },
      });
    })
  );

  const seen = new Set<string>();
  const matches: Match[] = [];

  for (const r of allResults) {
    if (r.status !== 'fulfilled' || !r.value.ok) continue;
    let body: any;
    try { body = await r.value.json(); } catch { continue; }
    for (const ev of body.events ?? []) {
      if (seen.has(ev.id)) continue;
      seen.add(ev.id);
      matches.push(parse(ev));
    }
  }

  matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return NextResponse.json(
    { matches, updatedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
  );
}
