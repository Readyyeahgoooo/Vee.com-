# Implementation Plan: Instagram Gallery Manager

## Overview

This implementation plan breaks down the Instagram Gallery Manager feature into discrete coding tasks. The approach follows a bottom-up strategy: first building core services and data models, then implementing UI components, and finally integrating everything into the existing App component. Each task builds incrementally on previous work, with checkpoints to ensure stability.

## Tasks

- [x] 1. Remove Gemini API dependencies and features
  - Remove `services/geminiService.ts` file
  - Remove `@google/genai` from `package.json` dependencies
  - Remove AI Engine button and related UI from `App.tsx`
  - Remove `categorizePostsWithAI` function calls
  - Remove `AI_CLUSTERS` view mode and related state
  - Remove `collections` state and `isAnalyzing` state
  - Remove `runAIAnalysis` function
  - _Requirements: Design - Gemini API Removal_

- [x] 2. Create data models and types
  - Add `InstagramGalleryPost` interface to `types.ts`
  - Add `AdminState` interface to `types.ts`
  - Add `InstagramOEmbedResponse` interface to `types.ts`
  - _Requirements: 2.2, 2.4, 2.5_

- [x] 3. Implement StorageService
  - [x] 3.1 Create `services/storageService.ts` with StorageService class
    - Implement `saveGallery` method for persisting posts array
    - Implement `loadGallery` method for retrieving posts from localStorage
    - Implement `addPost` method for adding single post
    - Implement `removePost` method for deleting post by ID
    - Implement `updatePost` method for modifying existing post
    - Implement `reorderPosts` method for changing post order
    - Add error handling for quota exceeded and parse errors
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 3.2 Write property test for storage persistence
    - **Property 2: Post Addition Persistence**
    - **Validates: Requirements 5.1, 5.3**

  - [x] 3.3 Write property test for storage consistency
    - **Property 5: Storage Consistency**
    - **Validates: Requirements 5.1, 5.2, 5.4**

  - [x] 3.4 Write unit tests for StorageService edge cases
    - Test empty gallery state
    - Test corrupted data recovery
    - Test quota exceeded handling
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 4. Implement InstagramService
  - [x] 4.1 Create `services/instagramService.ts` with InstagramService class
    - Implement `parseInstagramUrl` to extract post ID from URL
    - Implement `isValidInstagramUrl` for URL validation
    - Implement `fetchOEmbedData` to call Instagram oEmbed API
    - Implement `extractMediaUrls` to parse media URLs from embed HTML
    - Implement `createPostFromEmbed` to create InstagramGalleryPost from URL
    - Add error handling for network failures and invalid responses
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 7.1, 7.2, 7.3_

  - [x] 4.2 Write property test for URL validation
    - **Property 3: URL Validation**
    - **Validates: Requirements 2.3, 7.1**

  - [x] 4.3 Write property test for thumbnail extraction
    - **Property 4: Thumbnail Extraction**
    - **Validates: Requirements 2.4, 3.1**

  - [x] 4.4 Write unit tests for InstagramService
    - Test valid Instagram URL formats
    - Test invalid URL rejection
    - Test media URL extraction from various embed formats
    - Test error handling for API failures
    - _Requirements: 2.3, 7.1, 7.2_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement AdminButton component
  - [x] 6.1 Create `components/AdminButton.tsx`
    - Create button component with "Vee.in" label
    - Add onClick handler prop
    - Add isAdminMode prop for styling state
    - Style with site's zinc/yellow color scheme
    - Position below gallery section
    - _Requirements: 1.1, 8.2_

  - [x] 6.2 Write unit tests for AdminButton
    - Test button renders with correct label
    - Test onClick handler is called
    - Test styling changes based on isAdminMode
    - _Requirements: 1.1, 8.2_

- [x] 7. Implement PasswordDialog component
  - [x] 7.1 Create `components/PasswordDialog.tsx`
    - Create modal dialog with password input field
    - Add form submission handler
    - Add error message display
    - Style consistently with site aesthetic
    - Add close button functionality
    - _Requirements: 1.1, 1.2, 1.3, 8.3_

  - [x] 7.2 Write property test for admin authentication
    - **Property 1: Admin Authentication Requirement**
    - **Validates: Requirements 1.2, 1.3**

  - [x] 7.3 Write unit tests for PasswordDialog
    - Test password input and submission
    - Test error message display
    - Test dialog close functionality
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 8. Implement AddPostForm component
  - [x] 8.1 Create `components/AddPostForm.tsx`
    - Create form with URL input field
    - Add URL validation before submission
    - Add loading state display
    - Add success/error feedback messages
    - Style with site's design system
    - _Requirements: 2.1, 2.2, 2.3, 8.3_

  - [x] 8.2 Write unit tests for AddPostForm
    - Test URL input validation
    - Test form submission
    - Test loading state display
    - Test error handling
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 9. Implement InstagramPostCard component
  - [x] 9.1 Create `components/InstagramPostCard.tsx`
    - Create card component displaying thumbnail
    - Add onClick handler for detail view
    - Add conditional admin controls overlay (edit/delete buttons)
    - Apply grayscale styling with hover effects
    - Match existing PostCard component design
    - Maintain aspect ratio for thumbnails
    - _Requirements: 3.2, 3.3, 3.5, 6.1, 8.1_

  - [x] 9.2 Write property test for admin mode visibility
    - **Property 6: Admin Mode Visibility**
    - **Validates: Requirements 1.4, 6.1**

  - [x] 9.3 Write unit tests for InstagramPostCard
    - Test thumbnail rendering
    - Test onClick handler
    - Test admin controls visibility
    - Test styling application
    - _Requirements: 3.2, 3.3, 3.5, 6.1_

