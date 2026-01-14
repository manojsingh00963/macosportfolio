import React, { useState, useEffect, useRef } from 'react';
import { WindowControls } from '#components';
import WindowWrapper from '#hoc/windowWrapper.jsx';
import { X, ChevronLeft, ChevronRight, Heart, Share, Trash2, Info } from 'lucide-react';
import { gallery } from '#constants';
import useWindowStore from '#store/window';

const Gallery = () => {

  const { windows } = useWindowStore();
  const isMaximized = windows['gallery']?.isMaximized;
  const [activeImage, setActiveImage] = useState(null);
  const [selectedTab, setSelectedTab] = useState('All Photos');
  const galleryRef = useRef(null);

  // Drag-to-scroll state
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveImage(null);
      if (activeImage) {
        if (e.key === 'ArrowRight') navigateImage(1);
        if (e.key === 'ArrowLeft') navigateImage(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);

  const navigateImage = (direction) => {
    const currentIndex = gallery.findIndex((img) => img.id === activeImage.id);
    const nextIndex = (currentIndex + direction + gallery.length) % gallery.length;
    setActiveImage(gallery[nextIndex]);
  };

  // Drag-to-scroll handlers
  const onMouseDown = (e) => {
    isDragging.current = true;
    startY.current = e.pageY - galleryRef.current.offsetTop;
    scrollTop.current = galleryRef.current.scrollTop;
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const y = e.pageY - galleryRef.current.offsetTop;
    const walk = (y - startY.current) * 1; // scroll speed
    galleryRef.current.scrollTop = scrollTop.current - walk;
  };
  const onMouseUp = () => {
    isDragging.current = false;
  };
  const onMouseLeave = () => {
    isDragging.current = false;
  };

  return (
    <>
      <div className="window-header">
        <WindowControls target="gallery" />
      </div>

      <div className={`
        flex rounded-b-2xl flex-col bg-white dark:bg-[#1e1e1e] text-[#1d1d1f] dark:text-white font-sans overflow-hidden transition-all duration-300
        ${isMaximized ? 'w-screen h-screen rounded-none' : 'w-[60vw] h-[80vh]'}
      `}>
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#2d2d2d]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-8">
            {/* <WindowControls target="gallery" /> */}
            <div className="flex gap-4 text-[13px] font-medium opacity-80">
              {['Photos', 'For You', 'Albums', 'Search'].map(tab => (
                <span key={tab} className="cursor-default hover:text-blue-500 transition-colors">{tab}</span>
              ))}
            </div>
          </div>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold">Gallery</h2>
          <div className="flex items-center gap-3 opacity-60">
            <Share size={16} />
            <Heart size={16} />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-48 border-r border-gray-200 dark:border-white/10 p-4 hidden md:block bg-[#f5f5f7]/50 dark:bg-transparent">
            <section className="space-y-1">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase px-2 mb-2">Photos</h3>
              {['All Photos', 'Recent', 'Favorites', 'Hidden'].map((item) => (
                <div
                  key={item}
                  onClick={() => setSelectedTab(item)}
                  className={`px-2 py-1.5 rounded-md text-[13px] cursor-default ${selectedTab === item ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                >
                  {item}
                </div>
              ))}
            </section>
          </aside>

          {/* Main Grid */}
          <main
            ref={galleryRef}
            className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            <header className="mb-4">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">{selectedTab}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">January 2026</p>
            </header>

            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveImage(item)}
                  className="mb-2 break-inside-avoid relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5 shadow-sm group hover:shadow-lg transition"
                >
                  <img
                    src={item.img}
                    alt={item.id}
                    className="w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* Quick Look Modal */}
        {activeImage && (
          <div className="absolute rounded-2xl inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
            <div
              className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-2xl"
              onClick={() => setActiveImage(null)}
            />
            <div className="relative w-full max-w-4xl h-full flex flex-col items-center justify-center">
              <div className="absolute top-0 w-full flex justify-between items-center p-4">
                <button
                  onClick={() => setActiveImage(null)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
                >
                  <X size={20} />
                </button>
                <div className="flex gap-4 bg-gray-200/50 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <Heart size={18} className="cursor-pointer hover:text-red-500 transition" />
                  <Trash2 size={18} className="cursor-pointer hover:text-red-500 transition" />
                  <Info size={18} className="cursor-pointer" />
                </div>
                <div className="w-8" />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-90"
              >
                <ChevronLeft size={24} />
              </button>
              <img
                src={activeImage.img}
                alt="Preview"
                className="max-w-full max-h-[85%] object-contain shadow-2xl rounded-lg animate-in slide-in-from-bottom-4 duration-300"
              />
              <button
                onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-90"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const GalleryWindow = WindowWrapper(Gallery, 'gallery');
export default GalleryWindow;
