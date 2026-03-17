import { useState } from "react";
import { usePhotos } from "../hooks/usePhotos";
import Lightbox from "../components/Lightbox";

const staticPhotos = [
  { src: "/images/anna_wheatfield.jpg", alt: "Anna in wheatfield" },
  { src: "/images/live_show_little_bo.jpg", alt: "Live show at Little Bohemia" },
  { src: "/images/anna_live_oleavers.jpg", alt: "Anna live at O'Leavers" },
  { src: "/images/bphoto.jpg", alt: "Wedding band" },
  { src: "/images/annawearingbandtshirt.jpg", alt: "Band merch" },
  { src: "/images/live_show_oleavers.jpg", alt: "Live show" },
];

export default function About() {
  const { photos } = usePhotos();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Last 6 uploaded photos, falling back to static if fewer than 6 uploaded
  const uploaded = photos.slice(-6).map((p) => ({ src: p.url, alt: p.alt }));
  const displayPhotos = uploaded.length >= 6
    ? uploaded
    : [...uploaded, ...staticPhotos.slice(0, 6 - uploaded.length)];

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
      <div className="mt-12 columns-2 md:columns-3 gap-4">
        {displayPhotos.map((photo, i) => (
          <div key={photo.src} className="mb-4 break-inside-avoid">
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto rounded shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
              onClick={() => setLightboxIndex(i)}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={displayPhotos}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
