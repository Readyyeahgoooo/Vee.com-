# Requirements Document

## Introduction

The Instagram Gallery Manager enables Vee HK collective members to maintain a curated gallery of their Instagram posts on their static website without storing media files locally. The system provides a password-protected admin interface for adding Instagram embed links, extracts post thumbnails and content, displays them in a custom aesthetic (removing Instagram's default white layout), and persists changes to the gallery. This allows the collective to showcase their 588+ Instagram posts in a professional, minimal style while leveraging Instagram's hosting infrastructure.

## Glossary

- **Gallery_Manager**: The admin interface component that allows authorized users to add, edit, and remove Instagram posts from the gallery
- **Post_Item**: A single gallery entry containing an Instagram embed URL, extracted thumbnail, and post content
- **Admin_Mode**: The password-protected state where gallery management controls are visible and functional
- **Embed_URL**: The Instagram post URL provided by Instagram's embed functionality (e.g., https://www.instagram.com/p/POST_ID/)
- **Thumbnail**: The primary image extracted from an Instagram post used as the preview in the gallery grid
- **Post_Content**: The caption, images/videos, and metadata extracted from an Instagram embed
- **Storage_Layer**: Browser localStorage used to persist gallery items between sessions
- **Vee_Button**: The small button labeled "Vee.in" that toggles admin mode when clicked

## Requirements

### Requirement 1: Admin Mode Access

**User Story:** As a Vee HK collective member, I want to access admin mode with a password, so that I can manage gallery content while preventing unauthorized modifications.

#### Acceptance Criteria

1. WHEN a user clicks the Vee_Button, THEN THE Gallery_Manager SHALL display a password input dialog
2. WHEN a user enters the password "vee2026" and submits, THEN THE Gallery_Manager SHALL activate Admin_Mode and display management controls
3. WHEN a user enters an incorrect password, THEN THE Gallery_Manager SHALL display an error message and remain in view-only mode
4. WHEN Admin_Mode is active, THEN THE Gallery_Manager SHALL display visual indicators showing admin controls are available
5. WHEN a user exits Admin_Mode, THEN THE Gallery_Manager SHALL hide all management controls and return to view-only mode

### Requirement 2: Instagram Post Addition

**User Story:** As a Vee HK collective member in admin mode, I want to add Instagram posts by pasting embed URLs, so that I can populate the gallery with content from our Instagram account.

#### Acceptance Criteria

1. WHEN Admin_Mode is active, THEN THE Gallery_Manager SHALL display an "Add Post" interface with an input field for Embed_URLs
2. WHEN a user pastes a valid Embed_URL and submits, THEN THE Gallery_Manager SHALL create a new Post_Item and add it to the gallery
3. WHEN a user submits an invalid or malformed URL, THEN THE Gallery_Manager SHALL display an error message and prevent Post_Item creation
4. WHEN a Post_Item is created, THEN THE Gallery_Manager SHALL extract the thumbnail image from the Instagram embed
5. WHEN a Post_Item is created, THEN THE Gallery_Manager SHALL extract the Post_Content (caption, media) from the Instagram embed

### Requirement 3: Thumbnail Extraction and Display

**User Story:** As a website visitor, I want to see Instagram post thumbnails in the gallery grid, so that I can browse the collective's work in a visually appealing format.

#### Acceptance Criteria

1. WHEN THE Gallery_Manager extracts a thumbnail from an Embed_URL, THEN THE System SHALL identify the primary image from the Instagram post
2. WHEN a thumbnail is displayed in the gallery, THEN THE System SHALL render it without Instagram's default white layout or branding
3. WHEN multiple Post_Items exist, THEN THE Gallery_Manager SHALL display thumbnails in a grid layout consistent with the existing archive design
4. WHEN a thumbnail fails to load, THEN THE System SHALL display a placeholder image with appropriate styling
5. WHEN a thumbnail is displayed, THEN THE System SHALL maintain the aspect ratio and apply the site's aesthetic styling (grayscale, minimal)

### Requirement 4: Post Content Viewing

**User Story:** As a website visitor, I want to click on a thumbnail to view the full post content, so that I can see the complete Instagram post in a blog-style format.

#### Acceptance Criteria

1. WHEN a user clicks a thumbnail, THEN THE System SHALL open a detail view displaying the Post_Content
2. WHEN the detail view is displayed, THEN THE System SHALL show the post's images/videos, caption, and metadata without Instagram's white layout
3. WHEN the detail view is displayed, THEN THE System SHALL apply custom styling consistent with the site's black/minimal aesthetic
4. WHEN a post contains multiple images or a video, THEN THE System SHALL display all media content in the detail view
5. WHEN a user closes the detail view, THEN THE System SHALL return to the gallery grid view

### Requirement 5: Gallery Persistence

**User Story:** As a Vee HK collective member, I want gallery changes to persist after saving, so that updates remain visible to all visitors without manual re-entry.

#### Acceptance Criteria

1. WHEN a user adds a Post_Item in Admin_Mode, THEN THE Storage_Layer SHALL save the Post_Item data to browser localStorage
2. WHEN a user removes a Post_Item in Admin_Mode, THEN THE Storage_Layer SHALL delete the Post_Item data from browser localStorage
3. WHEN the website loads, THEN THE Gallery_Manager SHALL retrieve all Post_Items from the Storage_Layer and display them
4. WHEN a user clicks "Save" in Admin_Mode, THEN THE Gallery_Manager SHALL commit all pending changes to the Storage_Layer
5. WHEN storage operations fail, THEN THE System SHALL display an error message and maintain the current gallery state

### Requirement 6: Post Management

**User Story:** As a Vee HK collective member in admin mode, I want to edit and remove posts, so that I can maintain an accurate and curated gallery.

#### Acceptance Criteria

1. WHEN Admin_Mode is active, THEN THE Gallery_Manager SHALL display edit and delete controls on each Post_Item
2. WHEN a user clicks delete on a Post_Item, THEN THE Gallery_Manager SHALL prompt for confirmation before removal
3. WHEN a user confirms deletion, THEN THE Gallery_Manager SHALL remove the Post_Item from the gallery and Storage_Layer
4. WHEN a user edits a Post_Item's Embed_URL, THEN THE Gallery_Manager SHALL re-extract the thumbnail and Post_Content
5. WHEN a user reorders Post_Items, THEN THE Gallery_Manager SHALL update the display order and persist the changes

### Requirement 7: Instagram Embed Integration

**User Story:** As a developer, I want to extract content from Instagram embeds without using Instagram's default styling, so that posts integrate seamlessly with the site's aesthetic.

#### Acceptance Criteria

1. WHEN THE System processes an Embed_URL, THEN THE System SHALL parse the Instagram embed code to extract media URLs
2. WHEN extracting Post_Content, THEN THE System SHALL retrieve the caption text without Instagram's formatting
3. WHEN extracting media, THEN THE System SHALL identify image URLs or video URLs from the embed code
4. WHEN Instagram's embed script is loaded, THEN THE System SHALL prevent it from applying Instagram's default white styling
5. WHEN displaying extracted content, THEN THE System SHALL use only the media URLs and text, not the full embed HTML

### Requirement 8: UI Integration

**User Story:** As a website visitor, I want the Instagram gallery to integrate seamlessly with the existing site design, so that the experience feels cohesive and professional.

#### Acceptance Criteria

1. WHEN the gallery is displayed, THEN THE System SHALL use the existing archive grid layout and styling
2. WHEN the Vee_Button is displayed, THEN THE System SHALL position it unobtrusively below the gallery section
3. WHEN Admin_Mode controls are shown, THEN THE System SHALL style them consistently with the site's black/zinc/yellow color scheme
4. WHEN the detail view is opened, THEN THE System SHALL use the existing modal/overlay design pattern
5. WHEN transitions occur, THEN THE System SHALL use the site's existing animation durations and easing functions
