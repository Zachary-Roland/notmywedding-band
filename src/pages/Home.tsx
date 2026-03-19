import { Link } from "react-router";
import { useLinks } from "../hooks/useLinks";
import { useShows } from "../hooks/useShows";
import { useSettings } from "../hooks/useSettings";
import { useAuthContext } from "../context/AuthContext";
import { navItems, externalLinks } from "../lib/navigation";
import LinkButton from "../components/LinkButton";
import ShowCard from "../components/ShowCard";
import YouTubeEmbed from "../components/YouTubeEmbed";

const rotations = [-1.5, 0.8, -0.5, 1.2, -0.8, 1.5, -1, 0.5];

export default function Home() {
  const { user } = useAuthContext();
  const { links, loading: linksLoading } = useLinks();
  const { upcomingShows, loading: showsLoading } = useShows();
  const { settings, loading: settingsLoading } = useSettings();

  const isLoading = linksLoading || showsLoading || settingsLoading;
  const nextShow = upcomingShows[0];

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-cream">
        <img src="/images/chalk_logo_dark.png" alt="Wedding" className="h-32" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-6 md:py-6 px-4 gap-4 md:gap-5 max-w-3xl mx-auto">
      {/* Logo (mobile only -- desktop has navbar) */}
      <h1 className="md:hidden">
        <img src="/images/chalk_logo_dark.png" alt="Wedding" className="h-14" />
      </h1>

      {/* Hero Image */}
      <div className="w-full max-w-sm md:max-w-2xl">
        <img
          src="/images/headerphoto.jpg"
          alt="Wedding"
          className="w-full rounded shadow-md"
        />
      </div>

      {/* Next Show */}
      {nextShow && (
        <div className="w-full max-w-md">
          <p className="text-sm text-ink-muted mb-2 font-heading">next show</p>
          <ShowCard show={nextShow} />
        </div>
      )}

      {/* Editable links first */}
      <div className="w-full flex flex-col items-center gap-4">
        {links.map((link, i) => (
          <LinkButton
            key={link.id}
            label={link.label}
            url={link.url}
            rotation={rotations[i % rotations.length] ?? 0}
          />
        ))}

        {/* Nav page links (mobile only, filtered by admin settings) */}
        {navItems
          .filter(item => item.path !== "/" && settings.visibleNavLinks.includes(item.path))
          .map((item, i) => (
          <Link
            key={item.path}
            to={item.path}
            className="md:hidden torn-paper block w-full max-w-md bg-paper px-6 py-4 text-center font-heading text-lg text-ink transition-all duration-200"
            style={{ transform: `rotate(${rotations[(i + links.length) % rotations.length]}deg)` }}
          >
            {item.label}
          </Link>
        ))}
        {/* External links (mobile only, filtered by admin settings) */}
        {externalLinks
          .filter(link => settings.visibleNavLinks.includes(link.label.toLowerCase()))
          .map((link, i) => (
          <LinkButton
            key={link.url}
            label={link.label}
            url={link.url}
            rotation={rotations[(i + links.length + navItems.length) % rotations.length] ?? 0}
            className="md:hidden"
          />
        ))}

        {/* Admin link when logged in (mobile only, at bottom of links) */}
        {user && (
          <Link to="/admin" className="md:hidden text-sm text-ink-muted hover:text-ink transition-colors font-heading mt-2">
            admin
          </Link>
        )}
      </div>

      {/* YouTube Embed */}
      {settings.youtubeEnabled && settings.youtubeUrl && (
        <YouTubeEmbed url={settings.youtubeUrl} />
      )}
    </div>
  );
}
