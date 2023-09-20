import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Playlist from "./pages/playlist/Playlist";
import AudioPlayer from "./components/audioPlayer/AudioPlayer";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import "./app.scss";
import { useEffect } from "react";
import Artist from "./pages/artist/Artist";
import Album from "./pages/album/Album";
import ShowMore from "./pages/showMore/ShowMore";
import Lyrics from "./pages/lyrics/Lyrics";
import MyPlaylists from "./pages/myPlaylists/MyPlaylists";
import Library from "./pages/library/Library";
import RecentListen from "./pages/recentListen/RecentListen";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";

function App() {
  useEffect(() => {
    const appWrapper = document.querySelector(".app-wrapper");
    const navbar = document.querySelector(".navbar");

    appWrapper.addEventListener("scroll", () => {
      if (appWrapper.scrollTop > 0) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });

    return () => {
      appWrapper.removeEventListener('scroll', () => { });
    }
  }, []);

  return (
    <>
      <Router>
        <div className="app">
          <ScrollToTop element=".app-wrapper" />
          <Sidebar />
          <div className="app-wrapper">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/playlists/:id" element={<Playlist />} />
              <Route path="/albums/:id" element={<Album />} />
              <Route path="/artists/:id" element={<Artist />} />
              <Route path="/section/:name" element={<ShowMore />} />
              <Route path="/lyrics/:idSong" element={<Lyrics />} />
              <Route path="/my-playlists" element={<MyPlaylists />} />
              <Route path="/library" element={<Library />} />
              <Route path="/recent-listen" element={<RecentListen />} />
            </Routes>
          </div>
          <AudioPlayer />
        </div>
      </Router>
    </>
  );
}

export default App;
