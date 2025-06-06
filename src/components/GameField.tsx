import { usePlayerMovement } from "../hooks/usePlayerMovement";
import { useRealtimePlayers } from "../hooks/useRealtimePlayers";

type Position = { x: number; y: number };
type GameFieldProps = {
  playerId: string;
  color: string;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  name: string;
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
    <div className="relative w-[800px] h-[600px] bg-white border-2 border-blue-200 rounded-2xl shadow-xl overflow-hidden">
      {Object.values(players).map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full border ${p.id === playerId ? "border-blue-500 z-10" : "border-gray-300 z-0"}`}
          style={{
            left: p.x,
            top: p.y,
            width: 12,
            height: 12,
            backgroundColor: p.color,
          }}
        >
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 bg-gray-800 text-white rounded shadow pointer-events-none whitespace-nowrap">
            {p.name || "Гость"}
          </span>
        </div>
      ))}
    </div>
  );
}
