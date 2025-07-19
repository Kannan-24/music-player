export interface Song {
  id: string
  title: string
  thumbnail: string
  musicUrl: string
  duration: number // Duration is now a number (seconds)
  artistName: string
  backgroundGradient?: string // Optional property for background gradient
  textColor?: string // Optional property for text color
}

export interface PlayerState {
  currentSong: Song | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
}
