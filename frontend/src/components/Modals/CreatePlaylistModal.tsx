import React, { useState, useEffect, FormEvent } from 'react';
import { useMusicStore } from '@/store/musicStore';
import { Track } from '@/types/music';
import { supabase } from '@/lib/supabaseClient';

type CreatePlaylistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
};

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  tracks,
}) => {
  const [playlistName, setPlaylistName] = useState<string>('');
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { createPlaylist } = useMusicStore();

  // Получаем user.id из Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    fetchUser();
  }, []);

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTrackIds((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleCreatePlaylist = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!playlistName.trim()) {
      setErrorMsg('Введите название плейлиста');
      return;
    }

    if (selectedTrackIds.length === 0) {
      setErrorMsg('Выберите хотя бы один трек');
      return;
    }

    if (!userId) {
      setErrorMsg('Пользователь не авторизован');
      return;
    }

    setLoading(true);
    try {
      const { data: playlistData, error: playlistError } = await supabase
        .from('playlists')
        .insert({
          name: playlistName.trim(),
          user_id: userId,
        })
        .select()
        .single();

      if (playlistError || !playlistData) {
        throw new Error(playlistError?.message || 'Ошибка создания плейлиста');
      }

      const trackEntries = selectedTrackIds.map((trackId) => ({
        playlist_id: playlistData.id,
        track_id: trackId,
      }));

      const { error: tracksError } = await supabase
        .from('playlist_tracks')
        .insert(trackEntries);

      if (tracksError) {
        throw new Error(tracksError.message || 'Ошибка добавления треков');
      }

      const selectedTracks = tracks.filter((track) =>
        selectedTrackIds.includes(track.id)
      );

      createPlaylist({
        name: playlistData.name,
        description: '',
        tracks: selectedTracks,
      });

      setPlaylistName('');
      setSelectedTrackIds([]);
      onClose();
    } catch (err: any) {
      console.error('Ошибка:', err);
      setErrorMsg(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Закрытие по Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-neutral-900 text-white p-6 rounded-xl shadow-lg w-full max-w-md border border-neutral-700">
        <h2 id="modal-title" className="text-2xl font-semibold mb-4">
          Создать плейлист
        </h2>
        <form onSubmit={handleCreatePlaylist}>
          <input
            className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-400 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="Название плейлиста"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />

          <div className="max-h-48 overflow-y-auto mb-4 space-y-2 pr-2">
            {Array.isArray(tracks) && tracks.length > 0 ? (
              tracks.map((track) => (
                <label
                  key={track.id}
                  className="flex items-center gap-3 text-sm text-white cursor-pointer"
                >
                  <span className="relative">
                    <input
                      type="checkbox"
                      checked={selectedTrackIds.includes(track.id)}
                      onChange={() => toggleTrackSelection(track.id)}
                      className="peer hidden"
                    />
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-500 peer-checked:border-green-500 peer-checked:bg-green-500 transition-all" />
                    <div className="absolute inset-0 rounded-full bg-green-500 opacity-0 peer-checked:opacity-100" />
                  </span>
                  <span className="truncate">
                    {track.name} — {track.artist_name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-neutral-400 text-sm">Нет доступных треков</p>
            )}
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm mb-3">{errorMsg}</p>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setPlaylistName('');
                setSelectedTrackIds([]);
                onClose();
              }}
              className="text-sm text-neutral-400 hover:text-white"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-sm text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
