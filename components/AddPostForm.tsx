import React, { useState } from 'react';
import { instagramService } from '../services/instagramService';

interface AddPostFormProps {
  onAddPost: (embedUrl: string) => Promise<void>;
  isLoading: boolean;
}

const AddPostForm: React.FC<AddPostFormProps> = ({ onAddPost, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate URL
    if (!url.trim()) {
      setError('Please enter an Instagram URL');
      return;
    }

    if (!instagramService.isValidInstagramUrl(url)) {
      setError('Invalid Instagram URL. Please use format: https://www.instagram.com/p/POST_ID/');
      return;
    }

    try {
      await onAddPost(url);
      setSuccess(true);
      setUrl('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="instagram-url"
          className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3"
        >
          Instagram Post URL
        </label>
        <div className="flex gap-3">
          <input
            id="instagram-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/POST_ID/"
            className="flex-1 bg-zinc-900/50 border border-white/5 rounded-xl px-6 py-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/30 transition-all placeholder:text-zinc-700"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all ${
              isLoading
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-200 text-black hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] active:scale-95'
            }`}
          >
            {isLoading ? 'Adding...' : 'Add Post'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-2 duration-200">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400 animate-in fade-in slide-in-from-top-2 duration-200">
          Post added successfully!
        </div>
      )}
    </form>
  );
};

export default AddPostForm;
