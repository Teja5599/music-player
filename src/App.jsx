import React from 'react'
import MusicPlayer from './components/MusicPlayer'
import { BrowserRouter, Route, Routes } from 'react-router'
import AllSongs from './components/AllSongs'
import Playlists from './components/Playlists'
import { MusicProvider } from './contexts/MusicContext'
import Navbar from './components/Navbar'
const App = () => {
  return (
    <BrowserRouter>
    <MusicProvider>
      <div className='app'>
        <Navbar/>
        <main className='app-main'>
          <div className='player-section'>
            <MusicPlayer />
          </div>
          <div className="content-section">
            <Routes>
              <Route path='/' element={<AllSongs/>}/>
              <Route path='playlists' element={<Playlists/>}/> 
            </Routes>
          </div>
        </main>
      </div>
      </MusicProvider>
    </BrowserRouter>
  )
}

export default App