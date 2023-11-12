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
import { useContext, useEffect } from "react";
import Artist from "./pages/artist/Artist";
import Album from "./pages/album/Album";
import ShowMore from "./pages/showMore/ShowMore";
import Lyrics from "./pages/lyrics/Lyrics";
import MyPlaylists from "./pages/myPlaylists/MyPlaylists";
import Library from "./pages/library/Library";
import RecentListen from "./pages/recentListen/RecentListen";
import Login from "./pages/login/Login";
import Statistic from "./pages/statistic/Statistic";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import { AuthContext } from "./context/AuthContext";
import Search from "./pages/search/Search";
import ResetPass from "./pages/resetPass/ResetPass";

function App() {
  const { user } = useContext(AuthContext);

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
              <Route path="/login" element={!user ? <Login /> : <Home />} />
              <Route path="/auth/verify/:token" element={!user ? <Login /> : <Home />} />
              <Route path="/auth/reset-password/:token" element={<ResetPass />} />
              <Route path="/search" element={<Search />} />
              <Route path="/playlists/:id" element={<Playlist />} />
              <Route path="/albums/:id" element={<Album />} />
              <Route path="/artists/:id" element={<Artist />} />
              <Route path="/section/:name" element={<ShowMore />} />
              <Route path="/lyrics/:idSong" element={<Lyrics />} />
              <Route path="/my-playlists" element={user ? <MyPlaylists /> : <Login />} />
              <Route path="/library" element={user ? <Library /> : <Login />} />
              <Route path="/recent-listen" element={user ? <RecentListen /> : <Login />} />
              <Route path="/statistic" element={user ? <Statistic /> : <Login />} />
            </Routes>
          </div>
          <AudioPlayer />
        </div>
      </Router>
    </>
  );
}

export default App;
