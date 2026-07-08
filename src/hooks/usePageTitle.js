import { useEffect } from 'react';

/**
 * Sets document.title for the current page.
 * Resets to the brand default on unmount.
 *
 * @param {string} title - The page-specific title to set.
 */
export function usePageTitle(title) {
  useEffect(() => {
    if (!title) return;
    document.title = title;
    return () => {
      document.title = 'Mother Daughter Roots';
    };
  }, [title]);
}
