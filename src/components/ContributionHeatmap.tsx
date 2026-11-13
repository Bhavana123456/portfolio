// Sage-tinted contribution calendar. Scrolls horizontally on narrow screens.
const LEVELS = ["#222222", "#34402f", "#4d6149", "#6d8469", "#8DA58A"];

function level(count: number, max: number) {
  if (count === 0) return 0;
  return Math.min(4, Math.ceil((count / Math.max(max, 1)) * 4));
}

export function ContributionHeatmap({ weeks }: { weeks: { date: string; count: number }[][] }) {
  const max = Math.max(...weeks.flat().map((d) => d.count));
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex w-max gap-[3px]" role="img" aria-label="GitHub contribution calendar for the last year">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {week.map((d) => (
              <span key={d.date} title={`${d.count} on ${d.date}`} className="h-[9px] w-[9px] rounded-[2px]"
                style={{ background: LEVELS[level(d.count, max)] }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
