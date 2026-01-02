import React from 'react';
import { InstagramGalleryPost } from '../types';

interface PostDetailModalProps {
  post: InstagramGalleryPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, isOpen, onClose }) => {
  const [embedLoaded, setEmbedLoaded] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && post?.embedHtml) {
      // Load Instagram embed script
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        setEmbedLoaded(true);
        // Process embeds
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen, post]);

  if (!isOpen || !post) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12 lg:p-20 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500"
      onClick={onClose}
    >
      <div
        className="bg-black w-full h-full md:h-auto md:max-w-[1300px] flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5 md:rounded-[60px] overflow-hidden group"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Section */}
        <div className="flex-1 bg-zinc-950/50 flex items-center justify-center p-6 relative overflow-auto custom-scrollbar">
          {post.embedHtml ? (
            /* Instagram Embed with Custom Styling */
            <div 
              className="instagram-embed-wrapper w-full max-w-[540px]"
              dangerouslySetInnerHTML={{ __html: post.embedHtml }}
              style={{
                filter: 'invert(1) hue-rotate(180deg)',
              }}
            />
          ) : post.mediaType === 'VIDEO' ? (
            <video
              src={post.mediaUrls[0]}
              controls
              className="max-h-[85vh] w-full object-contain md:rounded-[40px] shadow-2xl relative z-10"
            />
          ) : (
            <img
              src={post.thumbnailUrl}
              alt={post.caption}
              className="max-h-[85vh] w-full object-contain md:rounded-[40px] shadow-2xl relative z-10"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent opacity-30 pointer-events-none"></div>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-[450px] p-10 lg:p-16 flex flex-col justify-between border-l border-white/5 bg-black">
          <div className="space-y-16">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-black font-black text-xl tracking-tighter -translate-x-0.5">
                    ee
                  </span>
                </div>
                <div className="h-[1px] w-12 bg-white/10"></div>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:border-zinc-400 transition-all duration-300"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <span className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em]">
                  @{post.author}
                </span>
                <span className="text-zinc-700 mx-3">•</span>
                <span className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em]">
                  {new Date(post.timestamp).toLocaleDateString()}
                </span>
              </div>
              {post.caption && (
                <p className="text-2xl lg:text-3xl font-black leading-tight italic text-zinc-200 selection:bg-yellow-500 selection:text-black">
                  {post.caption}
                </p>
              )}
            </div>

            {/* Media Type Badge */}
            <div className="flex gap-3">
              <div className="bg-zinc-900/30 px-4 py-2 rounded-xl border border-white/5">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {post.mediaType}
                </p>
              </div>
              {post.mediaUrls.length > 1 && (
                <div className="bg-zinc-900/30 px-4 py-2 rounded-xl border border-white/5">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {post.mediaUrls.length} ITEMS
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-20 space-y-4">
            <a
              href={post.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-zinc-200 text-black py-6 rounded-[24px] text-[11px] font-black text-center uppercase tracking-[0.3em] hover:bg-yellow-400 hover:scale-[1.02] transition-all duration-500"
            >
              View on Instagram
            </a>
            <button
              onClick={onClose}
              className="w-full border border-white/5 text-zinc-600 py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
