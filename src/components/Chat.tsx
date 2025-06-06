import { useRef, useState, useEffect } from "react";

export default function Chat({ disabled = false }: { disabled?: boolean }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages((msgs) => [...msgs, input]);
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
        {messages.map((msg, i) => (
          <div key={i} className="text-gray-800 text-sm mb-1 break-words">
            {msg}
          </div>
        ))}
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
