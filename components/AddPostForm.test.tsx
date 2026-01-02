import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPostForm from './AddPostForm';

describe('AddPostForm', () => {
  it('should render form with input and button', () => {
    const mockOnAddPost = vi.fn();
    render(<AddPostForm onAddPost={mockOnAddPost} isLoading={false} />);
    
    expect(screen.getByLabelText('Instagram Post URL')).toBeDefined();
    expect(screen.getByText('Add Post')).toBeDefined();
  });

  it('should show error for empty URL', async () => {
    const mockOnAddPost = vi.fn();
    render(<AddPostForm onAddPost={mockOnAddPost} isLoading={false} />);
    
    const button = screen.getByText('Add Post');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter an Instagram URL')).toBeDefined();
    });
  });

  it('should show error for invalid URL', async () => {
    const mockOnAddPost = vi.fn();
    render(<AddPostForm onAddPost={mockOnAddPost} isLoading={false} />);
    
    const input = screen.getByLabelText('Instagram Post URL');
    fireEvent.change(input, { target: { value: 'https://facebook.com/post' } });
    
    const button = screen.getByText('Add Post');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid Instagram URL/)).toBeDefined();
    });
  });

  it('should call onAddPost with valid URL', async () => {
    const mockOnAddPost = vi.fn().mockResolvedValue(undefined);
    render(<AddPostForm onAddPost={mockOnAddPost} isLoading={false} />);
    
    const input = screen.getByLabelText('Instagram Post URL');
    fireEvent.change(input, { target: { value: 'https://www.instagram.com/p/test123/' } });
    
    const button = screen.getByText('Add Post');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockOnAddPost).toHaveBeenCalledWith('https://www.instagram.com/p/test123/');
    });
  });

  it('should show loading state', () => {
    const mockOnAddPost = vi.fn();
    render(<AddPostForm onAddPost={mockOnAddPost} isLoading={true} />);
    
    expect(screen.getByText('Adding...')).toBeDefined();
    const button = screen.getByText('Adding...');
    expect(button).toHaveProperty('disabled', true);
  });

  it('should show success message after adding post', async () => {
    const mockOnAddPost = vi.fn().mockResolvedValue(undefined);
    render(<AddPostForm onAddPost={mockOnAddPost} isLoading={false} />);
    
    const input = screen.getByLabelText('Instagram Post URL');
    fireEvent.change(input, { target: { value: 'https://www.instagram.com/p/test123/' } });
    
    const button = screen.getByText('Add Post');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Post added successfully!')).toBeDefined();
    });
  });

  it('should clear input after successful add', async () => {
    const mockOnAddPost = vi.fn().mockResolvedValue(undefined);
    render(<AddPostForm onAddPost={mockOnAddPost} isLoading={false} />);
    
    const input = screen.getByLabelText('Instagram Post URL') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'https://www.instagram.com/p/test123/' } });
    
    const button = screen.getByText('Add Post');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