- [x] 10. Implement PostDetailModal component
  - [x] 10.1 Create `components/PostDetailModal.tsx`
    - Create full-screen modal overlay
    - Display post media (images/videos) without Instagram styling
    - Display caption and metadata
    - Add close button
    - Apply custom black/minimal styling
    - Match existing detail modal design pattern
    - Handle multiple media items (carousel)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 7.5, 8.4_

  - [x] 10.2 Write property test for detail view content completeness
    - **Property 8: Detail View Content Completeness**
    - **Validates: Requirements 4.2, 4.3, 7.5**

  - [x] 10.3 Write unit tests for PostDetailModal
    - Test modal open/close
    - Test media display
    - Test caption rendering
    - Test carousel navigation
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement GalleryGrid component
  - [x] 12.1 Create `components/GalleryGrid.tsx`
    - Create grid layout container
    - Map InstagramGalleryPost array to InstagramPostCard components
    - Apply existing archive grid styling
    - Handle empty state display
    - Pass admin mode state to child cards
    - _Requirements: 3.3, 8.1_

  - [x] 12.2 Write property test for grid layout consistency
    - **Property 9: Grid Layout Consistency**
    - **Validates: Requirements 3.3, 8.1**

  - [x] 12.3 Write unit tests for GalleryGrid
    - Test grid renders correct number of cards
    - Test empty state display
    - Test admin mode propagation
    - _Requirements: 3.3, 8.1_

- [x] 13. Implement AdminPanel component
  - [x] 13.1 Create `components/AdminPanel.tsx`
    - Create container for admin controls
    - Include AddPostForm component
    - Add save button for committing changes
    - Add exit admin mode button
    - Display admin mode indicator
    - Style consistently with site design
    - _Requirements: 1.4, 1.5, 2.1, 5.4, 8.3_

  - [x] 13.2 Write unit tests for AdminPanel
    - Test admin controls visibility
    - Test save functionality
    - Test exit admin mode
    - _Requirements: 1.4, 1.5, 5.4_

- [x] 14. Implement InstagramGallerySection component
  - [x] 14.1 Create `components/InstagramGallerySection.tsx`
    - Create main container component
    - Implement state management (galleryPosts, adminState, selectedPost)
    - Load gallery posts from StorageService on mount
    - Implement admin authentication flow
    - Implement post addition handler using InstagramService
    - Implement post deletion with confirmation dialog
    - Implement post selection for detail view
    - Coordinate between child components
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 4.1, 5.3, 6.1, 6.2, 6.3_

  - [x] 14.2 Write property test for post deletion confirmation
    - **Property 7: Post Deletion Confirmation**
    - **Validates: Requirements 6.2, 6.3**

  - [x] 14.3 Write property test for order preservation
    - **Property 10: Order Preservation**
    - **Validates: Requirements 6.5, 5.4**

  - [x] 14.4 Write integration tests for InstagramGallerySection
    - Test end-to-end admin flow (login → add post → save → reload)
    - Test post detail view flow (click → view → close)
    - Test error recovery scenarios
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.1, 5.3_

- [-] 15. Integrate InstagramGallerySection into App.tsx
  - [x] 15.1 Add InstagramGallerySection to App component
    - Import InstagramGallerySection component
    - Add new section below existing Archive section
    - Add section header "Instagram Gallery" with styling
    - Ensure responsive layout is maintained
    - Test integration with existing components
    - _Requirements: 8.1, 8.2, 8.4, 8.5_

  - [ ] 15.2 Write integration tests for App component
    - Test Instagram gallery section renders
    - Test navigation between archive and gallery
    - Test responsive behavior
    - _Requirements: 8.1, 8.4, 8.5_

- [x] 16. Add error handling and loading states
  - [x] 16.1 Implement error boundaries and fallbacks
    - Add error boundary component for gallery section
    - Implement thumbnail loading placeholders
    - Add retry mechanisms for failed API calls
    - Display user-friendly error messages
    - Handle storage quota exceeded errors
    - _Requirements: 3.4, 5.5, 7.4_

  - [x] 16.2 Write unit tests for error handling
    - Test error boundary catches errors
    - Test placeholder display on image load failure
    - Test retry mechanism
    - Test error message display
    - _Requirements: 3.4, 5.5_

- [x] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Manual testing and polish
  - [x] 18.1 Perform manual testing checklist
    - Verify admin button positioning and visibility
    - Test password dialog styling and functionality
    - Verify gallery grid integration with existing archive
    - Test thumbnail display without Instagram white layout
    - Verify detail modal matches existing modal design
    - Test mobile responsiveness
    - Verify admin controls are intuitive
    - Test error messages are clear
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 18.2 Performance optimization
    - Optimize image loading (lazy loading)
    - Minimize re-renders in gallery grid
    - Add debouncing to URL input validation
    - _Requirements: 3.3, 8.1_

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation removes Gemini API dependencies as requested
- Instagram oEmbed API may require CORS proxy for client-side calls
- Consider using a serverless function (Vercel) for Instagram API calls if CORS issues arise
