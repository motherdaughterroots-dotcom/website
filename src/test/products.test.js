import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { products, getProductById } from '../data/products';

const YOUTUBE_EMBED_RE = /^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]+$/;

// Feature: ecommerce-ui-improvements, Property 1: Every product has an images array with at least 3 entries
describe('Product data — images array', () => {
  it('every product has an images array with at least 3 non-empty string entries', () => {
    fc.assert(
      fc.property(fc.constantFrom(...products), (product) => {
        expect(Array.isArray(product.images)).toBe(true);
        expect(product.images.length).toBeGreaterThanOrEqual(3);
        product.images.forEach(img => {
          expect(typeof img).toBe('string');
          expect(img.length).toBeGreaterThan(0);
        });
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: ecommerce-ui-improvements, Property 2: Every product has a valid YouTube embed videoUrl
describe('Product data — videoUrl', () => {
  it('every product has a valid YouTube embed videoUrl', () => {
    fc.assert(
      fc.property(fc.constantFrom(...products), (product) => {
        expect(typeof product.videoUrl).toBe('string');
        expect(YOUTUBE_EMBED_RE.test(product.videoUrl)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: ecommerce-ui-improvements, Property 3: Existing image field is preserved on every product
describe('Product data — image field preserved', () => {
  it('product.image is non-empty and equals product.images[0]', () => {
    fc.assert(
      fc.property(fc.constantFrom(...products), (product) => {
        expect(typeof product.image).toBe('string');
        expect(product.image.length).toBeGreaterThan(0);
        expect(product.image).toBe(product.images[0]);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: ecommerce-ui-improvements, Property 4: getProductById returns a product with both new fields for any valid id
describe('getProductById — new fields present', () => {
  it('returns a product with images (length >= 3) and valid videoUrl for any valid id', () => {
    fc.assert(
      fc.property(fc.constantFrom(...products.map(p => p.id)), (id) => {
        const product = getProductById(id);
        expect(product).toBeDefined();
        expect(Array.isArray(product.images)).toBe(true);
        expect(product.images.length).toBeGreaterThanOrEqual(3);
        expect(YOUTUBE_EMBED_RE.test(product.videoUrl)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
