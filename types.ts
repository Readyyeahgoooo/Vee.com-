
export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  timestamp: string;
  likes: number;
  comments: number;
  permalink?: string;
  category?: string;
  aiLabels?: string[];
}

export interface Collection {
  id: string;
  name: string;
  postIds: string[];
  description: string;
}

export type ViewMode = 'GRID' | 'TIMELINE';

export interface InstagramGalleryPost {
  id: string;                    // Unique identifier (generated)
  embedUrl: string;              // Instagram post URL
  thumbnailUrl: string;          // Extracted image URL
  mediaUrls: string[];           // All media URLs (images/videos)
  caption: string;               // Post caption text
  author: string;                // Instagram username
  timestamp: string;             // Post date
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  order: number;                 // Display order in gallery
  createdAt: string;             // When added to gallery
  embedHtml?: string;            // Full Instagram embed HTML (optional)
}

export interface AdminState {
  isAuthenticated: boolean;
  isAdminMode: boolean;
  showPasswordDialog: boolean;
}

export interface InstagramOEmbedResponse {
  version: string;
  title: string;
  author_name: string;
  author_url: string;
  author_id: number;
  media_id: string;
  provider_name: string;
  provider_url: string;
  type: string;
  width: number;
  height: number;
  html: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
}
