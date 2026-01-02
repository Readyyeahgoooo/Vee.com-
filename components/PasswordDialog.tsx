import React, { useState, useEffect } from 'react';

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (password: string) => void;
  error: string | null;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  error,
}) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Reset password when dialog opens
    if (isOpen) {
      setPassword('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthenticate(password);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-white/10 rounded-[32px] p-8 lg:p-12 max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-black font-black text-lg tracking-tighter -translate-x-0.5">
                ee
              </span>
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-100">
              Admin Access
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:border-zinc-400 transition-all duration-300"
            aria-label="Close dialog"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-6 py-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/30 transition-all placeholder:text-zinc-700"
              placeholder="Enter admin password"
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-2 duration-200">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/5 text-zinc-500 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:text-zinc-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-zinc-200 text-black py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all active:scale-95"
            >
              Authenticate
            </button>
          </div>
        </form>

        {/* Hint */}
        <p className="text-center text-[9px] text-zinc-700 uppercase tracking-widest mt-6">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};

export default PasswordDialog;
