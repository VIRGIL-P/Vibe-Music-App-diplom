import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { uploadAudio, uploadImage } from '@/services/uploadToCloudinary';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UploadTrackModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [form, setForm] = useState({
    name: '',
    artist_name: '',
    album: '',
    duration: '',
    album_image: undefined as File | undefined,
    audio_file: undefined as File | undefined,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setErrorMsg(null);

    if (!user || !user.id) {
      setErrorMsg('Пользователь не авторизован');
      return;
    }
    if (!form.name.trim() || !form.artist_name.trim()) {
      setErrorMsg('Заполните название и имя исполнителя');
      return;
    }
    if (!form.audio_file || !form.album_image) {
      setErrorMsg('Прикрепите трек и обложку');
      return;
    }
    if (!form.duration || isNaN(+form.duration)) {
      setErrorMsg('Укажите длительность трека в секундах');
      return;
    }

    try {
      setLoading(true);

      const audio_url = await uploadAudio(form.audio_file);
      const album_image = await uploadImage(form.album_image);

      const { error } = await supabase.from('songs').insert({
  id: crypto.randomUUID(), // <== добавь это
  name: form.name.trim(),
  artist_name: form.artist_name.trim(),
  album: form.album.trim(),
  duration: +form.duration,
  album_image,
  audio_url,
  user_id: user.id,
});


      if (error) {
        throw new Error(error.message);
      }

      setForm({
        name: '',
        artist_name: '',
        album: '',
        duration: '',
        album_image: undefined,
        audio_file: undefined,
      });
      onClose();
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Dialog.Panel className="bg-zinc-900 p-6 rounded-xl w-full max-w-md text-white space-y-4">
        <Dialog.Title className="text-lg font-semibold">Загрузить трек</Dialog.Title>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Название трека"
          className="w-full bg-zinc-800 p-2 rounded"
        />
        <input
          type="text"
          name="artist_name"
          value={form.artist_name}
          onChange={handleChange}
          placeholder="Исполнитель"
          className="w-full bg-zinc-800 p-2 rounded"
        />
        <input
          type="text"
          name="album"
          value={form.album}
          onChange={handleChange}
          placeholder="Альбом"
          className="w-full bg-zinc-800 p-2 rounded"
        />
        <input
          type="number"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Длительность (сек)"
          className="w-full bg-zinc-800 p-2 rounded"
        />
        <input
          type="file"
          name="album_image"
          accept="image/*"
          onChange={handleChange}
          className="w-full bg-zinc-800 p-2 rounded"
        />
        <input
          type="file"
          name="audio_file"
          accept="audio/mp3"
          onChange={handleChange}
          className="w-full bg-zinc-800 p-2 rounded"
        />

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-zinc-700 rounded">Отмена</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition rounded text-white"
          >
            {loading ? 'Загрузка...' : 'Загрузить'}
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default UploadTrackModal;
