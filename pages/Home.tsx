
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Music2, Users, Newspaper, PlayCircle } from 'lucide-react';
import { Song, AppState } from '../types';
import MusicCard from '../components/MusicCard';

interface HomeProps {
  data: AppState;
  onPlay: (song: Song) => void;
}

const Home: React.FC<HomeProps> = ({ data, onPlay }) => {
  const featuredSongs = data.songs.filter(s => s.isFeatured);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Worship concert"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="text-[#D4AF37] font-semibold tracking-widest uppercase text-sm mb-4 block animate-fade-in">Bem-vindo ao Altar Digital</span>
          <h1 className="font-display text-5xl md:text-8xl font-black text-white mb-6 leading-tight animate-slide-up">
            SOM DO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#f5e0a3]">REINO</span>
          </h1>
          <p className="text-[#B3B3B3] text-lg md:text-xl max-w-xl mb-10 leading-relaxed animate-slide-up delay-100">
            {data.settings.slogan}. A plataforma oficial para o novo mover do louvor e adoração.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-200">
            <button 
              onClick={() => featuredSongs[0] && onPlay(featuredSongs[0])}
              className="bg-[#D4AF37] hover:bg-[#b8972e] text-black px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-[#D4AF37]/20"
            >
              <Play fill="currentColor" size={20} />
              Ouvir Destaque
            </button>
            <Link to="/explorar" className="border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-sm">
              <Music2 size={20} />
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Destaques</h2>
            <div className="w-12 h-1 bg-[#D4AF37]" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSongs.map(song => (
            <MusicCard key={song.id} song={song} onPlay={onPlay} />
          ))}
        </div>
      </section>

      {/* Artists Section */}
      <section className="bg-[#121214] py-24 mt-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#D4AF37]/2 opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Users className="text-[#D4AF37]" />
            <h2 className="text-3xl font-bold text-white">Artistas em Evidência</h2>
          </div>
          
          <div className="flex overflow-x-auto gap-10 pb-8 no-scrollbar">
            {data.artists.map(artist => (
              <div key={artist.id} className="flex-shrink-0 group text-center w-40 cursor-pointer">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 ring-2 ring-transparent group-hover:ring-[#D4AF37] transition-all p-1.5 bg-[#0B0B0D]">
                  <img src={artist.photo} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" alt={artist.name} />
                </div>
                <h4 className="text-white font-bold group-hover:text-[#D4AF37] transition-colors">{artist.name}</h4>
                <p className="text-[#6b7280] text-[10px] mt-1 font-bold uppercase tracking-widest">Ver Perfil</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History (Continuar Ouvindo) */}
      {data.history.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24">
          <div className="flex items-center gap-3 mb-8">
            <PlayCircle className="text-[#D4AF37]" />
            <h2 className="text-2xl font-bold text-white">Continuar Ouvindo</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {data.history.map(song => (
              <div key={song.id} onClick={() => onPlay(song)} className="bg-[#121214] p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors group">
                 <img src={song.cover} className="w-full aspect-square object-cover rounded-lg mb-3" alt="" />
                 <h4 className="text-white text-xs font-bold truncate">{song.title}</h4>
                 <p className="text-[#6b7280] text-[10px] truncate">{song.artistName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Blog Teaser */}
      <section className="max-w-7xl mx-auto px-6 py-24">
         <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <Newspaper className="text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-white">Edificação</h2>
            </div>
            <Link to="/blog" className="text-sm font-bold text-[#B3B3B3] hover:text-[#D4AF37] flex items-center gap-2">Ver tudo <ArrowRight size={16}/></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.posts.map(post => (
              <div key={post.id} className="bg-[#121214] rounded-[32px] overflow-hidden hover:bg-[#18181b] transition-all border border-white/5 group">
                <div className="h-56 w-full overflow-hidden">
                  <img src={post.cover} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] uppercase font-bold px-3 py-1 rounded-full">{post.category}</span>
                    <span className="text-[#6b7280] text-[10px] font-bold">{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-[#D4AF37] transition-colors">{post.title}</h3>
                  <p className="text-[#B3B3B3] text-sm line-clamp-2 mb-8 leading-relaxed">{post.subtitle}</p>
                  <Link to={`/blog/${post.id}`} className="text-white text-xs font-bold flex items-center gap-3 uppercase tracking-widest">
                    Ler artigo <ArrowRight size={14} className="text-[#D4AF37]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
      </section>
    </div>
  );
};

export default Home;
