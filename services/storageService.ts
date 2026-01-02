import { InstagramGalleryPost } from '../types';

interface StorageData {
  posts: InstagramGalleryPost[];
  version: string;
  lastModified: string;
}

class StorageService {
  private readonly STORAGE_KEY = 'vee_instagram_gallery';
  private readonly VERSION = '1.0';

  /**
   * Saves gallery posts to localStorage
   * @param posts - Array of InstagramGalleryPost
   */
  saveGallery(posts: InstagramGalleryPost[]): void {
    try {
      const data: StorageData = {
        posts,
        version: this.VERSION,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please remove some posts to free up space.');
      }
      throw new Error('Failed to save gallery data.');
    }
  }

  /**
   * Loads gallery posts from localStorage
   * @returns InstagramGalleryPost[]
   */
  loadGallery(): InstagramGalleryPost[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const data: StorageData = JSON.parse(stored);
      
      // Validate data structure
      if (!data.posts || !Array.isArray(data.posts)) {
        console.warn('Invalid gallery data structure, returning empty array');
        return [];
      }

      return data.posts;
    } catch (error) {
      console.error('Failed to parse gallery data:', error);
      // Attempt recovery by clearing corrupted data
      localStorage.removeItem(this.STORAGE_KEY);
      return [];
    }
  }

  /**
   * Adds a single post to the gallery
   * @param post - InstagramGalleryPost to add
   */
  addPost(post: InstagramGalleryPost): void {
    const posts = this.loadGallery();
    posts.push(post);
    this.saveGallery(posts);
  }

  /**
   * Removes a post from the gallery
   * @param postId - ID of post to remove
   */
  removePost(postId: string): void {
    const posts = this.loadGallery();
    const filtered = posts.filter(p => p.id !== postId);
    this.saveGallery(filtered);
  }

  /**
   * Updates an existing post
   * @param postId - ID of post to update
   * @param updates - Partial<InstagramGalleryPost>
   */
  updatePost(postId: string, updates: Partial<InstagramGalleryPost>): void {
    const posts = this.loadGallery();
    const index = posts.findIndex(p => p.id === postId);
    
    if (index === -1) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    posts[index] = { ...posts[index], ...updates };
    this.saveGallery(posts);
  }

  /**
   * Reorders posts in the gallery
   * @param postIds - Array of post IDs in new order
   */
  reorderPosts(postIds: string[]): void {
    const posts = this.loadGallery();
    const postMap = new Map(posts.map(p => [p.id, p]));
    
    const reordered = postIds
      .map(id => postMap.get(id))
      .filter((p): p is InstagramGalleryPost => p !== undefined)
      .map((p, index) => ({ ...p, order: index }));

    this.saveGallery(reordered);
  }

  /**
   * Clears all gallery data
   */
  clearGallery(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Gets the total number of posts
   */
  getPostCount(): number {
    return this.loadGallery().length;
  }

  /**
   * Checks if storage is available
   */
  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
