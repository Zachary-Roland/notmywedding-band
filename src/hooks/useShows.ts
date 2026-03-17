import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, firebaseConfigured } from "../lib/firebase";

export interface Show {
  id: string;
  date: Timestamp;
  billing: string;
  venue: string;
  city: string;
  ticketUrl?: string;
  createdAt: Timestamp;
}

export function useShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "shows"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Show[];
        setShows(data);
        setLoading(false);
      },
      (err) => {
        console.error("Shows listener failed:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingShows = shows.filter(
    (show) => show.date.toDate() >= today
  );

  return { shows, upcomingShows, loading };
}
