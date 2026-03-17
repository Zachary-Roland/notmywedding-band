const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY ?? "";
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID ?? "";

interface YouTubeVideo {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export async function fetchLatestVideos(maxResults = 10): Promise<YouTubeVideo[]> {
  if (!API_KEY || !CHANNEL_ID) {
    throw new Error("YouTube API key or channel ID not configured");
  }

  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
  );
  if (!channelRes.ok) throw new Error("Failed to fetch channel info");
  const channelData = await channelRes.json();
  const uploadsPlaylistId =
    channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) throw new Error("Could not find uploads playlist");

  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${API_KEY}`
  );
  if (!playlistRes.ok) throw new Error("Failed to fetch playlist items");
  const playlistData = await playlistRes.json();

  return (playlistData.items ?? []).map(
    (item: { snippet: { resourceId: { videoId: string }; title: string; thumbnails: { high: { url: string } }; publishedAt: string } }) => ({
      youtubeId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
    })
  );
}
