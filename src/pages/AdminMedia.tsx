import { useState, useRef } from "react";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useVideos } from "../hooks/useVideos";
import { usePhotos } from "../hooks/usePhotos";
import { fetchLatestVideos } from "../lib/youtube";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "";

export default function AdminMedia() {
  const { videos } = useVideos();
  const { photos } = usePhotos();
  const [syncing, setSyncing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleSync() {
    setError("");
    setSyncMessage("");
    setSyncing(true);
    try {
      const fetched = await fetchLatestVideos();
      let added = 0;
      for (const video of fetched) {
        await setDoc(doc(db, "videos", video.youtubeId), {
          youtubeId: video.youtubeId,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          publishedAt: Timestamp.fromDate(new Date(video.publishedAt)),
          createdAt: serverTimestamp(),
        }, { merge: true });
        added++;
      }
      setSyncMessage(`Synced ${added} videos from YouTube.`);
    } catch (err) {
      setError(`Failed to sync: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setSyncing(false);
    }
  }

  async function handleDeleteVideo(id: string) {
    if (!confirm("Remove this video?")) return;
    setError("");
    try {
      await deleteDoc(doc(db, "videos", id));
    } catch (err) {
      setError(`Failed to delete: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  async function handleUploadPhotos() {
    const files = fileInput.current?.files;
    if (!files || files.length === 0) {
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env");
      return;
    }

    setError("");
    setUploadMessage("");
    setUploading(true);
    try {
      let uploaded = 0;
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();

        if (data.secure_url) {
          await addDoc(collection(db, "photos"), {
            url: data.secure_url,
            alt: file.name.replace(/\.[^.]+$/, ""),
            order: photos.length + uploaded,
            createdAt: serverTimestamp(),
          });
          uploaded++;
        } else {
          throw new Error(data.error?.message ?? "Upload failed");
        }
      }
      setUploadMessage(`Uploaded ${uploaded} photo${uploaded > 1 ? "s" : ""}.`);
      if (fileInput.current) fileInput.current.value = "";
    } catch (err) {
      setError(`Failed to upload: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeletePhoto(id: string) {
    if (!confirm("Delete this photo?")) return;
    setError("");
    try {
      await deleteDoc(doc(db, "photos", id));
    } catch (err) {
      setError(`Failed to delete: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div role="alert" className="border border-red-600 rounded px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Photo Upload */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-ink-muted">photos</h2>
        <div className="flex items-center gap-3">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUploadPhotos}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`border border-ink text-ink px-4 py-1.5 rounded text-sm hover:bg-ink hover:text-cream transition-colors cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            {uploading ? "uploading..." : "upload photos"}
          </label>
          {uploadMessage && (
            <span className="text-xs text-accent-sage">{uploadMessage}</span>
          )}
        </div>

        {/* Photos List */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-24 object-cover rounded"
              />
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Sync */}
      <div className="space-y-3 border-t border-ink-faint pt-6">
        <h2 className="text-sm font-bold text-ink-muted">youtube sync</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="border border-ink text-ink px-4 py-1.5 rounded text-sm hover:bg-ink hover:text-cream transition-colors disabled:opacity-50"
          >
            {syncing ? "syncing..." : "fetch latest videos"}
          </button>
          {syncMessage && (
            <span className="text-xs text-accent-sage">{syncMessage}</span>
          )}
        </div>
      </div>

      {/* Videos List */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-ink-muted">
          videos ({videos.length})
        </h2>
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-3 border border-ink-faint rounded px-3 py-2"
          >
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-20 h-auto rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink truncate">{video.title}</p>
              <p className="text-xs text-ink-muted">
                {video.publishedAt.toDate().toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDeleteVideo(video.id)}
              className="text-xs text-red-600 hover:text-red-500"
            >
              remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
