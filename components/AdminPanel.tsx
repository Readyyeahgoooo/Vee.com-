import React from 'react';
import AddPostForm from './AddPostForm';

interface AdminPanelProps {
  onAddPost: (embedUrl: string) => Promise<void>;
  onSave: () => void;
  onExit: () => void;
  isLoading: boolean;
  postCount: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  onAddPost,
  onSave,
  onExit,
  isLoading,
  postCount,
}) => {
  return (
    <div className="bg-zinc-950/50 border border-yellow-500/20 rounded-[32px] p-8 lg:p-12 mb-12 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-100">
            Admin Mode
          </h3>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            {postCount} Posts
          </span>
        </div>
        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] bg-zinc-900/50 text-zinc-500 border border-white/5 hover:bg-zinc-800 hover:text-zinc-300 transition-all"
        >
          Exit Admin
        </button>
      </div>

      {/* Add Post Form */}
      <div className="mb-6">
        <AddPostForm onAddPost={onAddPost} isLoading={isLoading} />
      </div>

      {/* Instructions */}
      <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-6 mb-6">
        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3">
          Instructions
        </h4>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-1">•</span>
            <span>Paste Instagram post URLs in the format: https://www.instagram.com/p/POST_ID/</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-1">•</span>
            <span>Hover over posts in the gallery to see edit and delete options</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-1">•</span>
            <span>Changes are saved automatically to browser storage</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-1">•</span>
            <span>Videos and images are hosted by Instagram (no storage costs)</span>
          </li>
        </ul>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        className="w-full bg-yellow-500 text-black py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all active:scale-[0.98]"
      >
        Save Changes
      </button>
    </div>
  );
};

export default AdminPanel;
