
import React from 'react';
import { Play, Heart, Star, Download } from 'lucide-react';
import { Song } from '../types';
import { api } from '../services/supabase';
import { useToast } from '../App';

interface MusicCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  isFavorite?: boolean;
  userId?: string;
  onFavoriteToggle?: () => void;
  featured?: boolean;
}

const MusicCard: React.FC<MusicCardProps> = ({ song, onPlay, isFavorite, userId, onFavoriteToggle, featured }) => {
  const addToast = useToast();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      addToast("Faça login para salvar suas músicas favoritas!", "info");
      return;
    }
    try {
      await api.favorites.toggle(userId, song.id, !!isFavorite);
      if (onFavoriteToggle) onFavoriteToggle();
      addToast(isFavorite ? "Removida dos favoritos" : "Adicionada aos favoritos!", "success");
    } catch (error) {
      addToast("Erro ao processar favorito. Tente novamente.", "error");
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToast("Iniciando download...", "info");
    
    // Tentativa de download: se for link direto do Supabase, forçamos o download via blob ou link
    if (song.originalUrl.includes('supabase.co')) {
       const link = document.createElement('a');
       link.href = song.originalUrl;
       link.setAttribute('download', `${song.title} - Som do Reino.mp3`);
       link.setAttribute('target', '_blank');
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
    } else {
      // Caso contrário, apenas abrimos o link original
      window.open(song.originalUrl, '_blank');
    }
  };

  return (
    <div className={`group relative bg-[#121214] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/5 hover:-translate-y-1 border border-white/5 ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}>
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={song.cover} 
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4">
          <button 
            onClick={() => onPlay(song)}
            className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center text-black transform scale-75 group-hover:scale-100 transition-all shadow-2xl hover:bg-white"
          >
            <Play fill="currentColor" size={28} className="ml-1" />
          </button>
        </div>
        
        {song.isFeatured && (
          <div className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-[0.1em] shadow-lg flex items-center gap-1.5 px-2 py-1 rounded">
            <Star size={10} fill="currentColor" /> Destaque
          </div>
        )}

        <button 
          onClick={handleDownload}
          className="absolute top-4 right-4 bg-black/50 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
          title="Baixar Música"
        >
          <Download size={16} />
        </button>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-white truncate text-base mb-1">{song.title}</h3>
        <p className="text-[#6b7280] text-xs font-bold uppercase tracking-wider truncate mb-4">{song.artistName}</p>
        
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-tighter">Alcance</span>
            <span className="text-white text-xs font-black">{song.playCount?.toLocaleString() || 0}</span>
          </div>
          
          <button 
            onClick={handleToggleFavorite}
            className={`p-2.5 rounded-full transition-all ${isFavorite ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-[#6b7280] hover:text-white'}`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
