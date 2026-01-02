import React, { useState } from 'react';
import { instagramService } from '../services/instagramService';

interface AddPostFormProps {
  onAddPost: (embedUrl: string) => Promise<void>;
  isLoading: boolean;
}

const AddPostForm: React.FC<AddPostFormProps> = ({ onAddPost, isLoading }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate input
    if (!input.trim()) {
      setError('Please enter an Instagram URL or embed code');
      return;
    }

    try {
      // Extract URL from input (handles both URL and embed code)
      const url = instagramService.extractUrlFromInput(input);
      
      if (!instagramService.isValidInstagramUrl(url)) {
        setError('Invalid Instagram URL. Please use format: https://www.instagram.com/p/POST_ID/');
        return;
      }

      await onAddPost(input); // Pass the full input (URL or embed code)
      setSuccess(true);
      setInput('');
      
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
          htmlFor="instagram-input"
          className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3"
        >
          Instagram Post URL or Embed Code
        </label>
        <div className="flex gap-3">
          <textarea
            id="instagram-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste Instagram URL or full embed code here..."
            rows={3}
            className="flex-1 bg-zinc-900/50 border border-white/5 rounded-xl px-6 py-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/30 transition-all placeholder:text-zinc-700 resize-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all self-start ${
              isLoading
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-200 text-black hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] active:scale-95'
            }`}
          >
            {isLoading ? 'Adding...' : 'Add Post'}
          </button>
        </div>
        <p className="mt-2 text-[10px] text-zinc-600">
          Accepts: Instagram URL (https://www.instagram.com/p/POST_ID/) or full embed code from Instagram
        </p>
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
