import { useRef, useState, useEffect } from "react";
import { db, ref, push, onValue, remove, get } from "../services/firebase";

interface ChatMessage {
  name: string;
  text: string;
  timestamp: number;
  playerId?: string;
}

const CHAT_ARCHIVE_KEY = "chat-archive";
const CHAT_LIMIT = 15;

export async function deleteUserMessages(playerId: string) {
  const chatRef = ref(db, "chat");
  const snap = await get(chatRef);
  const data = snap.val() || {};
  for (const [key, msg] of Object.entries(data)) {
    if ((msg as any).playerId === playerId) {
      await remove(ref(db, `chat/${key}`));
    }
  }
}

export default function Chat({
  disabled = false,
  name = "Гость",
  playerId,
  setIsInputActive,
}: {
  disabled?: boolean;
  name?: string;
  playerId?: string;
  setIsInputActive?: (active: boolean) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // При загрузке — подгружаем архив, если есть
  useEffect(() => {
    const archiveRaw = localStorage.getItem(CHAT_ARCHIVE_KEY);
    let archive: ChatMessage[] = [];
    if (archiveRaw) {
      try {
        archive = JSON.parse(archiveRaw);
      } catch {}
    }
    setMessages(archive);
  }, []);

  // Реалтайм-обновление из Firebase
  useEffect(() => {
    const chatRef = ref(db, "chat");
    const unsubscribe = onValue(chatRef, (snapshot) => {
      let arr = Object.values(snapshot.val() || {}) as ChatMessage[];
      arr.sort((a, b) => a.timestamp - b.timestamp);
      // Только последние CHAT_LIMIT
      if (arr.length > CHAT_LIMIT) {
        const archive = arr.slice(0, arr.length - CHAT_LIMIT);
        localStorage.setItem(CHAT_ARCHIVE_KEY, JSON.stringify(archive));
        arr = arr.slice(-CHAT_LIMIT);
      }
      setMessages(arr);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const chatRef = ref(db, "chat");
      push(chatRef, {
        name: name || "Гость",
        text: input,
        timestamp: Date.now(),
        playerId: playerId || undefined,
      });
      setInput("");
    }
  };

  return (
    <div className="w-full max-w-xl bg-white border border-blue-100 rounded-xl shadow p-4 mt-6 flex flex-col h-64">
      <div className="flex-1 overflow-y-auto mb-2 pr-1">
        {messages.length === 0 && (
          <div className="text-gray-400 text-sm text-center mt-8">
            Нет сообщений
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = playerId && msg.playerId === playerId;
          return (
            <div
              key={i}
              className={`flex mb-1 ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm break-words shadow-sm ${
                  isMe
                    ? "bg-blue-100 text-blue-900 rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <span
                  className={`block font-semibold text-xs mb-0.5 ${isMe ? "text-blue-500 text-right" : "text-gray-500 text-left"}`}
                >
                  {msg.name}
                </span>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          placeholder={
            disabled ? "Войдите, чтобы писать в чат" : "Введите сообщение..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          disabled={disabled}
          maxLength={200}
          onFocus={() => setIsInputActive && setIsInputActive(true)}
          onBlur={() => setIsInputActive && setIsInputActive(false)}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition disabled:bg-gray-300"
          disabled={disabled || !input.trim()}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
