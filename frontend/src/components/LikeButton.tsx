import { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useMusicStore } from "@/store/musicStore";
import { Track } from "@/types/music";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

interface LikeButtonProps {
  track: Track;
}

const LikeButton: React.FC<LikeButtonProps> = ({ track }) => {
  const { toggleLikeTrack } = useMusicStore();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user || !track?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("liked_songs")
          .select("id")
          .eq("user_id", user.id)
          .eq("song_id", String(track.id))
          .maybeSingle();

        if (error) {
          console.error("Ошибка при проверке лайка:", error.message);
        }

        setIsLiked(!!data);
      } catch (err) {
        console.error("Ошибка сети:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikeStatus();
  }, [track?.id, user?.id]);

  const handleToggleLike = async () => {
    if (!user || !track?.id) {
      console.warn("Нет user или track.id");
      return;
    }

    const toastId = "like-toast"; // 👈 фиксируем ID для замены

    try {
      await toggleLikeTrack(user.id, { ...track, id: String(track.id) });

      const { data, error } = await supabase
        .from("liked_songs")
        .select("id")
        .eq("user_id", user.id)
        .eq("song_id", String(track.id))
        .maybeSingle();

      if (error) {
        console.error("Ошибка при повторной проверке лайка:", error.message);
      }

      const nowLiked = !!data;
      setIsLiked(nowLiked);

      toast.custom(
        (t) => (
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-xl bg-zinc-900/90 border border-white/10 text-white px-4 py-3 rounded-xl shadow-lg backdrop-blur flex items-center space-x-4 ${
              t.visible ? "opacity-100" : "opacity-0"
            } transition-all duration-300`}
          >
            {track.album_image && (
              <img
                src={track.album_image}
                alt="cover"
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">{track.name}</p>
              <p className="text-xs text-gray-400">
                {nowLiked
                  ? "Добавлен в любимое"
                  : "Удалён из понравившегося"}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="hover:text-red-400 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ),
        {
          id: toastId,
          duration: 2500,
        }
      );
    } catch (err) {
      console.error("Ошибка при переключении лайка:", err);
      toast.error("Ошибка при обновлении лайка", { id: "like-toast" });
    }
  };

  if (!user || !track?.id || loading) return null;

  return (
    <button
      onClick={handleToggleLike}
      title={isLiked ? "Убрать из лайков" : "Добавить в лайки"}
      className={`p-1 rounded-full transition-colors ${
        isLiked ? "text-green-500" : "text-gray-400 hover:text-white"
      }`}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${
          isLiked ? "fill-current" : ""
        }`}
      />
    </button>
  );
};

export default LikeButton;
