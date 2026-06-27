import { NextResponse } from 'next/server';

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';

export interface StandingEntry {
  rank: number;
  team: {
    name: string;
    shortName: string;
    abbreviation: string;
    logo?: string;
  };
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  qualificationNote?: string;
  noteColor?: string;
}

export interface GroupStanding {
  name: string;       // "Group A"
  shortName: string;  // "A"
  entries: StandingEntry[];
}

function statVal(stats: any[], name: string): number {
  return stats.find((s: any) => s.name === name)?.value ?? 0;
}

export async function GET() {
  try {
    const res = await fetch(`${ESPN}/standings`, {
      headers: { 'User-Agent': 'WC2026-Live/1.0' },
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      return NextResponse.json({ groups: [], error: 'Standings unavailable' }, { status: 200 });
    }

    const data = await res.json();

    // ESPN wraps standings differently depending on version
    const rawGroups: any[] =
      data?.standings?.groups ??
      data?.children?.map((c: any) => ({
        name: c.abbreviation ?? c.name,
        standings: c.standings,
      })) ??
      [];

    const groups: GroupStanding[] = rawGroups.map((g: any) => {
      const entries: StandingEntry[] = (g.standings?.entries ?? []).map((e: any, idx: number) => {
        const stats: any[] = e.stats ?? [];
        return {
          rank: idx + 1,
          team: {
            name: e.team?.displayName ?? e.team?.name ?? 'Unknown',
            shortName: e.team?.shortDisplayName ?? e.team?.abbreviation ?? '???',
            abbreviation: e.team?.abbreviation ?? '???',
            logo: e.team?.logo,
          },
          gamesPlayed: statVal(stats, 'gamesPlayed'),
          wins: statVal(stats, 'wins'),
          draws: statVal(stats, 'ties'),
          losses: statVal(stats, 'losses'),
          goalsFor: statVal(stats, 'pointsFor'),
          goalsAgainst: statVal(stats, 'pointsAgainst'),
          goalDiff: statVal(stats, 'pointDifferential'),
          points: statVal(stats, 'points'),
          qualificationNote: e.note?.description,
          noteColor: e.note?.color,
        };
      });

      return {
        name: g.name ?? g.abbreviation ?? 'Group',
        shortName: (g.abbreviation ?? g.name ?? 'G').replace(/Group /i, ''),
        entries,
      };
    });

    return NextResponse.json(
      { groups, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240' } }
    );
  } catch {
    return NextResponse.json({ groups: [], error: 'Failed to fetch standings' }, { status: 200 });
  }
}
