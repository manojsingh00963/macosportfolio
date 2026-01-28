import React, { useState, useEffect, useRef, useMemo } from "react";
import { WindowControls } from "#components";
import WindowWrapper from "#hoc/windowWrapper.jsx";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share,
  Trash2,
  Info,
  LayoutGrid,
  Clock,
  Star,
  Film,
  Play,
  Loader2,
} from "lucide-react";
import { gallery as initialGallery } from "#constants";
import useWindowStore from "#store/window";

/* ---------- Media Renderer Utility (Handles Image & Video) ---------- */
const MediaRenderer = ({
  item,
  className,
  controls = false,
  autoPlay = false,
}) => {
  const isVideo = item.img.match(/\.(mp4|webm|ogg|mov)$/i);
  if (isVideo) {
    return (
      <video
        src={item.img}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        muted={!controls}
        loop
        playsInline
      />
    );
  }
  return (
    <img src={item.img} alt={item.id} className={className} loading="lazy" />
  );
};

const ITEMS_PER_PAGE = 15;

const Gallery = () => {
  const { windows } = useWindowStore();
  const isMaximized = windows["gallery"]?.isMaximized;

  const [items, setItems] = useState(initialGallery);
  const [activeMedia, setActiveMedia] = useState(null);
  const [selectedTab, setSelectedTab] = useState("All Photos");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const galleryRef = useRef(null);
  const observerTarget = useRef(null);

  /* ---------- Drag-to-Scroll State ---------- */
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  /* ---------- Filtering Logic ---------- */
  const filteredGallery = useMemo(() => {
    switch (selectedTab) {
      case "Videos":
        return items.filter((item) => item.img.match(/\.(mp4|webm|ogg|mov)$/i));
      case "Favorites":
        return items.filter((item) => item.isFavorite);
      case "Recent":
        return [...items].reverse().slice(0, 12);
      default:
        return items;
    }
  }, [selectedTab, items]);

  const visibleItems = useMemo(() => {
    return filteredGallery.slice(0, visibleCount);
  }, [filteredGallery, visibleCount]);

  /* ---------- Infinite Scroll Observer ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredGallery.length
        ) {
          // Simulate loading delay
          setTimeout(
            () => setVisibleCount((prev) => prev + ITEMS_PER_PAGE),
            400,
          );
        }
      },
      { threshold: 0.1 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredGallery.length]);

  // Reset page count when switching tabs
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedTab]);

  /* ---------- Actions & Navigation ---------- */
  const deleteMedia = (id) => {
    setItems((prev) => prev.filter((m) => m.id !== id));
    setActiveMedia(null);
  };

  const toggleFavorite = (id) => {
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m)),
    );
  };

  const navigateMedia = (direction) => {
    if (!activeMedia) return;
    const currentIndex = filteredGallery.findIndex(
      (m) => m.id === activeMedia.id,
    );
    const nextIndex =
      (currentIndex + direction + filteredGallery.length) %
      filteredGallery.length;
    setActiveMedia(filteredGallery[nextIndex]);
  };

  /* ---------- Event Handlers ---------- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveMedia(null);
      if (activeMedia) {
        if (e.key === "ArrowRight") navigateMedia(1);
        if (e.key === "ArrowLeft") navigateMedia(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMedia]);

  const onMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    isDragging.current = true;
    startY.current = e.pageY - galleryRef.current.offsetTop;
    scrollTop.current = galleryRef.current.scrollTop;
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const y = e.pageY - galleryRef.current.offsetTop;
    const walk = (y - startY.current) * 1.5;
    galleryRef.current.scrollTop = scrollTop.current - walk;
  };

  return (
    <>
      <div className="window-header">
        <WindowControls target="gallery" />
      </div>

      <div
        className={`
        flex rounded-b-2xl flex-col bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white font-sans overflow-hidden transition-all duration-500
        ${isMaximized ? "w-screen h-screen rounded-none" : "w-[65vw] h-[80vh]"}
      `}
      >
        {/* macOS Style Top Toolbar */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#2d2d2d]/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-[13px] font-medium opacity-60">
              {["Photos", "For You", "Albums"].map((t) => (
                <span key={t} className="hover:text-blue-500 cursor-default">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-[13px] font-bold">
            Gallery
          </h2>
          <div className="flex items-center gap-4 opacity-60">
            <Share size={15} className="cursor-pointer hover:opacity-100" />
            <Heart size={15} className="cursor-pointer hover:opacity-100" />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar */}
          <aside className="w-52 border-r border-gray-200 dark:border-white/10 p-4 hidden md:block bg-[#f5f5f7]/50 dark:bg-transparent">
            <section className="space-y-1">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-2 tracking-widest">
                Library
              </h3>
              <SidebarButton
                active={selectedTab === "All Photos"}
                onClick={() => setSelectedTab("All Photos")}
                icon={<LayoutGrid size={16} />}
                label="All Photos"
              />
              <SidebarButton
                active={selectedTab === "Recent"}
                onClick={() => setSelectedTab("Recent")}
                icon={<Clock size={16} />}
                label="Recent"
              />
              <SidebarButton
                active={selectedTab === "Favorites"}
                onClick={() => setSelectedTab("Favorites")}
                icon={<Star size={16} />}
                label="Favorites"
              />
              <SidebarButton
                active={selectedTab === "Videos"}
                onClick={() => setSelectedTab("Videos")}
                icon={<Film size={16} />}
                label="Videos"
              />
            </section>
          </aside>

          {/* Main Grid Content */}
          <main
            ref={galleryRef}
            className="flex-1 h-[90vh] overflow-y-auto p-8 select-none active:cursor-grabbing"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={() => (isDragging.current = false)}
            onMouseLeave={() => (isDragging.current = false)}
          >
            <header className="mb-8 flex items-center justify-between ">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {selectedTab}
                </h1>
                <p className="text-sm opacity-40">
                  {filteredGallery.length} images
                </p>
              </div>
              <p>{new Date().toLocaleDateString()}</p>
            </header>

            {visibleItems.length > 0 ? (
              <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveMedia(item)}
                    className="mb-4 break-inside-avoid relative cursor-pointer overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/5 group shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <MediaRenderer
                      item={item}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {item.img.match(/\.(mp4|webm)$/i) && (
                      <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md p-2 rounded-full text-white">
                        <Play size={12} fill="white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center opacity-20">
                <LayoutGrid size={48} />
                <p className="mt-4 font-medium">Empty Folder</p>
              </div>
            )}

            {/* Sentinel for Infinite Scroll */}
            <div
              ref={observerTarget}
              className="h-20 flex items-center justify-center w-full"
            >
              {visibleCount < filteredGallery.length && (
                <Loader2
                  className="animate-spin opacity-30 text-blue-500"
                  size={24}
                />
              )}
            </div>
          </main>
        </div>

        {/* --- Quick Look Glass Modal --- */}
        {activeMedia && (
          <div className="absolute rounded bg-white/40 dark:bg-black/40  inset-0 z-[100]  flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
            {/* backdrop-blur-3xl */}
            {/* Transparent Glass Background */}
            <div
              className="absolute rounded inset-0 bg-black/80 dark:bg-black/40 "
              // backdrop-blur-3xl
              onClick={() => setActiveMedia(null)}
            />

            <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
              {/* Floating macOS Pill Toolbar */}
              <div className="absolute top-0 w-full flex justify-between items-center p-4">
                <button
                  onClick={() => setActiveMedia(null)}
                  className="p-2.5 cursor-pointer bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-lg transition-all"
                >
                  <X size={18} />
                </button>

                <div className="flex gap-4 p-2 bg-white/30 dark:bg-black/30 backdrop-blur-2xl rounded-full border border-white/20 shadow-2xl">
                  <Heart
                    size={18}
                    onClick={() => toggleFavorite(activeMedia.id)}
                    className={`cursor-pointer hover:text-green-600 hover:fill-green-600 transition-all ${activeMedia.isFavorite ? "text-red-500 fill-red-500" : "hover:scale-110"}`}
                  />
                  <Trash2
                    size={18}
                    onClick={() => deleteMedia(activeMedia.id)}
                    className="cursor-pointer hover:text-red-500 transition-all hover:scale-110"
                  />
                  <Info
                    size={18}
                    className="cursor-pointer hover:opacity-60 transition-all hover:scale-110 hover:text-blue-500 "
                  />
                </div>
                <div className="w-10" />
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateMedia(-1);
                }}
                className="absolute cursor-pointer left-4 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-all hover:scale-110 active:scale-90"
              >
                <ChevronLeft size={32} />
              </button>

              <div className="w-full h-[80%] flex items-center justify-center p-4">
                <MediaRenderer
                  item={activeMedia}
                  controls
                  autoPlay
                  className="max-w-full cursor-crosshair max-h-full object-contain rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-8 duration-500"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateMedia(1);
                }}
                className="absolute cursor-pointer right-4 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-all hover:scale-110 active:scale-90"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/* Sidebar Button Component */
const SidebarButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex w-full cursor-pointer items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
      active
        ? "bg-gray-600 text-white shadow-lg"
        : "hover:bg-gray-200 dark:hover:bg-white/10 opacity-70"
    }`}
  >
    {icon} {label}
  </button>
);

export default WindowWrapper(Gallery, "gallery");
