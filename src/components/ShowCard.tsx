import type { Show } from "../hooks/useShows";

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const date = show.date.toDate();
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();

  return (
    <div className="torn-paper bg-paper px-5 py-4 flex items-center gap-4"
      style={{ transform: "rotate(-0.5deg)" }}
    >
      <div className="text-center min-w-[3.5rem] border-r border-ink-faint pr-4">
        <p className="text-xs uppercase text-ink-muted font-body">{weekday}</p>
        <p className="text-2xl font-bold font-heading text-ink leading-none">{day}</p>
        <p className="text-xs uppercase text-ink-muted font-body">{month}</p>
      </div>
      <div className="flex-1 min-w-0">
        {show.billing && (
          <p className="font-heading text-base font-semibold text-ink">{show.billing}</p>
        )}
        <p className="text-sm text-ink-muted font-body">
          {show.venue} — {show.city}
        </p>
      </div>
      {show.ticketUrl && (
        <a
          href={show.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="torn-paper bg-ink text-cream text-xs px-3 py-2 font-body whitespace-nowrap hover:translate-y-[-1px] transition-all"
        >
          tickets
        </a>
      )}
    </div>
  );
}
