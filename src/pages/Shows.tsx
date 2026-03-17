import { useShows } from "../hooks/useShows";
import ShowCard from "../components/ShowCard";

export default function Shows() {
  const { upcomingShows, loading } = useShows();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-ink-muted font-heading text-lg">loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-12 px-4">
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-8">shows</h1>

      {upcomingShows.length === 0 ? (
        <p className="text-ink-muted font-body">No upcoming shows.</p>
      ) : (
        <div className="space-y-3">
          {upcomingShows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}
    </div>
  );
}
