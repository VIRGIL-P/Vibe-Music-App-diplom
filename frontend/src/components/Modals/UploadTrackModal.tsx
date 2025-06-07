import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { uploadAudio, uploadImage } from '@/services/uploadToCloudinary';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UploadTrackModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [duration, setDuration] = useState<number | ''>('');
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

    const trackDuration = duration || form.duration;
    if (!trackDuration || isNaN(+trackDuration)) {
      setErrorMsg('Укажите длительность трека в секундах');
      return;
    }

    try {
      setLoading(true);

      const audio_url = await uploadAudio(form.audio_file);
      const album_image = await uploadImage(form.album_image);

      const { error } = await supabase.from('songs').insert({
        id: crypto.randomUUID(),
        name: form.name.trim(),
        artist_name: form.artist_name.trim(),
        album: form.album.trim(),
        duration: +trackDuration,
        album_image,
        audio_url,
        user_id: user.id,
      });

      if (error) throw new Error(error.message);

      setForm({
        name: '',
        artist_name: '',
        album: '',
        duration: '',
        album_image: undefined,
        audio_file: undefined,
      });
      setDuration('');
      onClose();
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90 translate-y-2"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all text-white space-y-4">
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

<div className="flex flex-col sm:flex-row gap-3 mt-4">
  {/* Загрузить трек */}
  <label className="bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-4 rounded-full cursor-pointer transition w-full text-center sm:w-fit">
    Загрузить трек
    <input
      type="file"
      accept="audio/mp3"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          handleChange({
            target: { name: 'audio_file', value: file },
          } as any);
          const audio = new Audio(URL.createObjectURL(file));
          audio.addEventListener('loadedmetadata', () => {
            setDuration(Math.floor(audio.duration));
          });
        }
      }}
      className="hidden"
    />
  </label>

  {/* Загрузить обложку */}
  <label className="bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-4 rounded-full cursor-pointer transition w-full text-center sm:w-fit">
    Загрузить обложку
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          handleChange({
            target: { name: 'album_image', value: file },
          } as any);
        }
      }}
      className="hidden"
    />
  </label>
</div>




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
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UploadTrackModal;
