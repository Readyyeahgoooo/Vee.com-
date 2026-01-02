import React, { useState, useEffect } from 'react';
import { InstagramGalleryPost, AdminState } from '../types';
import { storageService } from '../services/storageService';
import { instagramService } from '../services/instagramService';
import AdminButton from './AdminButton';
import PasswordDialog from './PasswordDialog';
import AdminPanel from './AdminPanel';
import GalleryGrid from './GalleryGrid';
import PostDetailModal from './PostDetailModal';

const ADMIN_PASSWORD = 'vee2026';

const InstagramGallerySection: React.FC = () => {
  const [galleryPosts, setGalleryPosts] = useState<InstagramGalleryPost[]>([]);
  const [adminState, setAdminState] = useState<AdminState>({
    isAuthenticated: false,
    isAdminMode: false,
    showPasswordDialog: false,
  });
  const [selectedPost, setSelectedPost] = useState<InstagramGalleryPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Load gallery posts on mount
  useEffect(() => {
    const posts = storageService.loadGallery();
    setGalleryPosts(posts);
  }, []);

  // Handle admin button click
  const handleAdminButtonClick = () => {
    if (adminState.isAdminMode) {
      // Exit admin mode
      setAdminState({
        isAuthenticated: false,
        isAdminMode: false,
        showPasswordDialog: false,
      });
    } else {
      // Show password dialog
      setAdminState({
        ...adminState,
        showPasswordDialog: true,
      });
      setPasswordError(null);
    }
  };

  // Handle password authentication
  const handleAuthenticate = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setAdminState({
        isAuthenticated: true,
        isAdminMode: true,
        showPasswordDialog: false,
      });
      setPasswordError(null);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  // Handle password dialog close
  const handlePasswordDialogClose = () => {
    setAdminState({
      ...adminState,
      showPasswordDialog: false,
    });
    setPasswordError(null);
  };

  // Handle add post
  const handleAddPost = async (embedUrl: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create post from embed URL
      const post = instagramService.createPostFromEmbedSimple(embedUrl);
      
      // Set order based on current gallery length
      post.order = galleryPosts.length;

      // Add to storage
      storageService.addPost(post);

      // Update state
      setGalleryPosts([...galleryPosts, post]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add post');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete post
  const handleDeletePost = (postId: string) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this post?')) {
      storageService.removePost(postId);
      setGalleryPosts(galleryPosts.filter((p) => p.id !== postId));
    }
  };

  // Handle save (manual save trigger)
  const handleSave = () => {
    storageService.saveGallery(galleryPosts);
    alert('Gallery saved successfully!');
  };

  // Handle exit admin mode
  const handleExitAdmin = () => {
    setAdminState({
      isAuthenticated: false,
      isAdminMode: false,
      showPasswordDialog: false,
    });
  };

  return (
    <section className="mb-24">
      {/* Section Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-3">
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter italic uppercase leading-none text-zinc-100">
            Instagram Gallery
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800"
                ></div>
              ))}
            </div>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.3em]">
              Instagram Archive / {galleryPosts.length} Posts
            </p>
          </div>
        </div>

        {/* Admin Button */}
        <AdminButton
          onClick={handleAdminButtonClick}
          isAdminMode={adminState.isAdminMode}
        />
      </div>

      {/* Admin Panel */}
      {adminState.isAdminMode && (
        <AdminPanel
          onAddPost={handleAddPost}
          onSave={handleSave}
          onExit={handleExitAdmin}
          isLoading={isLoading}
          postCount={galleryPosts.length}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-6 py-4 mb-8 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Gallery Grid */}
      <GalleryGrid
        posts={galleryPosts}
        onPostClick={setSelectedPost}
        isAdminMode={adminState.isAdminMode}
        onDeletePost={handleDeletePost}
      />

      {/* Password Dialog */}
      <PasswordDialog
        isOpen={adminState.showPasswordDialog}
        onClose={handlePasswordDialogClose}
        onAuthenticate={handleAuthenticate}
        error={passwordError}
      />

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
      />
    </section>
  );
};

export default InstagramGallerySection;
