export const getYouTubeVideoId = (url: "any") => {
  // Regular expressions for different YouTube URL formats
  const regexes = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, // https://www.youtube.com/watch?v=VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/, // https://youtu.be/VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/, // https://www.youtube.com/embed/VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/, // https://www.youtube.com/v/VIDEO_ID
  ];

  for (const regex of regexes) {
    const match = url.match(regex);
    if (match) {
      return match[1];
    }
  }

  // Return null if no match is found
  return null;
};
