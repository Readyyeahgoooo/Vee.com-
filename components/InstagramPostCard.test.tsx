import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InstagramPostCard from './InstagramPostCard';
import { InstagramGalleryPost } from '../types';

const mockPost: InstagramGalleryPost = {
  id: 'test-1',
  embedUrl: 'https://www.instagram.com/p/test/',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  mediaUrls: ['https://example.com/media.jpg'],
  caption: 'Test caption',
  author: 'testuser',
  timestamp: new Date().toISOString(),
  mediaType: 'IMAGE',
  order: 0,
  createdAt: new Date().toISOString(),
};

describe('InstagramPostCard', () => {
  it('should render thumbnail image', () => {
    const mockOnClick = vi.fn();
    render(
      <InstagramPostCard
        post={mockPost}
        onClick={mockOnClick}
        isAdminMode={false}
      />
    );
    
    const img = screen.getByAlt('Test caption');
    expect(img).toBeDefined();
  });

  it('should call onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(
      <InstagramPostCard
        post={mockPost}
        onClick={mockOnClick}
        isAdminMode={false}
      />
    );
    
    const img = screen.getByAlt('Test caption');
    fireEvent.click(img);
    
    expect(mockOnClick).toHaveBeenCalledWith(mockPost);
  });

  it('should show admin controls when in admin mode', () => {
    const mockOnClick = vi.fn();
    const mockOnDelete = vi.fn();
    
    render(
      <InstagramPostCard
        post={mockPost}
        onClick={mockOnClick}
        isAdminMode={true}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByLabelText('Delete post')).toBeDefined();
  });

  it('should not show admin controls when not in admin mode', () => {
    const mockOnClick = vi.fn();
    
    render(
      <InstagramPostCard
        post={mockPost}
        onClick={mockOnClick}
        isAdminMode={false}
      />
    );
    
    expect(screen.queryByLabelText('Delete post')).toBeNull();
  });

  it('should call onDelete when delete button clicked', () => {
    const mockOnClick = vi.fn();
    const mockOnDelete = vi.fn();
    
    render(
      <InstagramPostCard
        post={mockPost}
        onClick={mockOnClick}
        isAdminMode={true}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByLabelText('Delete post');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('test-1');
    expect(mockOnClick).not.toHaveBeenCalled(); // Should not trigger card click
  });
});
