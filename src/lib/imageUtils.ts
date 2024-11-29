export function getOptimizedImageUrl(
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  // Parse the Cloudinary URL
  const urlParts = originalUrl.split('/upload/');
  if (urlParts.length !== 2) return originalUrl;

  // Build transformation string
  const transformations = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format && options.format !== 'auto') transformations.push(`f_${options.format}`);

  // Add transformations to URL
  if (transformations.length > 0) {
    return `${urlParts[0]}/upload/${transformations.join(',')}/c_limit/${urlParts[1]}`;
  }

  return originalUrl;
}
