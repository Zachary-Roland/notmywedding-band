import type { Show } from "../hooks/useShows";

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const date = show.date.toDate();
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="border border-ink-faint rounded px-4 py-3 flex items-center justify-between gap-4 bg-paper">
      <div>
        <p className="text-sm font-semibold font-heading text-ink">{formatted}</p>
        {show.billing && (
          <p className="text-sm text-ink">{show.billing}</p>
        )}
        <p className="text-sm text-ink-muted">
          {show.venue} — {show.city}
        </p>
      </div>
      {show.ticketUrl && (
        <a
          href={show.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs border border-ink px-3 py-1 rounded text-ink hover:bg-ink hover:text-cream transition-colors whitespace-nowrap font-body"
        >
          tickets
        </a>
      )}
    </div>
  );
}
