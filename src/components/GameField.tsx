import type { CSSProperties } from "react";
import { usePlayerMovement } from "../hooks/usePlayerMovement";
import { useRealtimePlayers } from "../hooks/useRealtimePlayers";

type Position = { x: number; y: number };
type Player = { id: string; x: number; y: number; color: string; name: string };
type GameFieldProps = {
  playerId: string;
  color: string;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  name: string;
};

const FIELD_STYLE: CSSProperties = {
  width: 800,
  height: 600,
  backgroundColor: "#111",
  position: "relative",
  margin: "20px auto",
};

const PLAYER_STYLE: CSSProperties = {
  width: 4,
  height: 4,
  position: "absolute",
  borderRadius: 2,
  zIndex: 2,
};

const NAME_STYLE: CSSProperties = {
  position: "absolute",
  top: -18,
  left: "50%",
  transform: "translateX(-50%)",
  color: "#fff",
  background: "rgba(0,0,0,0.7)",
  padding: "1px 4px",
  borderRadius: 3,
  fontSize: 10,
  whiteSpace: "nowrap",
  pointerEvents: "none",
  zIndex: 3,
};

export default function GameField({
  playerId,
  color,
  position,
  setPosition,
  name,
}: GameFieldProps) {
  const players = useRealtimePlayers();
  usePlayerMovement(playerId, { ...position, color, name }, setPosition);

  return (
    <div style={FIELD_STYLE}>
      {Object.values(players).map((p) => (
        <div
          key={p.id}
          style={{
            ...PLAYER_STYLE,
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            border: p.id === playerId ? "1px solid #4f8cff" : "1px solid #fff",
            zIndex: p.id === playerId ? 10 : 2,
          }}
        >
          <span style={NAME_STYLE}>{p.name || "Гость"}</span>
        </div>
      ))}
    </div>
  );
}
