
const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';
const CLIENT_ID = 'your_client_id'; // This will be replaced with actual API key

export class JamendoAPI {
  private static async fetchFromAPI(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${JAMENDO_API_BASE}/${endpoint}`);
    url.searchParams.append('client_id', CLIENT_ID);
    url.searchParams.append('format', 'json');
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    console.log('Fetching from Jamendo API:', url.toString());
    
    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Jamendo API error:', error);
      return [];
    }
  }

  static async getFeaturedTracks(limit = 20) {
    return this.fetchFromAPI('tracks', {
      order: 'popularity_total',
      limit: limit.toString(),
      include: 'musicinfo',
      imagesize: '300'
    });
  }

  static async searchTracks(query: string, limit = 20) {
    return this.fetchFromAPI('tracks', {
      search: query,
      limit: limit.toString(),
      include: 'musicinfo',
      imagesize: '300'
    });
  }

  static async searchArtists(query: string, limit = 20) {
    return this.fetchFromAPI('artists', {
      search: query,
      limit: limit.toString(),
      imagesize: '300'
    });
  }

  static async searchAlbums(query: string, limit = 20) {
    return this.fetchFromAPI('albums', {
      search: query,
      limit: limit.toString(),
      include: 'musicinfo',
      imagesize: '300'
    });
  }

  static async getArtistTracks(artistId: string, limit = 50) {
    return this.fetchFromAPI('tracks', {
      artist_id: artistId,
      limit: limit.toString(),
      include: 'musicinfo',
      imagesize: '300'
    });
  }

  static async getAlbumTracks(albumId: string) {
    return this.fetchFromAPI('tracks', {
      album_id: albumId,
      include: 'musicinfo',
      imagesize: '300'
    });
  }

  static async getArtistInfo(artistId: string) {
    const results = await this.fetchFromAPI('artists', {
      id: artistId,
      imagesize: '300'
    });
    return results[0] || null;
  }

  static async getAlbumInfo(albumId: string) {
    const results = await this.fetchFromAPI('albums', {
      id: albumId,
      include: 'musicinfo',
      imagesize: '300'
    });
    return results[0] || null;
  }

  static async getRecommendations(limit = 20) {
    return this.fetchFromAPI('tracks', {
      order: 'releasedate_desc',
      limit: limit.toString(),
      include: 'musicinfo',
      imagesize: '300'
    });
  }

  static async getPopularTracks(limit = 20) {
    return this.fetchFromAPI('tracks', {
      order: 'popularity_week',
      limit: limit.toString(),
      include: 'musicinfo',
      imagesize: '300'
    });
  }
}
