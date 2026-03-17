import { useState } from "react";
import { useVideos } from "../hooks/useVideos";
import { usePhotos } from "../hooks/usePhotos";
import Lightbox from "../components/Lightbox";

const staticPhotos = [
  { src: "/images/anna_live_oleavers.jpg", alt: "Live at O'Leavers" },
  { src: "/images/live_show_oleavers.jpg", alt: "Live show" },
  { src: "/images/anna_wheatfield.jpg", alt: "Anna in wheatfield" },
  { src: "/images/annaholdingbandtote.jpg", alt: "Band tote" },
  { src: "/images/annawearingbandtshirt.jpg", alt: "Band tshirt" },
  { src: "/images/bphoto.jpg", alt: "Band photo" },
];

export default function Media() {
  const { videos, loading: videosLoading } = useVideos();
  const { photos, loading: photosLoading } = usePhotos();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loading = videosLoading || photosLoading;

  // Combine uploaded photos with static fallback photos
  const allPhotos = [
    ...photos.map((p) => ({ src: p.url, alt: p.alt })),
    ...staticPhotos,
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-ink-muted font-heading text-lg">loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-12 px-4">
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-8">media</h1>

      {/* Photo Gallery */}
      <h2 className="font-heading text-2xl text-ink mb-4">photos</h2>
      <div className="columns-2 md:columns-3 gap-4 mb-12">
        {allPhotos.map((photo, i) => (
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

      {/* Videos */}
      {videos.length > 0 && (
        <>
          <h2 className="font-heading text-2xl text-ink mb-4">videos</h2>
          <div className="space-y-6">
            {videos.map((video) => (
              <div key={video.id} className="space-y-2">
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded border border-ink-faint"
                  />
                </div>
                <p className="font-heading text-sm text-ink-muted">{video.title}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={allPhotos}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
