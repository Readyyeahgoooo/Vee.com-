import { InstagramGalleryPost, InstagramOEmbedResponse } from '../types';

class InstagramService {
  /**
   * Parses Instagram URL to extract post ID
   * @param url - Instagram post URL
   * @returns string - Post ID or throws error
   */
  parseInstagramUrl(url: string): string {
    // First validate it's a proper Instagram URL
    if (!this.isValidInstagramUrl(url)) {
      throw new Error('Invalid Instagram URL');
    }
    
    try {
      const urlObj = new URL(url);
      const match = urlObj.pathname.match(/\/p\/([A-Za-z0-9_-]+)\/?/);
      
      if (!match || !match[1]) {
        throw new Error('Invalid Instagram URL format');
      }
      
      return match[1];
    } catch (error) {
      throw new Error('Invalid Instagram URL');
    }
  }

  /**
   * Validates Instagram URL format
   * @param url - URL to validate
   * @returns boolean
   */
  isValidInstagramUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Check if it's HTTPS
      if (urlObj.protocol !== 'https:') {
        return false;
      }
      
      // Check if it's an Instagram domain
      const validDomains = ['instagram.com', 'www.instagram.com'];
      if (!validDomains.includes(urlObj.hostname)) {
        return false;
      }
      
      // Check if it has the /p/ pattern
      return /\/p\/[A-Za-z0-9_-]+\/?/.test(urlObj.pathname);
    } catch {
      return false;
    }
  }

  /**
   * Fetches Instagram post metadata using oEmbed API
   * @param embedUrl - Instagram post URL
   * @returns Promise<InstagramOEmbedResponse>
   */
  async fetchOEmbedData(embedUrl: string): Promise<InstagramOEmbedResponse> {
    try {
      // Use Instagram's public oEmbed endpoint
      const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(embedUrl)}&omitscript=true`;
      
      const response = await fetch(oembedUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch Instagram data: ${response.status}`);
      }

      const data = await response.json();
      
      // Instagram oEmbed returns the data we need
      const oembedData: InstagramOEmbedResponse = {
        version: data.version || '1.0',
        title: data.title || '',
        author_name: data.author_name || 'unknown',
        author_url: data.author_url || 'https://www.instagram.com',
        author_id: data.author_id || 0,
        media_id: data.media_id || '',
        provider_name: data.provider_name || 'Instagram',
        provider_url: data.provider_url || 'https://www.instagram.com',
        type: data.type || 'photo',
        width: data.width || 640,
        height: data.height || 640,
        html: data.html || '',
        thumbnail_url: data.thumbnail_url || '',
        thumbnail_width: data.thumbnail_width || 640,
        thumbnail_height: data.thumbnail_height || 640,
      };

      return oembedData;
    } catch (error) {
      console.error('Error fetching Instagram oEmbed data:', error);
      throw new Error('Failed to fetch Instagram post data. The post may be private or unavailable.');
    }
  }

  /**
   * Extracts media URLs from Instagram embed HTML or data
   * @param html - Instagram embed HTML string or data object
   * @returns string[] - Array of media URLs
   */
  extractMediaUrls(html: string): string[] {
    const urls: string[] = [];
    
    try {
      // Try to parse as JSON first (if it's data from API)
      const data = JSON.parse(html);
      
      if (data.display_url) {
        urls.push(data.display_url);
      }
      
      if (data.video_url) {
        urls.push(data.video_url);
      }
      
      // Handle carousel
      if (data.edge_sidecar_to_children?.edges) {
        data.edge_sidecar_to_children.edges.forEach((edge: any) => {
          if (edge.node.display_url) {
            urls.push(edge.node.display_url);
          }
          if (edge.node.video_url) {
            urls.push(edge.node.video_url);
          }
        });
      }
    } catch {
      // If not JSON, try to extract from HTML
      const imgRegex = /https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|gif|webp)/gi;
      const videoRegex = /https?:\/\/[^\s"']+\.(?:mp4|webm)/gi;
      
      const imgMatches = html.match(imgRegex) || [];
      const videoMatches = html.match(videoRegex) || [];
      
      urls.push(...imgMatches, ...videoMatches);
    }
    
    // Remove duplicates
    return [...new Set(urls)];
  }

  /**
   * Creates InstagramGalleryPost from embed URL
   * @param embedUrl - Instagram post URL
   * @returns Promise<InstagramGalleryPost>
   */
  async createPostFromEmbed(embedUrl: string): Promise<InstagramGalleryPost> {
    if (!this.isValidInstagramUrl(embedUrl)) {
      throw new Error('Invalid Instagram URL');
    }

    try {
      const oembedData = await this.fetchOEmbedData(embedUrl);
      
      // Generate unique ID
      const postId = this.parseInstagramUrl(embedUrl);
      const id = `ig-${postId}-${Date.now()}`;
      
      // Determine media type
      let mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL' = 'IMAGE';
      if (oembedData.type === 'video') {
        mediaType = 'VIDEO';
      }
      
      // Extract media URLs
      const mediaUrls = [oembedData.thumbnail_url];
      
      const post: InstagramGalleryPost = {
        id,
        embedUrl,
        thumbnailUrl: oembedData.thumbnail_url,
        mediaUrls,
        caption: oembedData.title || '',
        author: oembedData.author_name,
        timestamp: new Date().toISOString(), // Instagram doesn't provide this in oEmbed
        mediaType,
        order: 0, // Will be set when added to gallery
        createdAt: new Date().toISOString(),
      };

      return post;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create post from Instagram URL');
    }
  }

  /**
   * Simplified method that creates a post with basic data extraction
   * This is a fallback when the API is not accessible
   * @param embedUrl - Instagram post URL
   * @returns InstagramGalleryPost
   */
  createPostFromEmbedSimple(embedUrl: string): InstagramGalleryPost {
    if (!this.isValidInstagramUrl(embedUrl)) {
      throw new Error('Invalid Instagram URL');
    }

    const postId = this.parseInstagramUrl(embedUrl);
    const id = `ig-${postId}-${Date.now()}`;
    
    // Use Instagram's CDN URL pattern for thumbnail
    // This is a best-effort approach when API is unavailable
    const thumbnailUrl = `https://www.instagram.com/p/${postId}/media/?size=l`;
    
    const post: InstagramGalleryPost = {
      id,
      embedUrl,
      thumbnailUrl,
      mediaUrls: [thumbnailUrl],
      caption: '', // Will need to be filled manually or extracted later
      author: '', // Will need to be filled manually
      timestamp: new Date().toISOString(),
      mediaType: 'IMAGE', // Default assumption
      order: 0,
      createdAt: new Date().toISOString(),
    };

    return post;
  }
}

// Export singleton instance
export const instagramService = new InstagramService();
