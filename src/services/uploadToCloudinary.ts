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

  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.secure_url;
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

  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.secure_url;
};
