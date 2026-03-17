import { useLinks } from "../hooks/useLinks";
import { useShows } from "../hooks/useShows";
import { useSettings } from "../hooks/useSettings";
import LinkButton from "../components/LinkButton";
import ShowCard from "../components/ShowCard";
import YouTubeEmbed from "../components/YouTubeEmbed";

const rotations = [-1.5, 0.8, -0.5, 1.2, -0.8, 1.5, -1, 0.5];

export default function Home() {
  const { links, loading: linksLoading } = useLinks();
  const { upcomingShows, loading: showsLoading } = useShows();
  const { settings, loading: settingsLoading } = useSettings();

  const isLoading = linksLoading || showsLoading || settingsLoading;
  const nextShow = upcomingShows[0];

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-cream">
        <span className="text-ink-muted font-display text-2xl">wedding</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 md:py-12 px-4 gap-6 max-w-3xl mx-auto">
      {/* Hero Image */}
      <div className="w-full max-w-2xl">
        <img
          src="/images/headerphoto.jpg"
          alt="Wedding"
          className="w-full rounded shadow-md"
        />
      </div>

      {/* Logo (mobile only -- desktop has it in Navbar) */}
      <h1 className="md:hidden font-display text-4xl text-ink">wedding</h1>

      {/* YouTube Embed */}
      {settings.youtubeEnabled && settings.youtubeUrl && (
        <YouTubeEmbed url={settings.youtubeUrl} />
      )}

      {/* Links */}
      <div className="w-full flex flex-col items-center gap-4 py-4">
        {links.map((link, i) => (
          <LinkButton
            key={link.id}
            label={link.label}
            url={link.url}
            rotation={rotations[i % rotations.length] ?? 0}
          />
        ))}
      </div>

      {/* Next Show */}
      {nextShow && (
        <div className="w-full max-w-md">
          <p className="text-sm text-ink-muted mb-2 font-heading">next show</p>
          <ShowCard show={nextShow} />
        </div>
      )}
    </div>
  );
}
