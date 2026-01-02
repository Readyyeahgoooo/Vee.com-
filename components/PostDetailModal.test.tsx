import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostDetailModal from './PostDetailModal';
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

describe('PostDetailModal', () => {
  it('should not render when isOpen is false', () => {
    const mockOnClose = vi.fn();
    const { container } = render(
      <PostDetailModal post={mockPost} isOpen={false} onClose={mockOnClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    const mockOnClose = vi.fn();
    render(<PostDetailModal post={mockPost} isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Test caption')).toBeDefined();
  });

  it('should call onClose when close button clicked', () => {
    const mockOnClose = vi.fn();
    render(<PostDetailModal post={mockPost} isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should display post caption and author', () => {
    const mockOnClose = vi.fn();
    render(<PostDetailModal post={mockPost} isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Test caption')).toBeDefined();
    expect(screen.getByText(/@testuser/)).toBeDefined();
  });
});
