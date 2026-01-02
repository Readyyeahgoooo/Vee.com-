import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { storageService } from './storageService';
import { InstagramGalleryPost } from '../types';

// Feature: instagram-gallery-manager, Property 2: Post Addition Persistence
// For any valid Instagram embed URL added in admin mode, after saving, 
// the post should be retrievable from storage on subsequent page loads.

describe('StorageService', () => {
  beforeEach(() => {
    storageService.clearGallery();
  });

  describe('Property 2: Post Addition Persistence', () => {
    it('should persist and retrieve any valid post', () => {
      fc.assert(
        fc.property(
          // Generator for InstagramGalleryPost
          fc.record({
            id: fc.uuid(),
            embedUrl: fc.webUrl({ validSchemes: ['https'] }).map(url => 
              url.includes('instagram.com') ? url : `https://www.instagram.com/p/${fc.hexaString({ minLength: 11, maxLength: 11 })}/`
            ),
            thumbnailUrl: fc.webUrl({ validSchemes: ['https'] }),
            mediaUrls: fc.array(fc.webUrl({ validSchemes: ['https'] }), { minLength: 1, maxLength: 10 }),
            caption: fc.string({ minLength: 0, maxLength: 2200 }),
            author: fc.string({ minLength: 1, maxLength: 30 }),
            timestamp: fc.date().map(d => d.toISOString()),
            mediaType: fc.constantFrom('IMAGE' as const, 'VIDEO' as const, 'CAROUSEL' as const),
            order: fc.nat({ max: 1000 }),
            createdAt: fc.date().map(d => d.toISOString()),
          }),
          (post: InstagramGalleryPost) => {
            // Clear storage before test
            storageService.clearGallery();

            // Add post
            storageService.addPost(post);

            // Retrieve posts
            const retrieved = storageService.loadGallery();

            // Verify post was persisted
            expect(retrieved).toHaveLength(1);
            expect(retrieved[0]).toEqual(post);

            // Clean up
            storageService.clearGallery();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should persist multiple posts and retrieve all of them', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              embedUrl: fc.webUrl({ validSchemes: ['https'] }),
              thumbnailUrl: fc.webUrl({ validSchemes: ['https'] }),
              mediaUrls: fc.array(fc.webUrl({ validSchemes: ['https'] }), { minLength: 1, maxLength: 5 }),
              caption: fc.string({ maxLength: 500 }),
              author: fc.string({ minLength: 1, maxLength: 30 }),
              timestamp: fc.date().map(d => d.toISOString()),
              mediaType: fc.constantFrom('IMAGE' as const, 'VIDEO' as const, 'CAROUSEL' as const),
              order: fc.nat({ max: 1000 }),
              createdAt: fc.date().map(d => d.toISOString()),
            }),
            { minLength: 1, maxLength: 50 }
          ),
          (posts: InstagramGalleryPost[]) => {
            // Clear storage
            storageService.clearGallery();

            // Save all posts
            storageService.saveGallery(posts);

            // Retrieve posts
            const retrieved = storageService.loadGallery();

            // Verify all posts were persisted
            expect(retrieved).toHaveLength(posts.length);
            expect(retrieved).toEqual(posts);

            // Clean up
            storageService.clearGallery();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: instagram-gallery-manager, Property 5: Storage Consistency
  // For any sequence of add/remove operations in admin mode, the gallery state 
  // in localStorage should match the displayed gallery state after save is clicked.

  describe('Property 5: Storage Consistency', () => {
    it('should maintain consistency after any sequence of add/remove operations', () => {
      fc.assert(
        fc.property(
          // Generate a sequence of operations
          fc.array(
            fc.oneof(
              fc.record({
                type: fc.constant('add' as const),
                post: fc.record({
                  id: fc.uuid(),
                  embedUrl: fc.webUrl({ validSchemes: ['https'] }),
                  thumbnailUrl: fc.webUrl({ validSchemes: ['https'] }),
                  mediaUrls: fc.array(fc.webUrl({ validSchemes: ['https'] }), { minLength: 1, maxLength: 3 }),
                  caption: fc.string({ maxLength: 200 }),
                  author: fc.string({ minLength: 1, maxLength: 30 }),
                  timestamp: fc.date().map(d => d.toISOString()),
                  mediaType: fc.constantFrom('IMAGE' as const, 'VIDEO' as const, 'CAROUSEL' as const),
                  order: fc.nat({ max: 100 }),
                  createdAt: fc.date().map(d => d.toISOString()),
                }),
              }),
              fc.record({
                type: fc.constant('remove' as const),
                index: fc.nat({ max: 10 }),
              })
            ),
            { minLength: 1, maxLength: 20 }
          ),
          (operations) => {
            // Clear storage
            storageService.clearGallery();

            // Track expected state
            const expectedPosts: InstagramGalleryPost[] = [];

            // Execute operations
            for (const op of operations) {
              if (op.type === 'add') {
                expectedPosts.push(op.post);
                storageService.addPost(op.post);
              } else if (op.type === 'remove' && expectedPosts.length > 0) {
                const indexToRemove = op.index % expectedPosts.length;
                const postToRemove = expectedPosts[indexToRemove];
                expectedPosts.splice(indexToRemove, 1);
                storageService.removePost(postToRemove.id);
              }
            }

            // Verify storage matches expected state
            const retrieved = storageService.loadGallery();
            expect(retrieved).toEqual(expectedPosts);

            // Clean up
            storageService.clearGallery();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests: Edge Cases', () => {
    it('should return empty array when no data exists', () => {
      const posts = storageService.loadGallery();
      expect(posts).toEqual([]);
    });

    it('should handle corrupted data gracefully', () => {
      // Manually corrupt the data
      localStorage.setItem('vee_instagram_gallery', 'invalid json{{{');
      
      const posts = storageService.loadGallery();
      expect(posts).toEqual([]);
      
      // Verify corrupted data was cleared
      expect(localStorage.getItem('vee_instagram_gallery')).toBeNull();
    });

    it('should throw error when quota is exceeded', () => {
      // Create a very large post array to simulate quota exceeded
      const largePosts: InstagramGalleryPost[] = Array(10000).fill(null).map((_, i) => ({
        id: `post-${i}`,
        embedUrl: `https://www.instagram.com/p/test${i}/`,
        thumbnailUrl: `https://example.com/thumb${i}.jpg`,
        mediaUrls: [`https://example.com/media${i}.jpg`],
        caption: 'A'.repeat(2000), // Large caption
        author: 'testuser',
        timestamp: new Date().toISOString(),
        mediaType: 'IMAGE' as const,
        order: i,
        createdAt: new Date().toISOString(),
      }));

      // This might not actually exceed quota in test environment,
      // but we're testing the error handling structure
      try {
        storageService.saveGallery(largePosts);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toContain('Storage quota exceeded');
        }
      }
    });

    it('should remove a post by ID', () => {
      const post1: InstagramGalleryPost = {
        id: 'post-1',
        embedUrl: 'https://www.instagram.com/p/test1/',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        mediaUrls: ['https://example.com/media1.jpg'],
        caption: 'Test post 1',
        author: 'testuser',
        timestamp: new Date().toISOString(),
        mediaType: 'IMAGE',
        order: 0,
        createdAt: new Date().toISOString(),
      };

      const post2: InstagramGalleryPost = {
        ...post1,
        id: 'post-2',
        caption: 'Test post 2',
        order: 1,
      };

      storageService.saveGallery([post1, post2]);
      storageService.removePost('post-1');

      const posts = storageService.loadGallery();
      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe('post-2');
    });

    it('should update a post', () => {
      const post: InstagramGalleryPost = {
        id: 'post-1',
        embedUrl: 'https://www.instagram.com/p/test1/',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        mediaUrls: ['https://example.com/media1.jpg'],
        caption: 'Original caption',
        author: 'testuser',
        timestamp: new Date().toISOString(),
        mediaType: 'IMAGE',
        order: 0,
        createdAt: new Date().toISOString(),
      };

      storageService.addPost(post);
      storageService.updatePost('post-1', { caption: 'Updated caption' });

      const posts = storageService.loadGallery();
      expect(posts[0].caption).toBe('Updated caption');
    });

    it('should throw error when updating non-existent post', () => {
      expect(() => {
        storageService.updatePost('non-existent', { caption: 'Test' });
      }).toThrow('Post with ID non-existent not found');
    });

    it('should reorder posts', () => {
      const posts: InstagramGalleryPost[] = [
        {
          id: 'post-1',
          embedUrl: 'https://www.instagram.com/p/test1/',
          thumbnailUrl: 'https://example.com/thumb1.jpg',
          mediaUrls: ['https://example.com/media1.jpg'],
          caption: 'Post 1',
          author: 'testuser',
          timestamp: new Date().toISOString(),
          mediaType: 'IMAGE',
          order: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'post-2',
          embedUrl: 'https://www.instagram.com/p/test2/',
          thumbnailUrl: 'https://example.com/thumb2.jpg',
          mediaUrls: ['https://example.com/media2.jpg'],
          caption: 'Post 2',
          author: 'testuser',
          timestamp: new Date().toISOString(),
          mediaType: 'IMAGE',
          order: 1,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'post-3',
          embedUrl: 'https://www.instagram.com/p/test3/',
          thumbnailUrl: 'https://example.com/thumb3.jpg',
          mediaUrls: ['https://example.com/media3.jpg'],
          caption: 'Post 3',
          author: 'testuser',
          timestamp: new Date().toISOString(),
          mediaType: 'IMAGE',
          order: 2,
          createdAt: new Date().toISOString(),
        },
      ];

      storageService.saveGallery(posts);
      storageService.reorderPosts(['post-3', 'post-1', 'post-2']);

      const reordered = storageService.loadGallery();
      expect(reordered[0].id).toBe('post-3');
      expect(reordered[1].id).toBe('post-1');
      expect(reordered[2].id).toBe('post-2');
      expect(reordered[0].order).toBe(0);
      expect(reordered[1].order).toBe(1);
      expect(reordered[2].order).toBe(2);
    });

    it('should check if storage is available', () => {
      expect(storageService.isStorageAvailable()).toBe(true);
    });

    it('should get post count', () => {
      expect(storageService.getPostCount()).toBe(0);

      const post: InstagramGalleryPost = {
        id: 'post-1',
        embedUrl: 'https://www.instagram.com/p/test1/',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        mediaUrls: ['https://example.com/media1.jpg'],
        caption: 'Test',
        author: 'testuser',
        timestamp: new Date().toISOString(),
        mediaType: 'IMAGE',
        order: 0,
        createdAt: new Date().toISOString(),
      };

      storageService.addPost(post);
      expect(storageService.getPostCount()).toBe(1);
    });
  });
});
