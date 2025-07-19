"use client"

import { MoreHorizontal, Play, Pause, Heart } from "lucide-react"
import { useState } from "react"
import type { Song } from "@/types/music"

interface SongListProps {
  songs: Song[]
  currentSong: Song | null
  onSongSelect: (song: Song) => void
  onToggleFavorite: (song: Song) => void
  favorites: Song[]
  isPlaying: boolean
}

export default function SongList({
  songs,
  currentSong,
  onSongSelect,
  onToggleFavorite,
  favorites,
  isPlaying,
}: SongListProps) {
  const [showDropdown, setShowDropdown] = useState<string | null>(null)

  const formatDuration = (durationInSeconds: number) => {
    if (isNaN(durationInSeconds) || durationInSeconds === 0) return "0:00"
    const minutes = Math.floor(durationInSeconds / 60)
    const seconds = Math.floor(durationInSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="song-list">
      {songs.map((song) => {
        const isCurrent = currentSong?.id === song.id
        const isFavorite = favorites.some((fav) => fav.id === song.id)

        return (
          <div key={song.id} className={`song-item ${isCurrent ? "active" : ""}`} onClick={() => onSongSelect(song)}>
            <div className="song-info">
              <div className="song-thumbnail">
                <img src={song.thumbnail || "/placeholder.svg"} alt={song.title} />
                <div className="play-overlay">{isCurrent && isPlaying ? <Pause size={16} /> : <Play size={16} />}</div>
              </div>
              <div className="song-details">
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artistName}</div>
              </div>
            </div>

            <div className="song-actions">
              <span className="song-duration">{formatDuration(song.duration)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
