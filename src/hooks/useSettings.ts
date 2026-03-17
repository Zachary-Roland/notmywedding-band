import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, firebaseConfigured } from "../lib/firebase";

export interface HomeSettings {
  youtubeUrl: string;
  youtubeEnabled: boolean;
}

const defaultSettings: HomeSettings = {
  youtubeUrl: "",
  youtubeEnabled: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<HomeSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, "settings", "home"),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as HomeSettings);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Settings listener failed:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { settings, loading };
}
