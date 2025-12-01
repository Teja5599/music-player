import React, { useEffect } from 'react'
import { useMusic } from '../contexts/MusicContext'
import { useRef } from 'react'
// import { MusicContext } from '../contexts/MusicContext'
const MusicPlayer = () => {
  const {
    currentTrack, formatTime, currentTime, setCurrentTime, duration, setDuration, nextTrack, prevTrack, play, pause, isPlaying, volume, setVolume
  } = useMusic()
  
  const audioRef = useRef(null)


  const handleTimeChange = (e) => {
    const audio = audioRef.current
    if (!audio) return
    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e) => {

    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
  }
  useEffect(() => {
    const audio = audioRef.current
    console.log(audio)
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => console.log(err))
    } else {
      audio.pause()
    }
  }, [isPlaying])


  useEffect(() => {
    const audio = audioRef.current
    console.log(audio)
    if (!audio) return;
    audio.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return;

    const handleLoadMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnd = () => {
      nextTrack()
    }

    audio.addEventListener("loadedmetadata", handleLoadMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("canplay", handleLoadMetadata)
    audio.addEventListener("ended", handleEnd)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("canplay", handleLoadMetadata)
      audio.addEventListener("ended", handleEnd)
    }
  }, [setDuration, currentTrack, setCurrentTime, nextTrack])


  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    setCurrentTime(0)
    setDuration(0)


  }, [setDuration, currentTrack, setCurrentTime])

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0
  return (
    <div className='music-player'>
      <audio ref={audioRef} src={currentTrack.url} preload='metadata' crossOrigin='anonymous' />
      <div className='track-info'>
        <h3 className='track-title'>
          {currentTrack.title}
        </h3>
        <p className='track-artist'>{currentTrack.artist}</p>

        <div className="progress-container">
          <span className='time'>{formatTime(currentTime)}</span>
          <input type="range" min="0" max={duration || 0} step={"0.1"} value={currentTime || 0} className='progress-bar'
            onChange={handleTimeChange}
            style={{ "--progress": `${progressPercentage}%` }}
          />
          <span className='time'> {formatTime(duration)}</span>
        </div>
        <div className="controls">
          <button className='control-btn' onClick={prevTrack}>⏮</button>
          <button className='control-btn play-btn'
            onClick={() => isPlaying ? pause() : play()}> {isPlaying ? "⏸" : "▶"}</button>
          <button className='control-btn' onClick={nextTrack}>⏭</button>

        </div>

        <div className="volume-container">
          <span className='volume-icon'>🔊</span>
          <input type="range"
            min={0}
            max={1}
            step={0.1}
            className='volume-bar'
            onChange={handleVolumeChange}
            value={volume} />

        </div>
      </div>
    </div>
  )
}

export default MusicPlayer