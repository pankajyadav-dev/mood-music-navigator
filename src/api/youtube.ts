import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyBQEJw1xFK34KdoDGYCcKZkyiFJ23Ew5Xc';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export interface YoutubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  publishedAt: string;
}

export const searchYoutubeVideos = async (query: string, maxResults: number = 10): Promise<YoutubeVideo[]> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: maxResults,
        q: `${query} official audio`,
        type: 'video',
        videoCategoryId: '10', // Music category
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    return [];
  }
};

export const getRelatedVideos = async (videoId: string, maxResults: number = 10): Promise<YoutubeVideo[]> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: maxResults,
        relatedToVideoId: videoId,
        type: 'video',
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items
        .filter((item: any) => item.id.videoId) // Ensure we have a valid videoId
        .map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          publishedAt: item.snippet.publishedAt
        }));
    }
    return [];
  } catch (error) {
    console.error('Error getting related videos:', error);
    return [];
  }
};

export const getVideoDetails = async (videoId: string): Promise<any> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting video details:', error);
    return null;
  }
};

export const getTrendingMusicVideos = async (maxResults: number = 10): Promise<YoutubeVideo[]> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: maxResults,
        q: 'haryanvi songs latest',
        type: 'video',
        videoCategoryId: '10',
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting trending music videos:', error);
    return [];
  }
};

export const getMoodBasedVideos = async (mood: string, maxResults: number = 10): Promise<YoutubeVideo[]> => {
  const moodGenres: Record<string, string[]> = {
    happy: [
      'haryanvi dance songs',
      'haryanvi dj songs',
      'haryanvi party songs',
      'sapna choudhary songs'
    ],
    sad: [
      'haryanvi sad songs',
      'haryanvi heart break songs',
      'haryanvi emotional songs'
    ],
    energetic: [
      'haryanvi workout songs',
      'haryanvi gym songs',
      'haryanvi power songs',
      'new haryanvi dance songs'
    ],
    chill: [
      'haryanvi chill songs',
      'haryanvi romantic songs slow',
      'haryanvi relaxing songs'
    ],
    romantic: [
      'haryanvi love songs',
      'haryanvi romantic songs',
      'haryanvi couple songs'
    ],
    focus: [
      'haryanvi instrumental',
      'haryanvi background music',
      'haryanvi classical'
    ]
  };

  const genres = moodGenres[mood.toLowerCase()] || ['haryanvi popular songs'];
  const randomGenre = genres[Math.floor(Math.random() * genres.length)];
  return searchYoutubeVideos(randomGenre, maxResults);
};
