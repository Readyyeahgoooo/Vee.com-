import React from 'react';
import { InstagramGalleryPost } from '../types';

interface InstagramPostCardProps {
  post: InstagramGalleryPost;
  onClick: (post: InstagramGalleryPost) => void;
  isAdminMode: boolean;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
}

const InstagramPostCard: React.FC<InstagramPostCardProps> = ({
  post,
  onClick,
  isAdminMode,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="group relative aspect-square overflow-hidden bg-zinc-900 cursor-pointer">
      {/* Thumbnail Image */}
      <img
        src={post.thumbnailUrl}
        alt={post.caption || 'Instagram post'}
        className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
        onClick={() => onClick(post)}
        onError={(e) => {
          // Fallback for broken images
          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23222" width="400" height="400"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace"%3ENo Image%3C/text%3E%3C/svg%3E';
        }}
      />

      {/* Admin Controls Overlay */}
      {isAdminMode && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post.id);
              }}
              className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              aria-label="Edit post"
            >
              <svg
                className="w-5 h-5 text-zinc-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post.id);
              }}
              className="p-3 bg-red-900/50 hover:bg-red-900 rounded-lg transition-colors"
              aria-label="Delete post"
            >
              <svg
                className="w-5 h-5 text-red-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Media Type Indicator */}
      {post.mediaType === 'VIDEO' && (
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
      {post.mediaType === 'CAROUSEL' && (
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default InstagramPostCard;
