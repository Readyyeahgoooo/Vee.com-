# Design Document: Instagram Gallery Manager

## Overview

The Instagram Gallery Manager extends the existing Vee HK archive website with a password-protected content management system for Instagram posts. The design leverages Instagram's oEmbed API to extract post metadata and media URLs, stores gallery items in browser localStorage, and renders content using custom React components that match the site's minimal black aesthetic. The system integrates seamlessly with the existing archive grid layout while providing admin controls for authorized users.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App Component                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Existing Archive Section                   │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Instagram Gallery Section                     │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Gallery Grid (InstagramPost[])                  │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Vee.in Button → Admin Mode Toggle               │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ InstagramService │  │  StorageService  │  │  AdminControls   │
│  - fetchOEmbed   │  │  - saveGallery   │  │  - AddPostForm   │
│  - extractMedia  │  │  - loadGallery   │  │  - EditControls  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Component Hierarchy

- **App.tsx** (existing, modified)
  - **InstagramGallerySection** (new)
    - **GalleryGrid** (new)
      - **InstagramPostCard** (new)
    - **PostDetailModal** (new)
    - **AdminButton** (new)
    - **AdminPanel** (new, conditional)
      - **PasswordDialog** (new)
      - **AddPostForm** (new)
      - **PostManagementControls** (new)

## Components and Interfaces

### Data Models

```typescript
// types.ts (additions)

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
```

### Service Layer

#### InstagramService

```typescript
// services/instagramService.ts

class InstagramService {
  /**
   * Fetches Instagram post metadata using oEmbed API
   * @param embedUrl - Instagram post URL
   * @returns Promise<InstagramOEmbedResponse>
   */
  async fetchOEmbedData(embedUrl: string): Promise<InstagramOEmbedResponse>;

  /**
   * Extracts media URLs from Instagram embed HTML
   * @param html - Instagram embed HTML string
   * @returns string[] - Array of media URLs
   */
  extractMediaUrls(html: string): string[];

  /**
   * Parses Instagram URL to extract post ID
   * @param url - Instagram post URL
   * @returns string - Post ID or throws error
   */
  parseInstagramUrl(url: string): string;

  /**
   * Validates Instagram URL format
   * @param url - URL to validate
   * @returns boolean
   */
  isValidInstagramUrl(url: string): boolean;

  /**
   * Creates InstagramGalleryPost from embed URL
   * @param embedUrl - Instagram post URL
   * @returns Promise<InstagramGalleryPost>
   */
  async createPostFromEmbed(embedUrl: string): Promise<InstagramGalleryPost>;
}
```

#### StorageService

```typescript
// services/storageService.ts

class StorageService {
  private readonly STORAGE_KEY = 'vee_instagram_gallery';

  /**
   * Saves gallery posts to localStorage
   * @param posts - Array of InstagramGalleryPost
   */
  saveGallery(posts: InstagramGalleryPost[]): void;

  /**
   * Loads gallery posts from localStorage
   * @returns InstagramGalleryPost[]
   */
  loadGallery(): InstagramGalleryPost[];

  /**
   * Adds a single post to the gallery
   * @param post - InstagramGalleryPost to add
   */
  addPost(post: InstagramGalleryPost): void;

  /**
   * Removes a post from the gallery
   * @param postId - ID of post to remove
   */
  removePost(postId: string): void;

  /**
   * Updates an existing post
   * @param postId - ID of post to update
   * @param updates - Partial<InstagramGalleryPost>
   */
  updatePost(postId: string, updates: Partial<InstagramGalleryPost>): void;

  /**
   * Reorders posts in the gallery
   * @param postIds - Array of post IDs in new order
   */
  reorderPosts(postIds: string[]): void;
}
```

### Component Specifications

#### InstagramGallerySection

Main container component for the Instagram gallery feature.

**Props:** None (uses internal state)

**State:**
- `galleryPosts: InstagramGalleryPost[]`
- `adminState: AdminState`
- `selectedPost: InstagramGalleryPost | null`
- `isLoading: boolean`
- `error: string | null`

**Behavior:**
- Loads gallery posts from storage on mount
- Manages admin authentication state
- Handles post selection for detail view
- Coordinates between child components

#### AdminButton

Small button that triggers admin mode authentication.

**Props:**
```typescript
interface AdminButtonProps {
  onClick: () => void;
  isAdminMode: boolean;
}
```

**Styling:**
- Positioned below gallery grid
- Minimal design: small text button "Vee.in"
- Changes appearance when admin mode is active
- Consistent with site's zinc/yellow color scheme

#### PasswordDialog

Modal dialog for admin authentication.

**Props:**
```typescript
interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (password: string) => void;
  error: string | null;
}
```

**Behavior:**
- Displays password input field
- Validates password on submit
- Shows error message for incorrect password
- Closes on successful authentication

#### AddPostForm

