
import React from 'react';
import { InstagramPost } from '../types';

interface PostCardProps {
  post: InstagramPost;
  onClick: (post: InstagramPost) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <div 
      className="group relative aspect-square overflow-hidden cursor-pointer bg-zinc-950 transition-all duration-500 hover:z-20 shadow-2xl"
      onClick={() => onClick(post)}
    >
      <img 
        src={post.imageUrl} 
        alt={post.caption}
        className="w-full h-full object-cover grayscale brightness-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Refined Minimal Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-6">
        <div className="flex justify-end">
           <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-100 shadow-xl">
              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
              </svg>
           </div>
        </div>
        
        <div className="space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center justify-between text-[10px] font-black tracking-widest uppercase text-zinc-200">
            <span>{post.likes.toLocaleString()} L</span>
            <div className="h-[1px] flex-1 mx-3 bg-white/10"></div>
            <span>{post.comments} C</span>
          </div>
        </div>
      </div>

      {/* Subtle brand corner signifier */}
      <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
        <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/5 rounded-full group-hover:bg-yellow-400 transition-colors"></div>
      </div>
    </div>
  );
};

export default PostCard;
