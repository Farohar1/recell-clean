const brandFallbacks = {
  Apple: '/images/iphone_13.jpg',
  Samsung: '/images/samsung_s23_ultra.webp',
  Google: '/images/google_pixel_7_pro.jpeg',
  OnePlus: '/images/oneplus_11.jpg',
};

export const getListingImageSrc = (image, listing = {}) => {
  const fallback = brandFallbacks[listing.brand] || '/images/iphone_13.jpg';
  if (!image || typeof image !== 'string') return '';
  const value = image.trim();

  if (
    value.startsWith('data:image/') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/')
  ) {
    return value;
  }

  return value ? `/${value.replace(/^\/+/, '')}` : fallback;
};

export const getListingFallbackImageSrc = (listing = {}) => {
  return brandFallbacks[listing.brand] || '/images/iphone_13.jpg';
};
