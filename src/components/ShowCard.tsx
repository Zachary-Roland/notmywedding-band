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
    <div
      className="bg-paper border border-ink-faint rounded-sm px-5 py-4 flex items-center gap-4"
      style={{
        transform: "rotate(-0.3deg)",
        boxShadow: "2px 3px 6px rgba(44, 36, 22, 0.12)",
      }}
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
          className="border border-ink bg-ink text-cream text-xs px-4 py-2 rounded-sm font-body whitespace-nowrap hover:bg-transparent hover:text-ink transition-colors inline-flex items-center justify-center leading-none"
        >
          tickets
        </a>
      )}
    </div>
  );
}
