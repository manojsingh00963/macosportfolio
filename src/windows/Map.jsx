import React, { useState } from 'react';
import { WindowControls } from '#components';
import WindowWrapper from '#hoc/windowWrapper.jsx';
import { MAP_LOCATION } from '#constants';

const Map = () => {
  const [activePlace, setActivePlace] = useState(null);

  return (
    <>
      {/* Window Header */}
      <div className="window-header">
        <WindowControls target="map" />
        <h2 className="text-sm font-medium">Map</h2>
      </div>

      {/* Window Content */}
      <div className="relative h-full w-full bg-[#e5e5ea] dark:bg-[#1c1c1e] overflow-hidden">

        {/* Fake Map Background (Apple Maps vibe) */}
        <div className="absolute inset-0 bg-[url('/images/map-bg.png')] bg-cover bg-center opacity-90" />

        {/* Pins */}
        {MAP_LOCATION.places.map((place) => (
          <button
            key={place.id}
            onClick={() => setActivePlace(place)}
            className={`absolute ${place.position} flex flex-col items-center`}
          >
            <img
              src={place.icon}
              alt={place.name}
              className="w-6 h-6 hover:scale-110 transition"
            />
          </button>
        ))}

        {/* Info Card */}
        {activePlace && (
          <div className="absolute bottom-4 left-4 right-4 max-w-sm bg-white dark:bg-[#2c2c2e] rounded-xl shadow-lg p-4">
            <h3 className="text-sm font-semibold">{activePlace.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {activePlace.description}
            </p>

            <button
              onClick={() => setActivePlace(null)}
              className="mt-3 text-xs px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
};


const MapWindow = WindowWrapper(Map, 'map');
export default MapWindow;
