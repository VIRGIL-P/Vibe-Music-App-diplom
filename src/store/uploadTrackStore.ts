import { create } from 'zustand';

interface UploadTrackStore {
  uploadOpen: boolean;
  setUploadOpen: (open: boolean) => void;
}

export const useUploadTrackStore = create<UploadTrackStore>((set) => ({
  uploadOpen: false,
  setUploadOpen: (open) => set({ uploadOpen: open }),
}));
