import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { instagramService } from './instagramService';

// Feature: instagram-gallery-manager, Property 3: URL Validation
// For any string submitted as an Instagram URL, the system should only accept URLs 
// matching the pattern `https://www.instagram.com/p/[POST_ID]/` or `https://instagram.com/p/[POST_ID]/`.

describe('InstagramService', () => {
  describe('Property 3: URL Validation', () => {
    it('should accept valid Instagram URLs', () => {
      fc.assert(
        fc.property(
          // Generator for valid Instagram post IDs (alphanumeric, underscore, hyphen)
          fc.stringMatching(/^[A-Za-z0-9_-]{11}$/),
          fc.constantFrom('https://www.instagram.com', 'https://instagram.com'),
          fc.boolean(), // trailing slash or not
          (postId, domain, trailingSlash) => {
            const url = `${domain}/p/${postId}${trailingSlash ? '/' : ''}`;
            expect(instagramService.isValidInstagramUrl(url)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject invalid URLs', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Non-Instagram domains
            fc.webUrl({ validSchemes: ['https'] }).filter(url => !url.includes('instagram.com')),
            // Instagram URLs without /p/ pattern
            fc.constant('https://www.instagram.com/user/profile/'),
            fc.constant('https://www.instagram.com/'),
            // Invalid schemes
            fc.constant('http://www.instagram.com/p/test123/'),
            fc.constant('ftp://www.instagram.com/p/test123/'),
            // Malformed URLs
            fc.string().filter(s => !s.includes('instagram.com/p/'))
          ),
          (url) => {
            expect(instagramService.isValidInstagramUrl(url)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should parse valid Instagram URLs correctly', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[A-Za-z0-9_-]{11}$/),
          (postId) => {
            const url = `https://www.instagram.com/p/${postId}/`;
            const parsed = instagramService.parseInstagramUrl(url);
            expect(parsed).toBe(postId);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: instagram-gallery-manager, Property 4: Thumbnail Extraction
  // For any valid Instagram embed URL processed, the system should extract 
  // at least one media URL that can be used as a thumbnail.

  describe('Property 4: Thumbnail Extraction', () => {
    it('should create post with thumbnail URL for any valid Instagram URL', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[A-Za-z0-9_-]{11}$/),
          (postId) => {
            const url = `https://www.instagram.com/p/${postId}/`;
            const post = instagramService.createPostFromEmbedSimple(url);
            
            // Verify thumbnail URL exists and is not empty
            expect(post.thumbnailUrl).toBeTruthy();
            expect(post.thumbnailUrl.length).toBeGreaterThan(0);
            
            // Verify mediaUrls array has at least one URL
            expect(post.mediaUrls).toHaveLength(1);
            expect(post.mediaUrls[0]).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests: URL Parsing and Validation', () => {
    it('should validate correct Instagram URL formats', () => {
      const validUrls = [
        'https://www.instagram.com/p/C-170UNSoqM/',
        'https://instagram.com/p/C-170UNSoqM/',
        'https://www.instagram.com/p/ABC123xyz_-/',
        'https://www.instagram.com/p/test1234567',
      ];

      validUrls.forEach(url => {
        expect(instagramService.isValidInstagramUrl(url)).toBe(true);
      });
    });

    it('should reject invalid Instagram URL formats', () => {
      const invalidUrls = [
        'https://www.facebook.com/p/test/',
        'https://www.instagram.com/user/profile/',
        'https://www.instagram.com/',
        'http://www.instagram.com/p/test/', // http instead of https
        'not a url',
        '',
        'https://www.instagram.com/reel/test/',
      ];

      invalidUrls.forEach(url => {
        expect(instagramService.isValidInstagramUrl(url)).toBe(false);
      });
    });

    it('should parse post ID from valid URLs', () => {
      const testCases = [
        { url: 'https://www.instagram.com/p/C-170UNSoqM/', expected: 'C-170UNSoqM' },
        { url: 'https://instagram.com/p/ABC123/', expected: 'ABC123' },
        { url: 'https://www.instagram.com/p/test_123-xyz', expected: 'test_123-xyz' },
      ];

      testCases.forEach(({ url, expected }) => {
        expect(instagramService.parseInstagramUrl(url)).toBe(expected);
      });
    });

    it('should throw error for invalid URLs when parsing', () => {
      const invalidUrls = [
        'https://www.facebook.com/p/test/',
        'not a url',
      ];

      invalidUrls.forEach(url => {
        expect(() => instagramService.parseInstagramUrl(url)).toThrow();
      });
    });

    it('should extract media URLs from JSON data', () => {
      const mockData = JSON.stringify({
        display_url: 'https://example.com/image1.jpg',
        video_url: 'https://example.com/video1.mp4',
      });

      const urls = instagramService.extractMediaUrls(mockData);
      expect(urls).toContain('https://example.com/image1.jpg');
      expect(urls).toContain('https://example.com/video1.mp4');
    });

    it('should extract media URLs from HTML', () => {
      const mockHtml = `
        <img src="https://example.com/image1.jpg" />
        <img src="https://example.com/image2.png" />
        <video src="https://example.com/video1.mp4"></video>
      `;

      const urls = instagramService.extractMediaUrls(mockHtml);
      expect(urls.length).toBeGreaterThan(0);
    });

    it('should handle carousel data', () => {
      const mockCarouselData = JSON.stringify({
        display_url: 'https://example.com/main.jpg',
        edge_sidecar_to_children: {
          edges: [
            { node: { display_url: 'https://example.com/slide1.jpg' } },
            { node: { display_url: 'https://example.com/slide2.jpg' } },
            { node: { video_url: 'https://example.com/slide3.mp4' } },
          ],
        },
      });

      const urls = instagramService.extractMediaUrls(mockCarouselData);
      expect(urls).toContain('https://example.com/main.jpg');
      expect(urls).toContain('https://example.com/slide1.jpg');
      expect(urls).toContain('https://example.com/slide2.jpg');
      expect(urls).toContain('https://example.com/slide3.mp4');
    });

    it('should remove duplicate URLs', () => {
      const mockData = JSON.stringify({
        display_url: 'https://example.com/image1.jpg',
        video_url: 'https://example.com/image1.jpg', // duplicate
      });

      const urls = instagramService.extractMediaUrls(mockData);
      expect(urls).toHaveLength(1);
      expect(urls[0]).toBe('https://example.com/image1.jpg');
    });

    it('should create post from embed with simple method', () => {
      const url = 'https://www.instagram.com/p/C-170UNSoqM/';
      const post = instagramService.createPostFromEmbedSimple(url);

      expect(post.id).toContain('ig-C-170UNSoqM');
      expect(post.embedUrl).toBe(url);
      expect(post.thumbnailUrl).toBeTruthy();
      expect(post.mediaUrls).toHaveLength(1);
      expect(post.mediaType).toBe('IMAGE');
      expect(post.order).toBe(0);
      expect(post.createdAt).toBeTruthy();
    });

    it('should throw error when creating post from invalid URL', () => {
      const invalidUrl = 'https://www.facebook.com/post/123/';
      expect(() => instagramService.createPostFromEmbedSimple(invalidUrl)).toThrow('Invalid Instagram URL');
    });
  });
});
