import { useState } from "react";
import {
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useVideos } from "../hooks/useVideos";
import { fetchLatestVideos } from "../lib/youtube";

export default function AdminMedia() {
  const { videos } = useVideos();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");

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

  async function handleDelete(id: string) {
    if (!confirm("Remove this video?")) return;
    setError("");
    try {
      await deleteDoc(doc(db, "videos", id));
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

      {/* Sync Button */}
      <div className="space-y-3">
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
              onClick={() => handleDelete(video.id)}
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
