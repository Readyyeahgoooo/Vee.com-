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
      // Instagram's oEmbed endpoint
      // Note: This may require CORS proxy in production
      const oembedUrl = `https://graph.facebook.com/v12.0/instagram_oembed?url=${encodeURIComponent(embedUrl)}&access_token=YOUR_ACCESS_TOKEN`;
      
      // Alternative approach: Use a CORS proxy or serverless function
      // For now, we'll use a fallback method that extracts from the page
      const response = await fetch(`https://www.instagram.com/p/${this.parseInstagramUrl(embedUrl)}/?__a=1&__d=dis`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Instagram data: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract relevant data from Instagram's JSON response
      const media = data?.items?.[0] || data?.graphql?.shortcode_media;
      
      if (!media) {
        throw new Error('Could not extract media data from Instagram response');
      }

      // Map to oEmbed format
      const oembedData: InstagramOEmbedResponse = {
        version: '1.0',
        title: media.caption?.text || '',
        author_name: media.owner?.username || media.user?.username || 'unknown',
        author_url: `https://www.instagram.com/${media.owner?.username || media.user?.username || ''}`,
        author_id: parseInt(media.owner?.id || media.user?.pk || '0'),
        media_id: media.id || media.pk || '',
        provider_name: 'Instagram',
        provider_url: 'https://www.instagram.com',
        type: media.media_type === 2 ? 'video' : 'photo',
        width: media.dimensions?.width || 640,
        height: media.dimensions?.height || 640,
        html: '', // We'll construct this
        thumbnail_url: media.display_url || media.image_versions2?.candidates?.[0]?.url || '',
        thumbnail_width: media.dimensions?.width || 640,
        thumbnail_height: media.dimensions?.height || 640,
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
