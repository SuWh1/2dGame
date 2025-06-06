import { useEffect } from "react";
import { db, ref, set } from "../services/firebase";

type PlayerPosition = { x: number; y: number; color: string; name: string };

export function usePlayerMovement(
  playerId: string,
  position: PlayerPosition,
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      setPosition((prev) => {
        let { x, y } = prev;
        if (e.key === "w") y = Math.max(0, y - 1);
        if (e.key === "s") y = Math.min(600 - 4, y + 1);
        if (e.key === "a") x = Math.max(0, x - 1);
        if (e.key === "d") x = Math.min(800 - 4, x + 1);

        // Сохраняем в БД
        set(ref(db, `players/${playerId}`), {
          id: playerId,
          x,
          y,
          color: position.color,
          name: position.name,
        });
        return { x, y };
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playerId, position.color, position.name]);
}
