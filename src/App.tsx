import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import GameField from "./components/GameField";
import { db, ref, set, onDisconnect, remove } from "./services/firebase";

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 600;

function App() {
  const [playerId] = useState(uuidv4());
  const [color] = useState(
    `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  );
  const [position, setPosition] = useState({
    x: FIELD_WIDTH / 2,
    y: FIELD_HEIGHT / 2,
  });
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    const playerRef = ref(db, `players/${playerId}`);
    // Создаём игрока только если его ещё нет (или просто один раз)
    set(playerRef, { id: playerId, x: position.x, y: position.y, color, name });
    onDisconnect(playerRef).remove();
    return () => {
      remove(playerRef);
    };
    // УБРАТЬ position из зависимостей!
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#181818",
        }}
      >
        <h1 style={{ color: "#fff" }}>2D Онлайн Игра</h1>
        <input
          type="text"
          placeholder="Введите никнейм"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: 10,
            fontSize: 18,
            borderRadius: 6,
            border: "1px solid #333",
            marginBottom: 16,
          }}
        />
        <button
          onClick={() => name.trim() && setLoggedIn(true)}
          style={{
            padding: "10px 24px",
            fontSize: 18,
            borderRadius: 6,
            background: "#4f8cff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Войти
        </button>
      </div>
    );
  }

  return (
    <GameField
      playerId={playerId}
      color={color}
      position={position}
      setPosition={setPosition}
      name={name}
    />
  );
}

export default App;
