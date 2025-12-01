import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
// import useMusic from "../hooks/useMusic";
const MusicContext = createContext()
const songs = [
    {
        id: 1,
        title: "Keep You Away",
        artist: "EchoBR",
        url: "/songs/Keep You Away.wav",
        duration: "4:32",
    },
    {
        id: 2,
        title: "Breaching",
        artist: "EchoBR",
        url: "/songs/Breaching.wav",
        duration: "3:45",
    },
    {
        id: 3,
        title: "Forgotten Memories",
        artist: "EchoBR",
        url: "/songs/Forgotten Memories.wav",
        duration: "3:12",
    },

    {
        id: 4,
        title: "Glacier Blue",
        artist: "EchoBR",
        url: "/songs/Glacier Blue.wav",
        duration: "3:28",
    },
    {
        id: 5,
        title: "In Love",
        artist: "EchoBR",
        url: "/songs/In Love.wav",
        duration: "3:15",
    }

]
export const MusicProvider = ({ children }) => {


    const [allsongs, setAllsongs] = useState(songs)
    const [currentTrack, setCurrentTrack] = useState(songs[0])
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(1)
    const [playlists, setPlaylists] = useState([])

    useEffect(()=>{
        const savedPlaylists = localStorage.getItem("musicPlayerPlaylists")
        if(savedPlaylists){
            const playlists = JSON.parse(savedPlaylists)
            setPlaylists(playlists)
        }
    },[])


    useEffect(()=>{
        if(playlists.length > 0){
            localStorage.setItem("musicPlayerPlaylists" , JSON.stringify(playlists))
        }
        else{
            localStorage.removeItem("musicPlayerPlaylists")
        }
    },[playlists])


    const handlePlaySong = (song, index) => {
        setCurrentTrack(song)
        setCurrentTrackIndex(index)
        setIsPlaying(false)
    }

    const deletePlaylist = (playlistId)=>{
        setPlaylists((prev)=>prev.filter((playlist) => playlist.id != playlistId))
    }

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => {
            const nextIndex = (prev + 1) % allsongs.length
            setCurrentTrack(allsongs[nextIndex])
            return nextIndex
        })
        setIsPlaying(false)
    }


    const prevTrack = () => {
        setCurrentTrackIndex((prev) => {
            const nexIndex = prev === 0 ? allsongs.length - 1 : prev - 1
            setCurrentTrack(allsongs[nexIndex])
            return nexIndex
        })
        setIsPlaying(false)
    }


    const formatTime = (time) => {
        if (isNaN(time) || time === undefined) return "0:00"
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)

        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    const createPlaylist = (name)=>{
        const newPlaylist = {
            id : Date.now(),
            name,
            songs : []
        }
        setPlaylists((prev) =>[...prev , newPlaylist])
    }

    const addSongtoPlaylist=(playlistId , song)=>{
        setPlaylists((prev)=>prev.map((playlist)=>{
             if(playlist.id === playlistId){
                return{...playlist , songs : [...playlist.songs , song]}
             }
             else{
                return playlist
             }
        }))
    }

    const play = () => setIsPlaying(true)
    const pause = () => setIsPlaying(false)


    return (
        <MusicContext.Provider value={{ allsongs, handlePlaySong, currentTrack, setCurrentTrack, currentTrackIndex, setCurrentTime, currentTime, formatTime, duration, setDuration, nextTrack, prevTrack, play, pause, isPlaying, setIsPlaying, volume, setVolume,createPlaylist , playlists ,addSongtoPlaylist , deletePlaylist }}> {children}
        </MusicContext.Provider>
    )

}


export const useMusic = () => {
    const contextValue = useContext(MusicContext)
    if (!contextValue) {
        throw new Error("useMusic always inside the MusicProvider")
    }
    return contextValue
}