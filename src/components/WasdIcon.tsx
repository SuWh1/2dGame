export default function ArrowKeysIcon() {
  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex justify-center">
        <div className="w-8 h-8 bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-xl font-bold text-gray-700 mx-1 shadow">
          ↑
        </div>
      </div>
      <div className="flex justify-center mt-1">
        <div className="w-8 h-8 bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-xl font-bold text-gray-700 mx-1 shadow">
          ←
        </div>
        <div className="w-8 h-8 bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-xl font-bold text-gray-700 mx-1 shadow">
          ↓
        </div>
        <div className="w-8 h-8 bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-xl font-bold text-gray-700 mx-1 shadow">
          →
        </div>
      </div>
    </div>
  );
}