Form for adding new Instagram posts in admin mode.

**Props:**
```typescript
interface AddPostFormProps {
  onAddPost: (embedUrl: string) => Promise<void>;
  isLoading: boolean;
}
```

**Behavior:**
- Input field for Instagram embed URL
- Validates URL format before submission
- Shows loading state during post creation
- Displays success/error feedback

#### InstagramPostCard

Gallery grid item displaying post thumbnail.

**Props:**
```typescript
interface InstagramPostCardProps {
  post: InstagramGalleryPost;
  onClick: (post: InstagramGalleryPost) => void;
  isAdminMode: boolean;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
}
```

**Styling:**
- Matches existing PostCard component design
- Grayscale thumbnail with hover effects
- Shows admin controls overlay when in admin mode
- Aspect ratio maintained

#### PostDetailModal

Full-screen modal for viewing post content.

**Props:**
```typescript
interface PostDetailModalProps {
  post: InstagramGalleryPost | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**Behavior:**
- Displays full-size media (images/videos)
- Shows caption and metadata
- Custom styling (no Instagram white layout)
- Matches existing detail modal design

## Data Models

### InstagramGalleryPost Structure

```typescript
{
  id: "uuid-v4-generated",
  embedUrl: "https://www.instagram.com/p/C-170UNSoqM/",
  thumbnailUrl: "https://scontent.cdninstagram.com/...",
  mediaUrls: [
    "https://scontent.cdninstagram.com/image1.jpg",
    "https://scontent.cdninstagram.com/video1.mp4"
  ],
  caption: "Post caption text with #hashtags",
  author: "veeeeeeeeeehk",
  timestamp: "2024-08-15T10:30:00Z",
  mediaType: "CAROUSEL",
  order: 0,
  createdAt: "2025-01-02T14:20:00Z"
}
```

### localStorage Schema

```typescript
{
  "vee_instagram_gallery": {
    "posts": InstagramGalleryPost[],
    "version": "1.0",
    "lastModified": "2025-01-02T14:20:00Z"
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Admin Authentication Requirement

*For any* user attempting to access admin controls, the system should only grant access when the correct password "vee2026" is provided.

**Validates: Requirements 1.2, 1.3**

### Property 2: Post Addition Persistence

*For any* valid Instagram embed URL added in admin mode, after saving, the post should be retrievable from storage on subsequent page loads.

**Validates: Requirements 2.2, 5.1, 5.3**

### Property 3: URL Validation

*For any* string submitted as an Instagram URL, the system should only accept URLs matching the pattern `https://www.instagram.com/p/[POST_ID]/` or `https://instagram.com/p/[POST_ID]/`.

**Validates: Requirements 2.3, 7.1**

### Property 4: Thumbnail Extraction

*For any* valid Instagram embed URL processed, the system should extract at least one media URL that can be used as a thumbnail.

**Validates: Requirements 2.4, 3.1**

### Property 5: Storage Consistency

*For any* sequence of add/remove operations in admin mode, the gallery state in localStorage should match the displayed gallery state after save is clicked.

**Validates: Requirements 5.1, 5.2, 5.4**

### Property 6: Admin Mode Visibility

*For any* user not in admin mode, no post management controls (edit, delete, add) should be visible or accessible.

**Validates: Requirements 1.4, 6.1**

### Property 7: Post Deletion Confirmation

*For any* post deletion request in admin mode, the system should require explicit user confirmation before removing the post from storage.

**Validates: Requirements 6.2, 6.3**

### Property 8: Detail View Content Completeness

*For any* post opened in detail view, all media URLs and caption text should be displayed without Instagram's default styling.

**Validates: Requirements 4.2, 4.3, 7.5**

### Property 9: Grid Layout Consistency

*For any* number of gallery posts, the display should use the existing archive grid layout with consistent spacing and styling.

**Validates: Requirements 3.3, 8.1**

### Property 10: Order Preservation

*For any* reordering operation in admin mode, the new order should be persisted to storage and maintained across page reloads.

**Validates: Requirements 6.5, 5.4**

## Error Handling

### Instagram API Errors

- **Network Failures**: Display user-friendly error message, allow retry
- **Invalid URLs**: Show validation error before API call
- **Rate Limiting**: Implement exponential backoff, inform user of delay
- **CORS Issues**: Use proxy or alternative extraction method

### Storage Errors

- **Quota Exceeded**: Warn user, suggest removing old posts
- **Parse Errors**: Attempt recovery, fallback to empty gallery
- **Corruption**: Validate data structure, clear if unrecoverable

### Authentication Errors

- **Incorrect Password**: Display error, allow retry (no lockout)
- **Session Expiry**: Require re-authentication for sensitive operations

### Media Loading Errors

- **Thumbnail 404**: Display placeholder image
- **Video Playback Failure**: Show error message, link to Instagram
- **Slow Loading**: Show loading skeleton, timeout after 10s

## Testing Strategy

### Unit Tests

- **InstagramService.parseInstagramUrl**: Test valid/invalid URL formats
- **InstagramService.isValidInstagramUrl**: Test edge cases (trailing slashes, query params)
- **StorageService.saveGallery**: Test serialization/deserialization
- **StorageService.loadGallery**: Test empty state, corrupted data
- **Password validation**: Test correct/incorrect passwords
- **URL extraction**: Test various Instagram embed HTML formats

### Property-Based Tests

Property-based tests will use **fast-check** library (TypeScript PBT framework) with minimum 100 iterations per test.

**Property 1: Admin Authentication Requirement**
- Generate random password strings
- Verify only "vee2026" grants access
- Tag: **Feature: instagram-gallery-manager, Property 1: Admin Authentication Requirement**

**Property 2: Post Addition Persistence**
- Generate random valid Instagram URLs
- Add posts, save, reload from storage
- Verify all posts are retrieved
- Tag: **Feature: instagram-gallery-manager, Property 2: Post Addition Persistence**

**Property 3: URL Validation**
- Generate random strings and valid Instagram URLs
- Verify validation function correctly identifies valid URLs
- Tag: **Feature: instagram-gallery-manager, Property 3: URL Validation**

**Property 4: Thumbnail Extraction**
- Generate mock Instagram oEmbed responses
- Verify thumbnail URL is always extracted
- Tag: **Feature: instagram-gallery-manager, Property 4: Thumbnail Extraction**

**Property 5: Storage Consistency**
- Generate random sequences of add/remove operations
- Verify storage matches displayed state
- Tag: **Feature: instagram-gallery-manager, Property 5: Storage Consistency**

**Property 6: Admin Mode Visibility**
- Generate random admin mode states
- Verify controls visibility matches authentication state
- Tag: **Feature: instagram-gallery-manager, Property 6: Admin Mode Visibility**

**Property 7: Post Deletion Confirmation**
- Generate random post deletion attempts
- Verify confirmation dialog always appears
- Tag: **Feature: instagram-gallery-manager, Property 7: Post Deletion Confirmation**

**Property 8: Detail View Content Completeness**
- Generate random post data
- Verify all media and caption are displayed
- Tag: **Feature: instagram-gallery-manager, Property 8: Detail View Content Completeness**

**Property 9: Grid Layout Consistency**
- Generate random numbers of posts (0-1000)
- Verify grid layout maintains consistency
- Tag: **Feature: instagram-gallery-manager, Property 9: Grid Layout Consistency**

**Property 10: Order Preservation**
- Generate random post orderings
- Verify order persists after save/reload
- Tag: **Feature: instagram-gallery-manager, Property 10: Order Preservation**

### Integration Tests

- **End-to-end admin flow**: Login → Add post → Save → Reload → Verify
- **Post detail view**: Click thumbnail → View content → Close
- **Error recovery**: Simulate API failure → Verify error handling
- **Storage migration**: Test upgrading from empty to populated gallery

### Manual Testing Checklist

- [ ] Admin button is visible and positioned correctly
- [ ] Password dialog styling matches site aesthetic
- [ ] Gallery grid integrates seamlessly with existing archive
- [ ] Thumbnails display without Instagram white layout
- [ ] Detail modal matches existing modal design
- [ ] Mobile responsiveness maintained
- [ ] Admin controls are intuitive and accessible
- [ ] Error messages are clear and helpful

## Implementation Notes

### Instagram oEmbed API

Instagram provides an oEmbed endpoint for fetching post metadata:

```
GET https://graph.facebook.com/v12.0/instagram_oembed
  ?url=https://www.instagram.com/p/POST_ID/
  &access_token=YOUR_ACCESS_TOKEN
```

**Alternative (no auth required):**
```
GET https://www.instagram.com/p/POST_ID/?__a=1&__d=dis
```

This returns JSON with post data including media URLs.

### Media URL Extraction

Instagram embed HTML contains media URLs in several places:
1. `thumbnail_url` in oEmbed response
2. `og:image` meta tags in embed HTML
3. Direct image URLs in `<img>` tags

The service should try multiple extraction methods for robustness.

### Styling Approach

To avoid Instagram's white layout:
1. Extract only media URLs and text content
2. Do NOT render Instagram's embed HTML
3. Build custom components using extracted data
4. Apply site's existing styling (black bg, zinc text, yellow accents)

### Gemini API Removal

The existing `geminiService.ts` and AI categorization features should be removed:
1. Delete `services/geminiService.ts`
2. Remove `@google/genai` dependency from `package.json`
3. Remove AI Engine button and related UI
4. Remove `categorizePostsWithAI` calls from `App.tsx`
5. Remove `AI_CLUSTERS` view mode
6. Remove API key references from environment files
