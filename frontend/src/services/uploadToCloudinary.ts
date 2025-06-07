import axios from 'axios';

/**
 * Загружает изображение на Cloudinary
 * @param file - файл изображения (image/*)
 * @returns URL загруженного изображения
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'vibe_uploads');

  const cloudName = 'dvdgd9jyt';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const secureUrl = response.data.secure_url;
    if (!secureUrl) {
      console.error('❌ Ошибка: Cloudinary не вернул secure_url для изображения');
      throw new Error('Ошибка загрузки изображения');
    }

    return secureUrl;
  } catch (error: any) {
    console.error('❌ Ошибка при загрузке изображения:', error);
    throw new Error(error?.response?.data?.error?.message || 'Ошибка загрузки изображения');
  }
};

/**
 * Загружает аудиофайл на Cloudinary
 * @param file - mp3 файл
 * @returns URL загруженного аудио
 */
export const uploadAudio = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'vibe_uploads');

  const cloudName = 'dvdgd9jyt';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const secureUrl = response.data.secure_url;
    if (!secureUrl) {
      console.error('❌ Ошибка: Cloudinary не вернул secure_url для аудио', response.data);
      throw new Error('Ошибка загрузки аудио');
    }

    return secureUrl;
  } catch (error: any) {
    console.error('❌ Ошибка при загрузке аудио:', error);
    throw new Error(error?.response?.data?.error?.message || 'Ошибка загрузки аудио');
  }
};
