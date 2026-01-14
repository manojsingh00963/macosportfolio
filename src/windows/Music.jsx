import { WindowControls } from '#components'
import WindowWrapper from '#hoc/windowWrapper'
import React, { useEffect, useRef, useState } from 'react'
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Shuffle,
    Repeat,
    Minimize2
} from 'lucide-react'
import { musicList } from '#constants/musicList'

const Music = () => {
    const audioRef = useRef(null)

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const formatTime = (time = 0) => {
        if (isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }
  



    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(0.7)
    const [shuffle, setShuffle] = useState(false)
    const [repeat, setRepeat] = useState('off') // off | one | all
    const [miniPlayer, setMiniPlayer] = useState(false)

    const currentTrack = musicList[currentIndex]

    /* ---------- Media Session (Apple-like) ---------- */
    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artist,
                artwork: [{ src: currentTrack.cover, sizes: '512x512', type: 'image/png' }]
            })

            navigator.mediaSession.setActionHandler('play', togglePlay)
            navigator.mediaSession.setActionHandler('pause', togglePlay)
            navigator.mediaSession.setActionHandler('nexttrack', nextTrack)
            navigator.mediaSession.setActionHandler('previoustrack', prevTrack)
        }
    }, [currentIndex])

    /* ---------- Playback ---------- */
    useEffect(() => {
        audioRef.current.volume = volume
        if (isPlaying) audioRef.current.play()
    }, [currentIndex])

    const togglePlay = () => {
        if (isPlaying) audioRef.current.pause()
        else audioRef.current.play()
        setIsPlaying(!isPlaying)
    }

    const nextTrack = () => {
        if (shuffle) {
            setCurrentIndex(Math.floor(Math.random() * musicList.length))
        } else if (currentIndex < musicList.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else if (repeat === 'all') {
            setCurrentIndex(0)
        }
        setIsPlaying(true)
    }

    const prevTrack = () => {
        setCurrentIndex(currentIndex === 0 ? musicList.length - 1 : currentIndex - 1)
        setIsPlaying(true)
    }

    const handleEnd = () => {
        if (repeat === 'one') {
            audioRef.current.play()
        } else {
            nextTrack()
        }
    }

    /* ---------- Progress ---------- */
    const updateProgress = () => {
  const audio = audioRef.current
  setCurrentTime(audio.currentTime)
  setDuration(audio.duration || 0)
  setProgress((audio.currentTime / audio.duration) * 100 || 0)
}


    const seek = (e) => {
        const bar = e.currentTarget
        const percent = (e.nativeEvent.offsetX / bar.offsetWidth) * 100
        audioRef.current.currentTime = (percent / 100) * audioRef.current.duration
    }

    return (
        <div className={miniPlayer ? 'mini' : ''}>
            {/* Header */}
            <div className="window-header">
                <WindowControls target="music" />
                <h2>Apple Music</h2>

                <button onClick={() => setMiniPlayer(!miniPlayer)}>
                    <Minimize2 size={16} />
                </button>
            </div>

            {/* Body */}
            <div className="music-body">
                {/* Sidebar */}
                {!miniPlayer && (
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
                )}

                {/* Player */}
                <div className="player">
                    {/* Track */}
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
                            <button
                                className={shuffle ? 'active' : ''}
                                onClick={() => setShuffle(!shuffle)}
                            >
                                <Shuffle />
                            </button>

                            <button onClick={prevTrack}>
                                <SkipBack />
                            </button>

                            <button className="play-btn" onClick={togglePlay}>
                                {isPlaying ? <Pause /> : <Play />}
                            </button>

                            <button onClick={nextTrack}>
                                <SkipForward />
                            </button>

                            <button
                                className={repeat !== 'off' ? 'active' : ''}
                                onClick={() =>
                                    setRepeat(
                                        repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off'
                                    )
                                }
                            >
                                <Repeat />
                            </button>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="progress" onClick={seek}>
                        <div className="bar">
                            <div className="fill" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Time */}
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
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
                            onChange={(e) => {
                                setVolume(e.target.value)
                                audioRef.current.volume = e.target.value
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Audio */}
            <audio
                ref={audioRef}
                src={currentTrack.src}
                onTimeUpdate={updateProgress}
                onLoadedMetadata={updateProgress}
                onEnded={handleEnd}
            />
    

        </div>
    )
}

const MusicWindow = WindowWrapper(Music, 'music')
export default MusicWindow
