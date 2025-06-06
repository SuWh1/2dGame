import { useEffect, useState } from "react";
import { db, ref, onValue } from "../services/firebase";

type Player = { id: string; x: number; y: number; color: string; name: string };

export function useRealtimePlayers() {
  const [players, setPlayers] = useState<Record<string, Player>>({});

  useEffect(() => {
    const playersRef = ref(db, "players");
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPlayers(data);
    });

    return () => unsubscribe();
  }, []);

  return players;
}
