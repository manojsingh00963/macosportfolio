import React, { useEffect, useRef, useState } from 'react';
import { WindowControls } from '#components';
import WindowWrapper from '#hoc/windowWrapper';
import useWindowStore from '#store/window';

const Text = ({ headerRef }) => {
  const { windows } = useWindowStore();
  const data = windows.txtfile.data;

  const textareaRef = useRef(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (data) {
      setContent(data.description.join('\n\n'));
      textareaRef.current?.focus();
    }
  }, [data]);

  if (!data) return null;

  const { name, description = [] } = data;

  return (
    <div  className="flex flex-col h-full bg-[#fdf6d8] text-[#2e2e2e]">
      
      {/* Header */}
      <div ref={headerRef} className="window-header flex items-center gap-3 px-4 py-2 border-b border-black/10 bg-[#f7f0c8]">
        <WindowControls target="txtfile" />
        <h2 className="text-sm font-medium truncate select-none">
          {name || 'Note'}
        </h2>
      </div>

      {/* Note Area */}
      <div className="flex-1 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your note…"
          spellCheck={true}
          className="
            w-full h-full resize-none bg-transparent
            px-6 py-5 text-[15px] leading-relaxed
            outline-none font-[system-ui]
            placeholder:text-black/30
          "
        />
      </div>
    </div>
  );
};

const TextWindow = WindowWrapper(Text, 'txtfile');
export default TextWindow;
