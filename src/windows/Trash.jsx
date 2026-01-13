import React, { useState } from 'react';
import { WindowControls } from '#components';
import WindowWrapper from '#hoc/windowWrapper';
import { Trash2, RotateCcw } from 'lucide-react';
import { locations } from '#constants';

const Trash = () => {
  const [items, setItems] = useState(locations.children || []);

  const emptyTrash = () => {
    setItems([]);
  };

  const restoreItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* Window Header */}
      <div className="window-header">
        <WindowControls target="trash" />
        <h2 className="text-sm font-medium">Trash</h2>

        {items.length > 0 && (
          <button
            onClick={emptyTrash}
            className="ml-auto text-xs px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Empty Trash
          </button>
        )}
      </div>

      {/* Window Content */}
      <div className="relative p-4 h-full overflow-auto bg-[#f5f5f7] dark:bg-[#1c1c1e]">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <Trash2 size={48} className="mb-3 opacity-60" />
            <p className="text-sm">Trash is empty</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {items.map((item) => (
              <div
                key={item.id}
                className={`absolute ${item.position} flex flex-col items-center gap-1 group`}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-xs text-center max-w-[80px] truncate">
                  {item.name}
                </span>

                {/* Restore button (Finder-like hover action) */}
                <button
                  onClick={() => restoreItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-[10px] mt-1 px-2 py-[2px] rounded bg-gray-200 dark:bg-gray-700"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

/* ✅ Same wrapping pattern as Resume */
const TrashWindow = WindowWrapper(Trash, 'trash');
export default TrashWindow;
