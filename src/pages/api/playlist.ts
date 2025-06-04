import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';  // Clerk-функция для получения пользователя
import { createClient } from '@supabase/supabase-js';

// Инициализируем Supabase-клиент с service-role ключом для серверной среды.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Получаем текущего пользователя через Clerk
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. User must be logged in.' });
  }

  const { name, trackIds } = req.body;
  // Проверка наличия обязательных полей
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Название плейлиста (name) не указано или имеет неверный формат.' });
  }
  if (!trackIds || !Array.isArray(trackIds) || trackIds.length === 0) {
    return res.status(400).json({ error: 'Необходимо предоставить массив как минимум с одним trackId.' });
  }

  try {
    // 1. Вставляем новую запись плейлиста в таблицу 'playlists'
    const { data: newPlaylist, error: insertPlaylistError } = await supabaseAdmin
      .from('playlists')
      .insert({
        user_id: userId,       // текстовый идентификатор пользователя (Clerk user ID)
        name: name.trim(),     // название плейлиста
        // created_at заполнится автоматически на стороне базы (напр. default now())
      })
      .select()      // вернуть вставленную запись
      .single();     // ожидать единственную запись (мы вставляем один плейлист)

    if (insertPlaylistError || !newPlaylist) {
      throw insertPlaylistError || new Error('Ошибка вставки плейлиста.');
    }

    // 2. Формируем массив записей для playlist_tracks на основе выбранных trackIds
    const playlistId = newPlaylist.id;
    const trackEntries = trackIds.map((trackId: string) => ({
      playlist_id: playlistId,
      track_id: trackId,
      // created_at можно не указывать, default value заполнит (NOW())
    }));

    // 3. Вставляем все записи треков плейлиста за один запрос
    const { error: insertTracksError } = await supabaseAdmin
      .from('playlist_tracks')
      .insert(trackEntries);

    if (insertTracksError) {
      // Если вставка треков не удалась, выбрасываем ошибку
      throw insertTracksError;
    }

    // Успех: возвращаем id нового плейлиста
    return res.status(200).json({ playlistId });
  } catch (err: any) {
    console.error('Playlist creation error:', err);
    // Определяем код ошибки и отправляем сообщение
    return res.status(500).json({ 
      error: err.message || 'Внутренняя ошибка сервера при создании плейлиста.' 
    });
  }
}
