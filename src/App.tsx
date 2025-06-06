import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import GameField from "./components/GameField";
import { db, ref, set, onDisconnect, remove } from "./services/firebase";
import Chat from "./components/Chat";

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 600;

function App() {
  // Читаем из localStorage
  const [playerId] = useState(
    () => localStorage.getItem("playerId") || uuidv4(),
  );
  const [color] = useState(
    () =>
      localStorage.getItem("playerColor") ||
      `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  );
  const [position, setPosition] = useState({
    x: FIELD_WIDTH / 2,
    y: FIELD_HEIGHT / 2,
  });
  const [name, setName] = useState(
    () => localStorage.getItem("playerName") || "",
  );
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("loggedIn") === "true",
  );

  // Сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem("playerId", playerId);
    localStorage.setItem("playerColor", color);
    localStorage.setItem("playerName", name);
    localStorage.setItem("loggedIn", loggedIn ? "true" : "false");
  }, [playerId, color, name, loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;
    const playerRef = ref(db, `players/${playerId}`);
    set(playerRef, { id: playerId, x: position.x, y: position.y, color, name });
    onDisconnect(playerRef).remove();
    return () => {
      remove(playerRef);
    };
  }, [loggedIn]);

  // Кнопка выхода
  const handleLogout = () => {
    localStorage.removeItem("playerId");
    localStorage.removeItem("playerColor");
    localStorage.removeItem("playerName");
    localStorage.removeItem("loggedIn");
    setName("");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-yellow from-sky-50 to-blue-100">
        <div className="flex flex-1 justify-center">
          <div className="shadow-2xl rounded-2xl bg-white p-4 m-8 flex items-center border border-blue-100">
            <GameField
              playerId={"readonly"}
              color={"#b3c6ff"}
              position={{ x: 400, y: 300 }}
              setPosition={() => {}}
              name={"Demo"}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center min-w-[320px] p-8 bg-white rounded-2xl shadow-2xl m-8 border border-blue-100">
          <h1 className="text-blue-700 text-4xl font-bold mb-4 tracking-wide drop-shadow">
            2D Online Game
          </h1>
          <p className="text-gray-700 text-lg mb-8 text-center">
            Добро пожаловать!
            <br />
            Двигайся по полю, используй wasd.
            <br />
            <span className="text-blue-500 font-semibold">
              Введи ник и начни играть!
            </span>
          </p>
          <input
            type="text"
            placeholder="Введите никнейм"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 text-lg rounded-lg border border-blue-300 mb-5 bg-blue-50 text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 w-72 shadow-sm"
            autoFocus
            maxLength={20}
          />
          <button
            onClick={() => name.trim() && setLoggedIn(true)}
            className="px-8 py-3 text-lg rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition"
          >
            Начать игру
          </button>
          <Chat disabled name={name} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="flex flex-1 justify-center">
        <div className="shadow-2xl rounded-2xl bg-white p-4 m-8 flex items-center border border-blue-100">
          <GameField
            playerId={playerId}
            color={color}
            position={position}
            setPosition={setPosition}
            name={name}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center min-w-[320px] p-8 bg-white rounded-2xl shadow-2xl m-8 border border-blue-100">
        <h2 className="text-blue-700 text-2xl font-bold mb-2">
          Приятной игры, <span className="text-blue-500">{name}</span>!
        </h2>
        <p className="text-gray-700 text-lg mb-4 text-center">
          Используй стрелки для движения.
          <br />
          Видишь других игроков? Поздоровайся!
        </p>
        <div className="mt-4 text-sm text-gray-400">
          ID: <span className="font-mono">{playerId.slice(0, 8)}</span>
        </div>
        <button
          onClick={handleLogout}
          className="mt-8 px-6 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-semibold shadow transition"
        >
          Выйти
        </button>
        <Chat name={name} />
      </div>
    </div>
  );
}

export default App;
