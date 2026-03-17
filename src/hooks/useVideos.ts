import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, firebaseConfigured } from "../lib/firebase";

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: Timestamp;
  createdAt: Timestamp;
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "videos"), orderBy("publishedAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Video[];
        setVideos(data);
        setLoading(false);
      },
      (err) => {
        console.error("Videos listener failed:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { videos, loading };
}
