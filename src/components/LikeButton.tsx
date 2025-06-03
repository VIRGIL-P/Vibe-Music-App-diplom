import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Heart } from "lucide-react";
import { useMusicStore } from "@/store/musicStore";
import { useUser } from "@clerk/clerk-react";
import { Track } from "@/types/music";

interface LikeButtonProps {
  track: Track;
}

const LikeButton: React.FC<LikeButtonProps> = ({ track }) => {
  const { user } = useUser();
  const { likedTracks, toggleLikeTrack } = useMusicStore();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLike = async () => {
      if (!user || !track?.id) return;

      const { data, error } = await supabase
        .from("liked_songs")
        .select("id")
        .eq("user_id", user.id)
        .eq("song_id", track.id)
        .maybeSingle();

      if (error) {
        console.error("❌ Ошибка проверки лайка:", error.message);
      }

      setIsLiked(!!data);
      setLoading(false);
    };

    checkLike();
  }, [track.id, user]);

  const handleToggle = async () => {
    if (!user) return;

    await toggleLikeTrack(user, track);

    // Проверка актуального состояния из Supabase
    const { data } = await supabase
      .from("liked_songs")
      .select("id")
      .eq("user_id", user.id)
      .eq("song_id", track.id)
      .maybeSingle();

    setIsLiked(!!data);
  };

  if (loading) return null;

  return (
    <button
      onClick={handleToggle}
      title={isLiked ? "Убрать лайк" : "Лайкнуть"}
      className={`transition-colors p-1 rounded-full ${
        isLiked ? "text-green-500" : "text-gray-400 hover:text-white"
      }`}
    >
      <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
    </button>
  );
};

export default LikeButton;
