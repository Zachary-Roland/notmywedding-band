import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, firebaseConfigured } from "../lib/firebase";

export interface Photo {
  id: string;
  url: string;
  alt: string;
  order: number;
  createdAt: Timestamp;
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "photos"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photo[];
        setPhotos(data);
        setLoading(false);
      },
      (err) => {
        console.error("Photos listener failed:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { photos, loading };
}
