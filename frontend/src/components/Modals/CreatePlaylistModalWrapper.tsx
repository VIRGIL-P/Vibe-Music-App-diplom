import React from "react";

// Zustand-хранилища
import { useModalStore } from "@/store/modalStore";
import { useMusicStore } from "@/store/musicStore";

// Компонент модалки
import CreatePlaylistModal from "./CreatePlaylistModal";

const CreatePlaylistModalWrapper: React.FC = () => {
  // Состояние открытия модалки и функция её закрытия
  const { isCreateModalOpen, closeCreateModal } = useModalStore();

  // Лайкнутые треки, которые можно добавить в плейлист
  const { likedTracks } = useMusicStore();

  // Безопасная проверка: likedTracks должен быть массивом
  const safeTracks = Array.isArray(likedTracks) ? likedTracks : [];

  // Если модалка закрыта — ничего не рендерим
  if (!isCreateModalOpen) return null;

  // Рендер модалки с передачей нужных пропсов
  return (
    <CreatePlaylistModal
      isOpen={isCreateModalOpen}
      onClose={closeCreateModal}
      tracks={safeTracks}
    />
  );
};

export default CreatePlaylistModalWrapper;
