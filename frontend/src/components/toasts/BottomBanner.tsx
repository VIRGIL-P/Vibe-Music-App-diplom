import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const showTrackLikedToast = (trackName: string) => {
  toast.custom((t) => (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
        t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-3 w-[90vw] max-w-xl bg-white/10 backdrop-blur-lg text-white rounded-full shadow-xl border border-white/10">
        <span className="truncate text-sm">
          ✅ Трек <strong>«{trackName}»</strong> добавлен в «Любимые»
        </span>
        <button onClick={() => toast.dismiss(t.id)} className="hover:text-red-400 transition">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  ));
};
