import React from 'react';

interface AdminButtonProps {
  onClick: () => void;
  isAdminMode: boolean;
}

const AdminButton: React.FC<AdminButtonProps> = ({ onClick, isAdminMode }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em]
        transition-all duration-300
        ${
          isAdminMode
            ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:bg-yellow-400'
            : 'bg-zinc-900/50 text-zinc-500 border border-white/5 hover:bg-zinc-800 hover:text-zinc-300 hover:border-white/10'
        }
      `}
      aria-label={isAdminMode ? 'Exit admin mode' : 'Enter admin mode'}
    >
      {isAdminMode ? '● Vee.in' : 'Vee.in'}
    </button>
  );
};

export default AdminButton;
