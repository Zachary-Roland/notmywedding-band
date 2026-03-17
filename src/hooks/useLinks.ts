import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, firebaseConfigured } from "../lib/firebase";

export interface Link {
  id: string;
  label: string;
  url: string;
  order: number;
  createdAt: Timestamp;
}

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "links"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Link[];
        setLinks(data);
        setLoading(false);
      },
      (err) => {
        console.error("Links listener failed:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { links, loading };
}
