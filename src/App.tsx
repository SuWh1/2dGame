import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import GameField from "./components/GameField";
import { db, ref, set, onDisconnect, remove } from "./services/firebase";
import Chat, { deleteUserMessages } from "./components/Chat";
import ArrowKeysIcon from "./components/WasdIcon";

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 600;

function App() {
  // Читаем из localStorage
  const [playerId] = useState(() => uuidv4());
  const [color] = useState(
    () => `#${Math.floor(Math.random() * 16777215).toString(16)}`,
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
    set(playerRef, { id: playerId, x: position.x, y: position.y, color, name });
    onDisconnect(playerRef).remove();
    return () => {
      remove(playerRef);
    };
  }, [loggedIn]);

  // Кнопка выхода
  const handleLogout = async () => {
    await deleteUserMessages(playerId);
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
          <p className="grid text-gray-700 text-lg text-center">
            Добро пожаловать!
            <span className="text-blue-500 font-semibold mt-8">
              Введи ник и начни играть!
            </span>
          </p>
          <input
            type="text"
            placeholder="Введите никнейм"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 text-lg rounded-lg border border-blue-300 mb-5 mt-2 bg-blue-50 text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 w-72 shadow-sm"
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
        <div className="flex flex-col items-center mb-2 mt-4">
          <ArrowKeysIcon />
          <span className="text-gray-500 text-xs mt-2">
            Двигайся по полю с помощью стрелок
          </span>
        </div>
        <div className="mt-6 text-sm text-gray-400">
          ID: <span className="font-mono">{playerId.slice(0, 8)}</span>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 px-6 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-semibold shadow transition"
        >
          Выйти
        </button>
        <p className="text-gray-700 text-lg mt-10 text-center">
          Поздоровайся в чате!
        </p>
        <Chat name={name} playerId={playerId} />
      </div>
    </div>
  );
}

export default App;
