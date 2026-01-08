
export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  photo: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
  };
}

export type Genre = 'Adoração' | 'Louvor' | 'Gospel Pop' | 'Pentecostal' | 'Instrumental' | 'Devocional';

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName?: string;
  genre: Genre;
  audioUrl: string;
  originalUrl: string;
  cover: string;
  lyricsId?: string;
  date: string;
  isFeatured: boolean;
  playCount: number;
}

// Added Lyric interface to support the lyrics data structure
export interface Lyric {
  id: string;
  songId: string;
  content: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  cover: string;
  author: string;
  date: string;
  category: 'Notícia' | 'Devocional' | 'Evento';
  status: 'published' | 'draft';
}

export interface SiteSettings {
  name: string;
  slogan: string;
  aboutText: string;
  featuredSongId: string;
  contactEmail: string;
}

export interface AppState {
  artists: Artist[];
  songs: Song[];
  posts: BlogPost[];
  // Added lyrics property to AppState
  lyrics: Lyric[];
  settings: SiteSettings;
  history: Song[];
  favorites: string[]; // IDs das músicas favoritas
  userProfile: UserProfile | null;
}
