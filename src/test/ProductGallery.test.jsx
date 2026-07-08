import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import ProductGallery from '../components/ProductGallery';

const makeImages = (n) => Array.from({ length: n }, (_, i) => `/img/product-${i}.jpg`);
const TEST_VIDEO = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

// Feature: ecommerce-ui-improvements, Property 5: ProductGallery displays the first image as the initial main image
describe('ProductGallery — initial main image', () => {
  it('renders the first image as the main viewer on initial render', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (count) => {
        const images = makeImages(count);
        const { unmount, container } = render(
          <ProductGallery images={images} videoUrl={TEST_VIDEO} productName="Test" />
        );
        // First img in the main viewer area
        const imgs = container.querySelectorAll('img');
        expect(imgs[0].getAttribute('src')).toBe(images[0]);
        unmount();
      }),
      { numRuns: 50 }
    );
  });
});

// Feature: ecommerce-ui-improvements, Property 6: thumbnail strip includes all images + 1 video thumbnail
describe('ProductGallery — thumbnail strip count', () => {
  it('renders images.length + 1 (video) thumbnails in the strip', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (count) => {
        const images = makeImages(count);
        const { unmount } = render(
          <ProductGallery images={images} videoUrl={TEST_VIDEO} productName="Test" />
        );
        // images + 1 video = total items in strip
        const thumbButtons = screen.getAllByRole('listitem');
        expect(thumbButtons).toHaveLength(images.length + 1);
        unmount();
      }),
      { numRuns: 50 }
    );
  });
});

// Feature: ecommerce-ui-improvements, Property 7: clicking a thumbnail marks it active
describe('ProductGallery — thumbnail active state', () => {
  it('first thumbnail is active by default', () => {
    const { container } = render(
      <ProductGallery images={makeImages(3)} videoUrl={TEST_VIDEO} productName="Test" />
    );
    const buttons = container.querySelectorAll('button[aria-label]');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('clicking the second thumbnail marks it active', () => {
    const { container } = render(
      <ProductGallery images={makeImages(3)} videoUrl={TEST_VIDEO} productName="Test" />
    );
    const buttons = container.querySelectorAll('button[aria-label]');
    fireEvent.click(buttons[1]);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('clicking the video thumbnail marks it active and renders iframe', () => {
    const { container } = render(
      <ProductGallery images={makeImages(2)} videoUrl={TEST_VIDEO} productName="Test" />
    );
    const buttons = container.querySelectorAll('button[aria-label]');
    const videoButton = buttons[buttons.length - 1]; // last item = video
    fireEvent.click(videoButton);
    expect(videoButton.getAttribute('aria-pressed')).toBe('true');
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe.getAttribute('title')).toBe('Product video');
    expect(iframe.getAttribute('loading')).toBe('lazy');
  });
});

// Feature: ecommerce-ui-improvements, Property 8: iframe renders with accessibility attributes when video thumbnail clicked
describe('ProductGallery — video iframe accessibility', () => {
  it('iframe has title="Product video" and loading="lazy" when video is selected', () => {
    const { container } = render(
      <ProductGallery images={makeImages(2)} videoUrl={TEST_VIDEO} productName="Test" />
    );
    const buttons = container.querySelectorAll('button[aria-label]');
    fireEvent.click(buttons[buttons.length - 1]);
    const iframe = container.querySelector('iframe');
    expect(iframe.getAttribute('title')).toBe('Product video');
    expect(iframe.getAttribute('loading')).toBe('lazy');
  });
});
