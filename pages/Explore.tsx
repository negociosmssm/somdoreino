
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search as SearchIcon, SlidersHorizontal, Music2, ChevronLeft, ChevronRight, TrendingUp, Clock, Star } from 'lucide-react';
import { AppState, Song, Genre } from '../types';
import MusicCard from '../components/MusicCard';

interface ExploreProps {
  data: AppState;
  onPlay: (song: Song) => void;
}

const GENRES: Genre[] = ['Adoração', 'Louvor', 'Gospel Pop', 'Pentecostal', 'Instrumental', 'Devocional'];
const ITEMS_PER_PAGE = 15;

const Explore: React.FC<ExploreProps> = ({ data, onPlay }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'Todos'>('Todos');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'featured'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSongs = useMemo(() => {
    let result = data.songs.filter(song => {
      const matchesQuery = song.title.toLowerCase().includes(query.toLowerCase()) || 
                           song.artistName?.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = selectedGenre === 'Todos' || song.genre === selectedGenre;
      return matchesQuery && matchesGenre;
    });

    // Ordenação
    if (sortBy === 'popular') result.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (sortBy === 'featured') result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

    return result;
  }, [data.songs, query, selectedGenre, sortBy]);

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
  const currentSongs = filteredSongs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <div className="animate-slide-up">
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Catálogo Sagrado</span>
          <h1 className="text-5xl md:text-7xl font-black text-white font-display tracking-tight leading-none">
            Explorar <br /><span className="text-[#D4AF37]">Louvores</span>
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto animate-fade-in">
          <div className="relative w-full sm:w-80">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4b5563]" size={18} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => {setSearchParams({ q: e.target.value }); setCurrentPage(1);}}
              placeholder="Música ou Ministro..."
              className="bg-[#121214] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white w-full focus:border-[#D4AF37] outline-none transition-all placeholder:text-[#374151] font-medium"
            />
          </div>
          
          <div className="flex bg-[#121214] p-1.5 rounded-2xl border border-white/5 w-full sm:w-auto">
             <button onClick={() => setSortBy('newest')} className={`flex-1 sm:flex-none px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'newest' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-[#6b7280] hover:text-white'}`}>
                <Clock size={14} /> Novos
             </button>
             <button onClick={() => setSortBy('popular')} className={`flex-1 sm:flex-none px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'popular' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-[#6b7280] hover:text-white'}`}>
                <TrendingUp size={14} /> Top
             </button>
             <button onClick={() => setSortBy('featured')} className={`flex-1 sm:flex-none px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'featured' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-[#6b7280] hover:text-white'}`}>
                <Star size={14} /> Destak
             </button>
          </div>
        </div>
      </div>

      {/* Filtros de Gênero Horizontal */}
      <div className="flex overflow-x-auto gap-3 pb-12 no-scrollbar animate-fade-in delay-100">
        <button 
          onClick={() => {setSelectedGenre('Todos'); setCurrentPage(1);}}
          className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedGenre === 'Todos' ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-xl shadow-[#D4AF37]/20' : 'bg-[#121214] text-[#6b7280] hover:border-white/20 border-white/5'}`}
        >
          Todos os Gêneros
        </button>
        {GENRES.map(genre => (
          <button 
            key={genre}
            onClick={() => {setSelectedGenre(genre); setCurrentPage(1);}}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedGenre === genre ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-xl shadow-[#D4AF37]/20' : 'bg-[#121214] text-[#6b7280] hover:border-white/20 border-white/5'}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Resultados em Grid */}
      {currentSongs.length > 0 ? (
        <div className="space-y-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            {currentSongs.map((song, idx) => (
              <div key={song.id} className="animate-slide-up" style={{ animationDelay: `${idx * 40}ms` }}>
                <MusicCard song={song} onPlay={onPlay} userId={data.userProfile?.id} isFavorite={data.favorites.includes(song.id)} />
              </div>
            ))}
          </div>

          {/* Paginação Estilizada */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-10">
              <button 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-14 h-14 rounded-2xl bg-[#121214] border border-white/5 flex items-center justify-center text-white hover:border-[#D4AF37] disabled:opacity-30 disabled:hover:border-white/5 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-12 h-12 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'bg-white/5 text-[#6b7280] hover:bg-white/10'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-14 h-14 rounded-2xl bg-[#121214] border border-white/5 flex items-center justify-center text-white hover:border-[#D4AF37] disabled:opacity-30 disabled:hover:border-white/5 transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
          <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/10 shadow-2xl">
            <Music2 className="text-[#6b7280]" size={40} />
          </div>
          <h3 className="text-3xl font-bold text-white mb-3">Vazio no Momento</h3>
          <p className="text-[#6b7280] max-w-sm font-medium leading-relaxed">Nenhum louvor corresponde aos seus filtros. Tente expandir sua busca.</p>
          <button 
            onClick={() => {setSelectedGenre('Todos'); setSearchParams({}); setSortBy('newest');}}
            className="mt-10 px-8 py-4 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-2xl text-white font-black uppercase text-[10px] tracking-widest transition-all"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
