import { WindowControls } from '#components'
import WindowWrapper from '#hoc/windowWrapper'
import React, { useEffect, useRef, useState } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2
} from 'lucide-react'
import { musicList } from '#constants/musicList'

const Music = () => {
  const audioRef = useRef(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)

  const currentTrack = musicList[currentIndex]

  useEffect(() => {
    audioRef.current.volume = volume
    if (isPlaying) audioRef.current.play()
  }, [currentIndex])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % musicList.length)
    setIsPlaying(true)
  }

  const prevTrack = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? musicList.length - 1 : prev - 1
    )
    setIsPlaying(true)
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    const percent = (audio.currentTime / audio.duration) * 100
    setProgress(percent || 0)
  }

  const handleVolume = (e) => {
    const vol = Number(e.target.value)
    setVolume(vol)
    audioRef.current.volume = vol
  }

  return (
    <>
      {/* ---------- Header ---------- */}
      <div className="window-header">
        <WindowControls target="music" />
        <h2>Apple Music</h2>
      </div>

      {/* ---------- Body ---------- */}
        <div className="music-body music ">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Library</h3>
          <ul>
            {musicList.map((track, index) => (
              <li
                key={track.id}
                className={index === currentIndex ? 'active' : ''}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsPlaying(true)
                }}
              >
                {track.title}
              </li>
            ))}
          </ul>
        </aside>

        {/* Player */}
        <div className="player">
          {/* Track Info */}
          <div className="track-info">
            <img src={currentTrack.cover} alt={currentTrack.title} />

            <div className="meta">
              <h3>{currentTrack.title}</h3>
              <p>{currentTrack.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="buttons">
              <button onClick={prevTrack}>
                <SkipBack />
              </button>

              <button className="play-btn" onClick={togglePlay}>
                {isPlaying ? <Pause /> : <Play />}
              </button>

              <button onClick={nextTrack}>
                <SkipForward />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="progress">
            <div className="bar">
              <div
                className="fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Volume */}
          <div className="volume">
            <Volume2 />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
            />
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={nextTrack}
        onTimeUpdate={handleTimeUpdate}
      />
    </>
  )
}

const MusicWindow = WindowWrapper(Music, 'music')
export default MusicWindow
