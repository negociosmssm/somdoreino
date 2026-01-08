
import { createClient } from '@supabase/supabase-js';
import { Song, Artist, SiteSettings, BlogPost, UserProfile } from '../types';

const SUPABASE_URL = 'https://emvompohgmjckexucoco.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dyFe1EOisjGbaSg31RWUUw_ds06jjXv';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const uploadFile = async (bucket: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

export const api = {
  auth: {
    signUp: async (email: string, pass: string) => {
      const { data, error } = await supabase.auth.signUp({ email, password: pass });
      if (error) throw error;
      return data;
    },
    signIn: async (email: string, pass: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      return data;
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
    getProfile: async (userId: string): Promise<UserProfile | null> => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, role')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) return null;
        return data;
      } catch (e) {
        return null;
      }
    }
  },
  songs: {
    getAll: async (): Promise<Song[]> => {
      const { data, error } = await supabase.from('songs').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    update: async (id: string, updates: Partial<Song>) => {
      const { error } = await supabase.from('songs').update(updates).eq('id', id);
      if (error) throw error;
    },
    updatePlayCount: async (id: string, current: number) => {
      await supabase.from('songs').update({ playCount: current + 1 }).eq('id', id);
    },
    insert: async (song: Omit<Song, 'id'>) => {
      const { data, error } = await supabase.from('songs').insert(song).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) throw error;
    }
  },
  favorites: {
    get: async (userId: string): Promise<string[]> => {
      const { data, error } = await supabase.from('favorites').select('song_id').eq('user_id', userId);
      if (error) return [];
      return data.map(f => f.song_id);
    },
    toggle: async (userId: string, songId: string, isFavorite: boolean) => {
      if (isFavorite) {
        await supabase.from('favorites').delete().eq('user_id', userId).eq('song_id', songId);
      } else {
        await supabase.from('favorites').insert({ user_id: userId, song_id: songId });
      }
    }
  },
  history: {
    add: async (userId: string, songId: string) => {
      try {
        await supabase.from('play_history').insert({ user_id: userId, song_id: songId });
      } catch (e) {}
    },
    getRecent: async (userId: string): Promise<string[]> => {
      const { data } = await supabase.from('play_history')
        .select('song_id')
        .eq('user_id', userId)
        .order('played_at', { ascending: false })
        .limit(20);
      return Array.from(new Set(data?.map(d => d.song_id) || []));
    }
  },
  artists: {
    getAll: async () => {
      const { data, error } = await supabase.from('artists').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
    insert: async (artist: Omit<Artist, 'id'>) => {
      const { data, error } = await supabase.from('artists').insert(artist).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Artist>) => {
      const { error } = await supabase.from('artists').update(updates).eq('id', id);
      if (error) throw error;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('artists').delete().eq('id', id);
      if (error) throw error;
    }
  },
  settings: {
    get: async () => {
      const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
      if (error) return null;
      return data;
    },
    update: async (updates: Partial<SiteSettings>) => {
      const { error } = await supabase.from('settings').update(updates).eq('id', 1);
      if (error) throw error;
    }
  },
  posts: {
    getAll: async () => {
      const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    insert: async (post: Omit<BlogPost, 'id'>) => {
      const { data, error } = await supabase.from('posts').insert(post).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<BlogPost>) => {
      const { error } = await supabase.from('posts').update(updates).eq('id', id);
      if (error) throw error;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    }
  }
};
