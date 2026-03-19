import SocialIcons from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-ink-faint mt-auto">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
        <SocialIcons />
        <img src="/images/chalk_logo_dark.png" alt="Wedding" className="h-8 opacity-60" />
        <p className="text-xs text-ink-muted font-body">
          &copy; 2026{" "}
          <a
            href="https://zacharyroland.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors underline"
          >
            Zachary Roland
          </a>
        </p>
      </div>
    </footer>
  );
}
