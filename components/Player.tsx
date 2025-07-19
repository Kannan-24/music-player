"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Play, Pause, ChevronsRight, Volume2, VolumeX, MoreHorizontal, Heart, ChevronDown } from "lucide-react"
import type { Song } from "@/types/music"

interface PlayerProps {
  currentSong: Song
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  onToggleFavorite: (song: Song) => void
  isFavorite: boolean
  audioRef: React.RefObject<HTMLAudioElement>
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  isFullScreenMobile?: boolean // New prop for mobile full-screen mode
  onCloseFullScreen?: () => void // New prop for closing mobile full-screen player
}

export default function Player({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleFavorite,
  isFavorite,
  audioRef,
  setCurrentTime,
  setDuration,
  isFullScreenMobile = false, // Default to false
  onCloseFullScreen,
}: PlayerProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Only update src and load when the song changes, not on play/pause
    audio.pause()
    audio.src = currentSong.musicUrl
    audio.load()

    // Optionally, auto-play if isPlaying is true when song changes
    if (isPlaying) {
      const onCanPlay = () => {
        const playPromise = audio.play()
        if (playPromise !== undefined) playPromise.catch(() => {})
        audio.removeEventListener("canplay", onCanPlay)
      }
      audio.addEventListener("canplay", onCanPlay)
    }
  }, [currentSong, audioRef])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) playPromise.catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying, audioRef])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => onNext()

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [audioRef, setCurrentTime, setDuration, onNext])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume, audioRef])

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    onSeek(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const newLocal = (
    <button onClick={onPlayPause} className="play-btn">
      {isPlaying ? (
        <Pause size={20} color="#000" fill="#000" strokeWidth={1} />
      ) : (
        <Play size={20} color="#000" fill="#000" strokeWidth={1} />
      )}
    </button>
  )
  return (
    <div className="player-section">
      {isFullScreenMobile && (
        <div className="mobile-player-header">
          <button className="back-button" onClick={onCloseFullScreen}>
            <ChevronDown size={24} />
          </button>
          <span className="now-playing-text">Now Playing</span>
        </div>
      )}
      <div className="player-content">
        <div className="now-playing-header">
          <h2 className="song-title">{currentSong.title}</h2>
          <p className="artist-name">{currentSong.artistName}</p>
        </div>

        <div className="album-artwork">
          <img src={currentSong.thumbnail || "/placeholder.svg"} alt={currentSong.title} />
        </div>

        <div className="progress-container">
          <div className="progress-bar" onClick={handleSeek}>
            <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100 || 0}%` }} />
          </div>
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-controls">
          <div className="dropdown-container">
            <button className="control-btn" onClick={() => setShowDropdown(!showDropdown)}>
              <MoreHorizontal size={24} />
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button
                  onClick={() => {
                    onToggleFavorite(currentSong)
                    setShowDropdown(false)
                  }}
                  className="dropdown-item"
                >
                  <Heart size={16} className={isFavorite ? "favorite-active" : ""} />
                  {isFavorite ? "Remove from Favourites" : "Add to Favourites"}
                </button>
              </div>
            )}
          </div>

            <div className="main-controls">
            <button onClick={onPrevious} className="control-btn-1" aria-label="Previous">
             <svg width="17" height="17" viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.712 0.389371C21.9529 0.228605 22.233 0.136269 22.5223 0.122215C22.8117 0.108162 23.0994 0.172916 23.3548 0.309572C23.6102 0.446227 23.8237 0.649657 23.9726 0.898156C24.1214 1.14665 24.2 1.4309 24.2 1.72057V14.5206C24.2 14.8102 24.1214 15.0945 23.9726 15.343C23.8237 15.5915 23.6102 15.7949 23.3548 15.9316C23.0994 16.0682 22.8117 16.133 22.5223 16.1189C22.233 16.1049 21.9529 16.0125 21.712 15.8518L13 10.0438V14.5206C13 14.8102 12.9214 15.0945 12.7726 15.343C12.6237 15.5915 12.4102 15.7949 12.1548 15.9316C11.8994 16.0682 11.6117 16.133 11.3223 16.1189C11.033 16.1049 10.7529 16.0125 10.512 15.8518L0.911953 9.45177C0.692822 9.30565 0.513149 9.1077 0.388882 8.87548C0.264616 8.64326 0.199594 8.38395 0.199594 8.12057C0.199594 7.85719 0.264616 7.59788 0.388882 7.36566C0.513149 7.13344 0.692822 6.93549 0.911953 6.78937L10.512 0.389371C10.7529 0.228605 11.033 0.136269 11.3223 0.122215C11.6117 0.108162 11.8994 0.172916 12.1548 0.309572C12.4102 0.446227 12.6237 0.649657 12.7726 0.898156C12.9214 1.14665 13 1.4309 13 1.72057V6.19737L21.712 0.389371Z" fill="white"/>
              </svg>
            </button>

            <button onClick={onPlayPause} className="play-btn" aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
              ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              )}
            </button>

            <button onClick={onNext} className="control-btn-1" aria-label="Next">
              <svg width="17" height="17" viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.28802 0.389371C3.04706 0.228605 2.76697 0.136269 2.47764 0.122215C2.18832 0.108162 1.9006 0.172916 1.64519 0.309572C1.38979 0.446227 1.17627 0.649657 1.02742 0.898156C0.87857 1.14665 0.799975 1.4309 0.800018 1.72057V14.5206C0.799975 14.8102 0.87857 15.0945 1.02742 15.343C1.17627 15.5915 1.38979 15.7949 1.64519 15.9316C1.9006 16.0682 2.18832 16.133 2.47764 16.1189C2.76697 16.1049 3.04706 16.0125 3.28802 15.8518L12 10.0438V14.5206C12 14.8102 12.0786 15.0945 12.2274 15.343C12.3763 15.5915 12.5898 15.7949 12.8452 15.9316C13.1006 16.0682 13.3883 16.133 13.6776 16.1189C13.967 16.1049 14.2471 16.0125 14.488 15.8518L24.088 9.45177C24.3071 9.30565 24.4868 9.1077 24.6111 8.87548C24.7354 8.64326 24.8004 8.38395 24.8004 8.12057C24.8004 7.85719 24.7354 7.59788 24.6111 7.36566C24.4868 7.13344 24.3071 6.93549 24.088 6.78937L14.488 0.389371C14.2471 0.228605 13.967 0.136269 13.6776 0.122215C13.3883 0.108162 13.1006 0.172916 12.8452 0.309572C12.5898 0.446227 12.3763 0.649657 12.2274 0.898156C12.0786 1.14665 12 1.4309 12 1.72057V6.19737L3.28802 0.389371Z" fill="white"/>
              </svg>

            </button>
            </div>

          <button onClick={() => onVolumeChange(volume > 0 ? 0 : 1)} className="control-btn">
            {volume > 0 ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
      </div>
    </div>
  )
}
