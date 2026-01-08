
import React, { useMemo } from 'react';
import { AppState, Artist, Song } from '../types';
import { 
  Music, Users, Newspaper, Play, 
  Calendar, Award, ArrowUpRight, Plus, 
  Settings, ChevronRight, TrendingUp,
  Heart, BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, AreaChart, Area 
} from 'recharts';
import { Link } from 'react-router-dom';

interface AdminDashboardProps {
  data: AppState;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ data }) => {
  // 1. Calculate Key Metrics
  const metrics = useMemo(() => {
    const totalPlays = data.songs.reduce((acc, s) => acc + (s.playCount || 0), 0);
    const totalSongs = data.songs.length;
    const totalArtists = data.artists.length;
    const totalPosts = data.posts.length;

    return { totalPlays, totalSongs, totalArtists, totalPosts };
  }, [data.songs, data.artists, data.posts]);

  // 2. Identify Top Artist (by total play count of their songs)
  const topArtist = useMemo(() => {
    if (data.artists.length === 0) return null;

    const artistPlaysMap = data.songs.reduce((acc, song) => {
      acc[song.artistId] = (acc[song.artistId] || 0) + (song.playCount || 0);
      return acc;
    }, {} as Record<string, number>);

    const sortedArtists = [...data.artists].sort((a, b) => {
      const playsA = artistPlaysMap[a.id] || 0;
      const playsB = artistPlaysMap[b.id] || 0;
      return playsB - playsA;
    });

    return {
      ...sortedArtists[0],
      totalPlays: artistPlaysMap[sortedArtists[0].id] || 0
    };
  }, [data.artists, data.songs]);

  // 3. Prepare Chart Data (Top 6 songs)
  const chartData = useMemo(() => {
    return [...data.songs]
      .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
      .slice(0, 6)
      .map(s => ({
        name: s.title.length > 10 ? s.title.substring(0, 8) + '...' : s.title,
        fullTitle: s.title,
        plays: s.playCount || 0
      }));
  }, [data.songs]);

  const statsCards = [
    { label: 'Alcance Total', value: metrics.totalPlays.toLocaleString(), icon: Play, color: '#D4AF37', bg: 'bg-[#D4AF37]/10' },
    { label: 'Músicas no Altar', value: metrics.totalSongs, icon: Music, color: '#3b82f6', bg: 'bg-blue-500/10' },
    { label: 'Corpo de Ministros', value: metrics.totalArtists, icon: Users, color: '#10b981', bg: 'bg-emerald-500/10' },
    { label: 'Publicações', value: metrics.totalPosts, icon: Newspaper, color: '#f59e0b', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Header Premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#121214] to-[#0B0B0D] p-8 md:p-12 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-[#D4AF37]/20">
                Gestão Estratégica
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 font-display tracking-tight">
              Olá, <span className="text-[#D4AF37]">Administrador</span>
            </h1>
            <p className="text-[#6b7280] flex items-center gap-2 text-sm font-medium">
              <Calendar size={16} className="text-[#D4AF37]" />
              Painel Geral • {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/admin/musicas" className="bg-[#D4AF37] hover:bg-white text-black px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-[#D4AF37]/10 active:scale-95 group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Nova Música
            </Link>
            <Link to="/admin/config" className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl border border-white/10 transition-all backdrop-blur-md">
              <Settings size={22} />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-[#121214] p-8 rounded-[32px] border border-white/5 hover:border-[#D4AF37]/30 transition-all group shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} text-[${stat.color}] group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div className="text-[10px] font-black text-[#6b7280] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                DETALHES <ChevronRight size={10} />
              </div>
            </div>
            <p className="text-[#6b7280] text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Popularidade */}
        <div className="lg:col-span-2 bg-[#121214] p-10 rounded-[40px] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                <BarChart3 className="text-[#D4AF37]" size={24} /> Popularidade das Músicas
              </h2>
              <p className="text-xs text-[#6b7280] font-medium">As 6 canções mais reproduzidas no catálogo</p>
            </div>
            <TrendingUp size={24} className="text-[#D4AF37] opacity-50" />
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={11} fontWeight="700" axisLine={false} tickLine={false} dy={15} />
                <YAxis stroke="#4b5563" fontSize={11} fontWeight="700" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#0B0B0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }}
                  itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                  labelStyle={{ display: 'none' }}
                  formatter={(value: any, name: any, props: any) => [`${value} plays`, props.payload.fullTitle]}
                />
                <Bar dataKey="plays" radius={[8, 8, 0, 0]} barSize={45}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : '#1f2937'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ministro Destaque e Ações Rápidas */}
        <div className="space-y-8">
          <div className="bg-[#121214] p-8 rounded-[32px] border border-white/5 shadow-xl relative overflow-hidden group h-fit">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Award className="text-[#D4AF37]" size={20} /> Ministro Mais Popular
            </h2>
            
            {topArtist ? (
              <div className="relative z-10">
                <div className="flex items-center gap-5 bg-white/5 p-6 rounded-2xl border border-white/5 mb-6">
                  <div className="relative">
                    <img src={topArtist.photo} className="w-20 h-20 rounded-2xl object-cover border border-white/10" alt={topArtist.name} />
                    <div className="absolute -top-2 -right-2 bg-[#D4AF37] text-black w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shadow-lg">1º</div>
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl leading-tight">{topArtist.name}</p>
                    <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mt-1">Líder de Alcance</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between px-2">
                  <div className="text-center">
                    <p className="text-[#6b7280] text-[9px] font-black uppercase tracking-widest mb-1">Plays Totais</p>
                    <p className="text-white font-bold">{topArtist.totalPlays.toLocaleString()}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-[#6b7280] text-[9px] font-black uppercase tracking-widest mb-1">Obras</p>
                    <p className="text-white font-bold">{data.songs.filter(s => s.artistId === topArtist.id).length}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-[#6b7280]">
                <Users size={40} className="mb-3 opacity-20" />
                <p className="text-sm italic">Nenhum dado disponível.</p>
              </div>
            )}
          </div>

          <div className="bg-[#121214] p-8 rounded-[32px] border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-[#D4AF37]" /> Recentes
              </h2>
              <Link to="/admin/musicas" className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest hover:underline flex items-center gap-1">
                Ver Todas <ChevronRight size={10} />
              </Link>
            </div>
            
            <div className="space-y-6">
              {data.songs.slice(0, 4).map(song => (
                <div key={song.id} className="flex items-center gap-4 group cursor-default">
                  <div className="relative flex-shrink-0">
                    <img src={song.cover} className="w-12 h-12 rounded-xl object-cover border border-white/10 transition-transform group-hover:scale-105" alt={song.title} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-bold truncate group-hover:text-[#D4AF37] transition-colors">{song.title}</p>
                    <p className="text-[#6b7280] text-[10px] uppercase font-bold tracking-tight">{song.artistName}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#10b981] text-[10px] font-bold">
                       <Play size={10} fill="currentColor" /> {song.playCount}
                    </div>
                  </div>
                </div>
              ))}
              
              {data.songs.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-[#6b7280] text-sm italic">Nenhuma música adicionada ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
