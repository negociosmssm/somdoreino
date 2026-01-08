
export const convertToEmbedUrl = (url: string): string => {
  if (!url) return '';

  // YouTube
  if (url.includes('youtube.com/watch?v=')) {
    const id = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // Google Drive
  if (url.includes('drive.google.com/file/d/')) {
    const id = url.split('/d/')[1]?.split('/')[0];
    return `https://drive.google.com/file/d/${id}/preview`;
  }

  // Audiomack
  if (url.includes('audiomack.com/song/')) {
    const parts = url.split('audiomack.com/song/')[1];
    return `https://audiomack.com/embed/song/${parts}?background=1`;
  }

  // SoundCloud (simplified)
  if (url.includes('soundcloud.com/')) {
    // Note: SoundCloud embeds usually require an API call to resolve the URL,
    // but for this MVP we'll assume standard direct URL usage or return as is.
    return url; 
  }

  return url; // Fallback
};

export const getPlatformName = (url: string): string => {
  if (url.includes('youtube') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('google.com/drive')) return 'Google Drive';
  if (url.includes('audiomack')) return 'Audiomack';
  if (url.includes('soundcloud')) return 'SoundCloud';
  return 'Externo';
};
