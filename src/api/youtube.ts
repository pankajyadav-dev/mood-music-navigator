
import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyCHe74pDlOPPo_Tu51_frtInyAx5rEmOx0';
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

// Get trending music videos
export const getTrendingMusicVideos = async (maxResults: number = 10): Promise<YoutubeVideo[]> => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params: {
        part: 'snippet',
        chart: 'mostPopular',
        videoCategoryId: '10', // Music category
        maxResults: maxResults,
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items.map((item: any) => ({
        id: item.id,
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

// Get videos by mood and genre
export const getMoodBasedVideos = async (mood: string, maxResults: number = 10): Promise<YoutubeVideo[]> => {
  const moodGenres: Record<string, string[]> = {
    happy: ['happy music', 'upbeat songs', 'feel good music'],
    sad: ['sad songs', 'emotional music', 'melancholy songs'],
    energetic: ['workout music', 'pump up songs', 'energetic music'],
    chill: ['lofi music', 'chill beats', 'relaxing songs'],
    romantic: ['love songs', 'romantic music', 'slow dance songs'],
    focus: ['focus music', 'concentration music', 'study beats']
  };

  const genres = moodGenres[mood.toLowerCase()] || ['popular music'];
  const randomGenre = genres[Math.floor(Math.random() * genres.length)];
  
  return searchYoutubeVideos(randomGenre, maxResults);
};
