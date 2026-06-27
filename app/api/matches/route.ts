import { NextResponse } from 'next/server';

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';

function dateStr(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

export interface Team {
  name: string;
  shortName: string;
  abbreviation: string;
  logo?: string;
  score?: string;
  winner?: boolean;
}

export interface Match {
  id: string;
  date: string; // ISO string UTC
  home: Team;
  away: Team;
  status: 'pre' | 'in' | 'post';
  statusDetail: string;
  clock?: string;
  period?: number;
  venue?: string;
  city?: string;
  round?: string;
  isLive: boolean;
  isCompleted: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parse(event: any): Match {
  const comp = event.competitions?.[0] ?? {};
  const home = comp.competitors?.find((c: any) => c.homeAway === 'home') ?? comp.competitors?.[0] ?? {};
  const away = comp.competitors?.find((c: any) => c.homeAway === 'away') ?? comp.competitors?.[1] ?? {};

  const state: string = event.status?.type?.state ?? 'pre';
  const isLive = state === 'in';
  const isCompleted = event.status?.type?.completed === true;

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
    clock: isLive ? event.status?.displayClock : undefined,
    period: isLive ? event.status?.period : undefined,
    venue: comp.venue?.fullName,
    city: comp.venue?.address?.city,
    round: event.notes?.[0]?.headline ?? event.season?.displayName,
    isLive,
    isCompleted,
  };
}

export async function GET() {
  // Fetch data for yesterday through next 6 days in parallel
  const offsets = [-1, 0, 1, 2, 3, 4, 5, 6];

  const results = await Promise.allSettled(
    offsets.map(o =>
      fetch(`${ESPN}/scoreboard?dates=${dateStr(o)}`, {
        headers: { 'User-Agent': 'WC2026-Live/1.0' },
        next: { revalidate: 30 },
      })
    )
  );

  const seen = new Set<string>();
  const matches: Match[] = [];

  for (const r of results) {
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
    {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    }
  );
}
