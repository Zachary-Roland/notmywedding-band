import SocialIcons from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-ink-faint mt-auto">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
        <SocialIcons />
        <p className="font-display text-xl text-ink-muted">wedding</p>
      </div>
    </footer>
  );
}
