import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
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

import AssistantPanel from "./components/ui/AssistantPanel";
import UploadTrackModal from "./components/Modals/UploadTrackModal";
import CreatePlaylistModalWrapper from "./components/Modals/CreatePlaylistModalWrapper";
import { useModalStore } from "./store/modalStore";
import { useUploadTrackStore } from "./store/uploadTrackStore"; // 🟡 добавили zustand-хранилище

const queryClient = new QueryClient();

const App = () => {
  const { isCreateModalOpen, closeCreateModal } = useModalStore();
  const { uploadOpen, setUploadOpen } = useUploadTrackStore(); // 🟡 читаем zustand-состояние
  const { user } = useUser();
  const setAllTracks = useMusicStore((s) => s.setAllTracks);
  const loadLikedTracks = useMusicStore((s) => s.loadLikedTracks);

  useEffect(() => {
    const fetchTracksAndLikes = async () => {
      const { data: allTracks, error: trackError } = await supabase
        .from("songs")
        .select("*");

      if (trackError) {
        console.error("❌ Ошибка загрузки треков:", trackError.message);
        return;
      }

      setAllTracks(allTracks);

      if (user) {
        await loadLikedTracks(user, allTracks);
      }
    };

    fetchTracksAndLikes();
  }, [user]);

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
                      <Route path="*" element={<NotFound />} />
                      <Route path="/create-playlist" element={<CreatePlaylistPage />} />
                    </Routes>
                  </main>
                  <MusicPlayer />
                  <MobileNav />
                  <AssistantPanel /> {/* 🔹 AI-панель */}
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
