/**
 * YouTube URL Utilities
 * Handles conversion between different YouTube URL formats and thumbnail extraction
 */

/**
 * Convert various YouTube URL formats to embed format
 * Supports: full watch URLs, share URLs, YouTube IDs, embed URLs
 * @param {string} url - The YouTube URL or video ID
 * @returns {string} - The embed URL
 */
export const convertToEmbedUrl = (url) => {
  if (!url) return '';
  
  let videoId = '';
  
  // Format 1: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&\n?#]+)/);
  if (watchMatch && watchMatch[1]) {
    videoId = watchMatch[1];
  }
  
  // Format 2: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&\n]+)/);
  if (!videoId && shortMatch && shortMatch[1]) {
    videoId = shortMatch[1];
  }
  
  // Format 3: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&\n]+)/);
  if (!videoId && embedMatch && embedMatch[1]) {
    videoId = embedMatch[1];
  }
  
  // Format 4: Just the video ID (11 characters, alphanumeric with - and _)
  if (!videoId && url.match(/^[a-zA-Z0-9_-]{11}$/)) {
    videoId = url;
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - The YouTube URL
 * @returns {string} - The video ID or empty string
 */
export const getYouTubeVideoId = (url) => {
  if (!url) return '';
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /youtu\.be\/([^?&\n]+)/,
    /youtube\.com\/embed\/([^?&\n]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // If it's already a video ID
  if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
    return url;
  }
  
  return '';
};

/**
 * Get YouTube thumbnail URL
 * Returns maxresdefault (highest quality) with fallback to mqdefault
 * @param {string} url - The YouTube URL or video ID
 * @returns {string|null} - The thumbnail URL or null
 */
export const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  
  // maxresdefault gives the highest quality (1280x720)
  // but may not always be available, so we include fallback
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

/**
 * Get YouTube thumbnail with fallback sizes
 * Returns array of thumbnail URLs ordered by preference
 * @param {string} url - The YouTube URL or video ID
 * @returns {string[]} - Array of thumbnail URLs
 */
export const getYouTubeThumbnailFallbacks = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return [];
  
  return [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, // 1280x720
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,     // 640x480
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,     // 480x360
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,     // 320x180
    `https://img.youtube.com/vi/${videoId}/default.jpg`,       // 120x90
  ];
};

/**
 * Validate if a URL is a valid YouTube URL or video ID
 * @param {string} url - The URL or video ID to validate
 * @returns {boolean} - True if valid
 */
export const isValidYouTubeUrl = (url) => {
  if (!url) return false;
  
  // Check if it's a valid YouTube URL format
  const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube|youtu)\.(com|be)\//;
  const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  
  return youtubeUrlPattern.test(url) || videoIdPattern.test(url);
};

/**
 * Get duration from YouTube URL if available
 * Note: This requires additional context as the duration is not available
 * in the URL itself and would need API call or video metadata
 * @param {string} url - The YouTube URL
 * @returns {null} - Returns null (requires backend implementation)
 */
export const getYouTubeDuration = (url) => {
  // Duration is not available from URL alone
  // This would require YouTube API call
  return null;
};

export default {
  convertToEmbedUrl,
  getYouTubeVideoId,
  getYouTubeThumbnail,
  getYouTubeThumbnailFallbacks,
  isValidYouTubeUrl,
  getYouTubeDuration,
};
