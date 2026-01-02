import React from 'react';
import { InstagramGalleryPost } from '../types';
import InstagramPostCard from './InstagramPostCard';

interface GalleryGridProps {
  posts: InstagramGalleryPost[];
  onPostClick: (post: InstagramGalleryPost) => void;
  isAdminMode: boolean;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (postId: string) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  posts,
  onPostClick,
  isAdminMode,
  onDeletePost,
  onEditPost,
}) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-zinc-950 border border-white/5 rounded-[32px] flex items-center justify-center mb-8 opacity-50">
          <svg
            className="w-12 h-12 text-zinc-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-3xl font-black mb-4 italic uppercase tracking-tighter text-zinc-300">
          No Posts Yet
        </h3>
        <p className="text-zinc-600 max-w-sm mx-auto text-[11px] font-bold uppercase tracking-[0.3em] leading-loose">
          {isAdminMode
            ? 'Add your first Instagram post using the form above'
            : 'Gallery is empty. Check back soon!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-1.5">
      {posts.map((post) => (
        <InstagramPostCard
          key={post.id}
          post={post}
          onClick={onPostClick}
          isAdminMode={isAdminMode}
          onDelete={onDeletePost}
          onEdit={onEditPost}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;
