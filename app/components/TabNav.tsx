'use client';

export type Tab = 'schedule' | 'rounds' | 'groups';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  liveCount: number;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'rounds', label: 'Knockout', icon: '🏆' },
  { id: 'groups', label: 'Groups', icon: '📊' },
];

export default function TabNav({ active, onChange, liveCount }: Props) {
  return (
    <div className="sticky top-[61px] z-40 bg-surface-900/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-2xl mx-auto px-2 flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex items-center gap-1.5 px-4 py-3 text-sm font-semibold
              transition-colors flex-1 justify-center
              ${active === tab.id
                ? 'text-amber-400'
                : 'text-slate-500 hover:text-slate-300'
              }
            `}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>

            {tab.id === 'schedule' && liveCount > 0 && (
              <span className="bg-green-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {liveCount}
              </span>
            )}

            {/* Active underline */}
            <span
              className={`
                absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all
                ${active === tab.id ? 'bg-amber-400' : 'bg-transparent'}
              `}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
