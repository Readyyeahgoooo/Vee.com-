# Vee HK - Digital Archive

A minimal, aesthetic website for the Vee HK designer-art-music collective featuring an Instagram gallery manager.

## Features

- 🎨 **Instagram Gallery Manager**: Password-protected admin interface to manage Instagram posts
- 🔒 **Secure Admin Access**: Password: `vee2026`
- 📸 **No Storage Costs**: All media hosted by Instagram
- ⚡ **Fast & Minimal**: Built with React + Vite
- 🎯 **Custom Aesthetic**: Black/zinc/yellow color scheme, no Instagram white layout

## Quick Start

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to link your project

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub:
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite and configure build settings
6. Click "Deploy"

## Using the Instagram Gallery

### For Vee Mods (Admin Access)

1. Scroll to the "Instagram Gallery" section
2. Click the "Vee.in" button at the bottom right
3. Enter password: `vee2026`
4. You'll see the admin panel with:
   - **Add Post Form**: Paste Instagram URLs (format: `https://www.instagram.com/p/POST_ID/`)
   - **Gallery Management**: Hover over posts to see edit/delete options
   - **Save Button**: Changes save automatically to browser storage

### Adding Instagram Posts

1. Go to any Instagram post you want to add
2. Click the "..." menu → "Embed"
3. Copy the post URL (e.g., `https://www.instagram.com/p/C-170UNSoqM/`)
4. Paste it in the admin panel
5. Click "Add Post"

The thumbnail will appear in the gallery immediately!

### For Visitors

- Browse the gallery grid
- Click any thumbnail to view the full post content
- Videos and carousels are fully supported

## Technical Details

### Architecture

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (via inline classes)
- **Storage**: Browser localStorage
- **Testing**: Vitest + fast-check (property-based testing)

### Key Components

- `InstagramGallerySection`: Main container
- `AdminPanel`: Password-protected admin interface
- `GalleryGrid`: Responsive grid layout
- `InstagramPostCard`: Individual post thumbnails
- `PostDetailModal`: Full post viewer

### Services

- `storageService`: Manages localStorage operations
- `instagramService`: Handles Instagram URL parsing and validation

## Browser Storage

Gallery data is stored in browser localStorage under the key `vee_instagram_gallery`. This means:

- ✅ No server costs
- ✅ Instant updates
- ✅ Works offline
- ⚠️ Data is per-browser (clearing browser data will reset the gallery)
- ⚠️ ~5-10MB storage limit (enough for 500+ posts)

## Updating the Gallery

Vee mods can update the gallery indefinitely by:

1. Visiting the deployed site
2. Entering admin mode
3. Adding/removing posts as needed
4. Changes persist automatically

No code deployment needed for content updates!

## Support

For technical issues or questions, contact the development team.

---

**Vee HK Collective** • Est. 2013 • Hong Kong Underground Frequency
