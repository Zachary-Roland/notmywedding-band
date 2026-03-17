export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-8 md:py-12 px-4">
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-8">about</h1>

      <div className="space-y-6 font-body text-ink leading-relaxed">
        <p>
          Wedding is the project of singer-songwriter Anna Schulte, who grew up
          in Omaha and spent her suburban childhood steeped in poetry and
          literature. She found her way to songwriting as a teenager, when she
          began singing her own poems over a few simple chords. In 2013 she
          formed the indie rock band Pretty Healthy, and in 2016 went onto play
          solo under the name Anna Sun at cozy and beloved venues like the Milk
          Run. In 2022, she released her debut EP Dream Car with the help of
          Omaha-based engineer and multi-instrumentalist Nate Van Fleet, followed
          by the single Bright As a Star in 2023.
        </p>
        <blockquote className="border-l-2 border-accent-sage pl-4 italic text-ink-muted">
          <p>
            Aldora Britain Records writes, &ldquo;These releases, with their
            jazzy textures and poetic sad song vibes, are a tantalizing taste of
            what is to come from this up-and-coming dreamy folk troubadour. Each
            offering blends genre boundaries and borders together with a
            gloriously appealing disrespect for the pre-established norms of this
            flawed industry.&rdquo;
          </p>
        </blockquote>
      </div>

      {/* Photo collage */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { src: "/images/anna_wheatfield.jpg", alt: "Anna in wheatfield" },
          { src: "/images/anna_live_oleavers.jpg", alt: "Anna live at O'Leavers" },
          { src: "/images/live_show_oleavers.jpg", alt: "Live show" },
          { src: "/images/bphoto.jpg", alt: "Wedding band" },
          { src: "/images/single_art.jpg", alt: "Single artwork" },
          { src: "/images/annawearingbandtshirt.jpg", alt: "Band merch" },
        ].map((photo, i) => (
          <div
            key={photo.src}
            className="overflow-hidden rounded shadow-sm aspect-square"
            style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
