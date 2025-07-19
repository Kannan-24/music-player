import type { Song } from "@/types/music"

// Helper to convert "MM:SS" to total seconds
const parseDurationToSeconds = (durationString: string): number => {
  const [min, sec] = durationString.split(":").map(Number)
  return isNaN(min) || isNaN(sec) ? 0 : min * 60 + sec
}

export const musicData: Song[] = [
  {
    id: "1",
    title: "Starboy",
    artistName: "The Weeknd",
    thumbnail: "/image/image-1.png",
    musicUrl: "/music/Starboy.mp3",
    duration: parseDurationToSeconds("3:47"),
    backgroundGradient: "linear-gradient(to bottom, #3B1F1F, #1C1C1C)",
    textColor: "#FFE4E1", // Light rose for warm dark red background
  },
  {
    id: "2",
    title: "Demons",
    artistName: "Imagine Dragons",
    thumbnail: "/image/image-2.png",
    musicUrl: "/music/demons.mp3",
    duration: parseDurationToSeconds("5:18"),
    backgroundGradient: "linear-gradient(to bottom, #243447, #121212)",
    textColor: "#D0EFFF", // Pale blue for cold dark background
  },
  {
    id: "3",
    title: "Mouth of the river",
    artistName: "Imagine Dragons",
    thumbnail: "/image/image-3.png",
    musicUrl: "/music/mouth-of-the-river.mp3",
    duration: parseDurationToSeconds("3:41"),
    backgroundGradient: "linear-gradient(to bottom, #2D4631, #151515)",
    textColor: "#DFFFE2", // Soft mint for deep green-black
  },
  {
    id: "4",
    title: "Ghost Stories",
    artistName: "Coldplay",
    thumbnail: "/image/image-4.png",
    musicUrl: "/music/ghost-stories.mp3",
    duration: parseDurationToSeconds("4:14"),
    backgroundGradient: "linear-gradient(to bottom, #3E2A4E, #1A1A1A)",
    textColor: "#F3E5F5", // Lavender tint for rich purple background
  },
  {
    id: "5",
    title: "Sparks",
    artistName: "Coldplay",
    thumbnail: "/image/image-5.png",
    musicUrl: "/music/sparks.mp3",
    duration: parseDurationToSeconds("3:47"),
    backgroundGradient: "linear-gradient(to bottom, #402737, #1B1B1B)",
    textColor: "#F8E0EB", // Very light pink-purple for contrast
  },
  {
    id: "6",
    title: "Viva La Vida",
    artistName: "Coldplay",
    thumbnail: "/image/image-6.png",
    musicUrl: "/music/viva-la-vida.mp3",
    duration: parseDurationToSeconds("4:02"),
    backgroundGradient: "linear-gradient(to bottom, #4A3622, #1E1E1E)",
    textColor: "#FFF9C4", // Soft yellow cream on coffee brown
  },
  {
    id: "7",
    title: "Hymn for the weekend",
    artistName: "Coldplay",
    thumbnail: "/image/image-7.png",
    musicUrl: "/music/hymn-for-the-weekend.mp3",
    duration: parseDurationToSeconds("4:18"),
    backgroundGradient: "linear-gradient(to bottom, #342244, #1A1A1A)",
    textColor: "#E1CFFF", // Pale lilac for muted violet bg
  },
  {
    id: "8",
    title: "Pain",
    artistName: "Ryan Jones",
    thumbnail: "/image/image-8.png",
    musicUrl: "/music/adventure-of-a-lifetime.mp3",
    duration: parseDurationToSeconds("4:23"),
    backgroundGradient: "linear-gradient(to bottom, #502020, #2A2A2A)",
    textColor: "#FFE8DC", // Creamy peach for dark maroon background
  },
]
