import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useMusicStore } from "./store/musicStore";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Layout/Sidebar";
import MobileNav from "./components/Layout/MobileNav";
import MusicPlayer from "./components/Player/MusicPlayer";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import CreatePlaylist from "./pages/CreatePlaylist";
import PlaylistPage from "./pages/PlaylistPage";
import CreatePlaylistPage from "./pages/CreatePlaylistPage";
import TrackPage from './pages/TrackPage';

import AssistantPanel from "./components/ui/AssistantPanel";
import UploadTrackModal from "./components/Modals/UploadTrackModal";
import CreatePlaylistModalWrapper from "./components/Modals/CreatePlaylistModalWrapper";
import RecentlyPlayedPage from './pages/RecentlyPlayedPage';

import { useModalStore } from "./store/modalStore";
import { useUploadTrackStore } from "./store/uploadTrackStore";

const queryClient = new QueryClient();

const App = () => {
  const { isCreateModalOpen, closeCreateModal } = useModalStore();
  const { uploadOpen, setUploadOpen } = useUploadTrackStore();

  const setAllTracks = useMusicStore((s) => s.setAllTracks);
  const loadLikedTracks = useMusicStore((s) => s.loadLikedTracks);
  const fetchPlaylists = useMusicStore((s) => s.fetchPlaylists); // 👈 ДОБАВИЛИ

  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Загружаем пользователя из Supabase
    const getSessionUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    getSessionUser();
  }, []);

  useEffect(() => {
    const fetchTracksAndLikes = async () => {
      try {
        const { data: allTracks, error: trackError } = await supabase
          .from("songs")
          .select("*");

        if (trackError) {
          console.error("❌ Ошибка загрузки треков:", trackError.message);
          setSupabaseError(trackError.message);
          return;
        }

        setAllTracks(allTracks);

        if (user) {
          await loadLikedTracks(user, allTracks);
        }

        await fetchPlaylists(); // ✅ ВЫЗЫВАЕМ ПОЛУЧЕНИЕ ПЛЕЙЛИСТОВ
      } catch (err) {
        console.error("🔥 Неожиданная ошибка:", err);
        setSupabaseError("Не удалось загрузить треки");
      } finally {
        setLoading(false);
      }
    };

    fetchTracksAndLikes();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl bg-black">
        ⏳ Загрузка приложения...
      </div>
    );
  }

  if (supabaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl bg-black">
        ❌ Ошибка: {supabaseError}
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <div className="min-h-screen flex w-full bg-background text-foreground relative transition-colors duration-300">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/liked" element={<LikedSongs />} />
                      <Route path="/create-playlist" element={<CreatePlaylist />} />
                      <Route path="/playlist/:id" element={<PlaylistPage />} />
                      <Route path="/create-playlist-page" element={<CreatePlaylistPage />} />
                      <Route path="/recent" element={<RecentlyPlayedPage />} />
                      <Route path="/track/:id" element={<TrackPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <MusicPlayer />
                  <MobileNav />
                  <AssistantPanel />
                </div>
              }
            />
          </Routes>
        </BrowserRouter>

        {/* Глобальные модалки */}
        <CreatePlaylistModalWrapper />
        <UploadTrackModal
          isOpen={uploadOpen}
          onClose={() => setUploadOpen(false)}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
