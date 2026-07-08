import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePageTitle } from '../hooks/usePageTitle';

beforeEach(() => {
  document.title = 'Mother Daughter Roots';
});

// Feature: ecommerce-ui-improvements, Property 13: usePageTitle sets document.title to the provided string
describe('usePageTitle — sets title', () => {
  it('sets document.title to the provided string on mount', () => {
    const titles = [
      'Shop — Mother Daughter Roots',
      'FAQ — Mother Daughter Roots',
      'Contact — Mother Daughter Roots',
      'Our Story — Mother Daughter Roots',
      'Ubtan Glow Bathing Bar — Mother Daughter Roots',
    ];
    for (const title of titles) {
      const { unmount } = renderHook(() => usePageTitle(title));
      expect(document.title).toBe(title);
      unmount();
      document.title = 'Mother Daughter Roots';
    }
  });

  it('does not set document.title when title is falsy', () => {
    const { unmount } = renderHook(() => usePageTitle(''));
    // Empty string is falsy — title should stay unchanged
    expect(document.title).toBe('Mother Daughter Roots');
    unmount();
  });
});

// Feature: ecommerce-ui-improvements, Property 14: usePageTitle resets document.title on unmount
describe('usePageTitle — resets on unmount', () => {
  it('resets document.title to "Mother Daughter Roots" on unmount', () => {
    const titles = [
      'Shop — Mother Daughter Roots',
      'FAQ — Mother Daughter Roots',
      'Contact — Mother Daughter Roots',
    ];
    for (const title of titles) {
      const { unmount } = renderHook(() => usePageTitle(title));
      expect(document.title).toBe(title);
      unmount();
      expect(document.title).toBe('Mother Daughter Roots');
    }
  });
});
