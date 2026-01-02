import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminButton from './AdminButton';

describe('AdminButton', () => {
  it('should render with correct label', () => {
    const mockOnClick = vi.fn();
    render(<AdminButton onClick={mockOnClick} isAdminMode={false} />);
    
    expect(screen.getByText('Vee.in')).toBeDefined();
  });

  it('should call onClick handler when clicked', () => {
    const mockOnClick = vi.fn();
    render(<AdminButton onClick={mockOnClick} isAdminMode={false} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should show active styling when in admin mode', () => {
    const mockOnClick = vi.fn();
    render(<AdminButton onClick={mockOnClick} isAdminMode={true} />);
    
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-yellow-500');
    expect(button.className).toContain('text-black');
  });

  it('should show inactive styling when not in admin mode', () => {
    const mockOnClick = vi.fn();
    render(<AdminButton onClick={mockOnClick} isAdminMode={false} />);
    
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-zinc-900/50');
    expect(button.className).toContain('text-zinc-500');
  });

  it('should show indicator dot when in admin mode', () => {
    const mockOnClick = vi.fn();
    render(<AdminButton onClick={mockOnClick} isAdminMode={true} />);
    
    expect(screen.getByText('● Vee.in')).toBeDefined();
  });

  it('should not show indicator dot when not in admin mode', () => {
    const mockOnClick = vi.fn();
    render(<AdminButton onClick={mockOnClick} isAdminMode={false} />);
    
    const button = screen.getByRole('button');
    expect(button.textContent).toBe('Vee.in');
    expect(button.textContent).not.toContain('●');
  });

  it('should have proper aria-label for accessibility', () => {
    const mockOnClick = vi.fn();
    const { rerender } = render(<AdminButton onClick={mockOnClick} isAdminMode={false} />);
    
    let button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Enter admin mode');
    
    rerender(<AdminButton onClick={mockOnClick} isAdminMode={true} />);
    button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Exit admin mode');
  });
});
