import React, { useState, useEffect } from 'react';
import { WindowControls } from '#components';
import WindowWrapper from '#hoc/windowWrapper.jsx';
import { X } from 'lucide-react';

/* Replace with your real images */
const images = [
  { id: 1, src: '/gallery/1.jpg', title: 'Project One' },
  { id: 2, src: '/gallery/2.jpg', title: 'Project Two' },
  { id: 3, src: '/gallery/3.jpg', title: 'Landing Page' },
  { id: 4, src: '/gallery/4.jpg', title: 'Dashboard UI' },
  { id: 5, src: '/gallery/5.jpg', title: 'Mobile Design' },
  { id: 6, src: '/gallery/6.jpg', title: 'Animation Test' },
];

const Gallery = () => {
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setActiveImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Window Header */}
      <div className="window-header">
        <WindowControls target="gallery" />
        <h2 className="text-sm font-medium">Gallery</h2>
      </div>

      {/* Window Content */}
      <div className="p-4 h-full overflow-auto bg-[#f5f5f7] dark:bg-[#1c1c1e]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => setActiveImage(img)}
              className="group relative cursor-pointer rounded-xl overflow-hidden bg-black shadow-sm"
            >
              <img
                src={img.src}
                alt={img.title}
                className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                <span className="text-xs text-white">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {activeImage && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="relative max-w-3xl w-full p-4">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-3 -right-3 bg-white dark:bg-black rounded-full p-1 shadow"
            >
              <X size={18} />
            </button>
            <img
              src={activeImage.src}
              alt={activeImage.title}
              className="rounded-xl w-full max-h-[80vh] object-contain"
            />
            <p className="text-center text-sm text-white mt-3">
              {activeImage.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

const GalleryWindow = WindowWrapper(Gallery, 'gallery');
export default GalleryWindow;
