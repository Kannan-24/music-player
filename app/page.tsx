"use client"

import { useState, useEffect, useRef } from "react"
import Sidebar from "@/components/Sidebar"
import SearchBar from "@/components/SearchBar"
import SongList from "@/components/SongList"
import Player from "@/components/Player"
import type { Song } from "@/types/music"
import { musicData } from "@/data/musicData"
import { Menu } from "lucide-react" // Import Menu icon for hamburger button

export default function MusicPlayer() {
  const [songs] = useState<Song[]>(musicData)
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(musicData)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [activeTab, setActiveTab] = useState("For You")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<Song[]>([])
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [showFullScreenPlayer, setShowFullScreenPlayer] = useState(false)
  // Removed useAlternateBg state and its useEffect

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false)
        setShowFullScreenPlayer(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("musicPlayerFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    const savedRecentlyPlayed = sessionStorage.getItem("musicPlayerRecentlyPlayed")
    if (savedRecentlyPlayed) {
      setRecentlyPlayed(JSON.parse(savedRecentlyPlayed))
    }
  }, [])

  useEffect(() => {
    let filtered = songs

    if (searchQuery) {
      filtered = songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()))
    } else {
      switch (activeTab) {
        case "Favourites":
          filtered = favorites
          break
        case "Recently Played":
          filtered = recentlyPlayed
          break
        case "Top Tracks":
          filtered = songs.slice(0, 10)
          break
        default:
          filtered = songs
      }
    }

    setFilteredSongs(filtered)
  }, [searchQuery, activeTab, songs, favorites, recentlyPlayed])

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    if (isMobile) {
      setShowFullScreenPlayer(true)
    }

    const updatedRecentlyPlayed = [song, ...recentlyPlayed.filter((s) => s.id !== song.id)].slice(0, 10)
    setRecentlyPlayed(updatedRecentlyPlayed)
    sessionStorage.setItem("musicPlayerRecentlyPlayed", JSON.stringify(updatedRecentlyPlayed))
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleFavorite = (song: Song) => {
    const isFavorite = favorites.some((fav) => fav.id === song.id)
    let updatedFavorites

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id !== song.id)
    } else {
      updatedFavorites = [...favorites, song]
    }

    setFavorites(updatedFavorites)
    localStorage.setItem("musicPlayerFavorites", JSON.stringify(updatedFavorites))
  }

  const nextSong = () => {
    if (!currentSong) return
    const currentIndex = filteredSongs.findIndex((song) => song.id === currentSong.id)
    const nextIndex = (currentIndex + 1) % filteredSongs.length
    playSong(filteredSongs[nextIndex])
  }

  const previousSong = () => {
    if (!currentSong) return
    const currentIndex = filteredSongs.findIndex((song) => song.id === currentSong.id)
    const prevIndex = currentIndex === 0 ? filteredSongs.length - 1 : currentIndex - 1
    playSong(filteredSongs[prevIndex])
  }

  useEffect(() => {
    if (!currentSong && songs.length > 0) {
      setCurrentSong(songs[5]) // Set initial song
    }
  }, [songs, currentSong])

  return (
    <div
      className="music-player-app"
      style={{ background: currentSong?.backgroundGradient || "linear-gradient(to bottom, #201606, #000000)" }}
    >
      {isMobile && (
        <button className="mobile-menu-button" onClick={() => setShowMobileSidebar(true)}>
          <Menu size={24} />
        </button>
      )}
      <div className="app-layout">
        {isMobile && showMobileSidebar && (
          <div className="mobile-overlay is-active" onClick={() => setShowMobileSidebar(false)} />
        )}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={showMobileSidebar}
          onClose={() => setShowMobileSidebar(false)}
          isMobile={isMobile} // Pass isMobile prop
        />

        <div className="main-section">
          <div className="main-header">
            <h1 className="section-title">{activeTab}</h1>
          </div>
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          <SongList
            songs={filteredSongs}
            currentSong={currentSong}
            onSongSelect={playSong}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
            isPlaying={isPlaying}
          />
        </div>

        {currentSong &&
          !isMobile && ( // Render desktop player only if not mobile
            <Player
              currentSong={currentSong}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              onPlayPause={togglePlayPause}
              onNext={nextSong}
              onPrevious={previousSong}
              onSeek={setCurrentTime}
              onVolumeChange={setVolume}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.some((fav) => fav.id === currentSong.id)}
              audioRef={audioRef}
              setCurrentTime={setCurrentTime}
              setDuration={setDuration}
            />
          )}
      </div>
      {/* Full-screen mobile player */}
      {currentSong && isMobile && showFullScreenPlayer && (
        <div className="mobile-full-screen-player">
          <Player
            currentSong={currentSong}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            onPlayPause={togglePlayPause}
            onNext={nextSong}
            onPrevious={previousSong}
            onSeek={setCurrentTime}
            onVolumeChange={setVolume}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.some((fav) => fav.id === currentSong.id)}
            audioRef={audioRef}
            setCurrentTime={setCurrentTime}
            setDuration={setDuration}
            isFullScreenMobile={true} // Indicate full-screen mobile mode
            onCloseFullScreen={() => setShowFullScreenPlayer(false)} // Pass close handler
          />
        </div>
      )}
      <audio ref={audioRef} crossOrigin="anonymous" />
    </div>
  )
}
