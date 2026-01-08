
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Repeat, Download, ExternalLink, Music2 } from 'lucide-react';
import { Song } from '../types';
import { getPlatformName } from '../services/urlConverter';

interface MusicPlayerProps {
  song: Song;
  onClose: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ song, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(song.originalUrl, '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[160] bg-[#0B0B0D]/95 backdrop-blur-3xl border-t border-[#D4AF37]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-slide-up">
      <div className="max-w-7xl mx-auto h-24 sm:h-28 px-6 flex items-center justify-between gap-6">
        
        {/* Lado Esquerdo: Info da Obra */}
        <div className="flex items-center gap-5 w-1/4 min-w-[180px]">
          <div className="relative group flex-shrink-0 shadow-2xl">
            <img src={song.cover} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform" alt="" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
               <Music2 size={16} className="text-[#D4AF37]" />
            </div>
          </div>
          <div className="truncate">
            <h5 className="text-white font-black text-sm sm:text-base truncate tracking-tight">{song.title}</h5>
            <div className="flex items-center gap-2 mt-0.5">
               <p className="text-[#6b7280] text-[9px] font-black uppercase tracking-widest truncate">{song.artistName}</p>
               <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50"></span>
               <span className="text-[8px] text-[#D4AF37] font-black uppercase tracking-tighter bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">{getPlatformName(song.originalUrl)}</span>
            </div>
          </div>
        </div>
        
        {/* Centro: Controles de Graça */}
        <div className="flex flex-col items-center flex-1 max-w-lg">
           <div className="flex items-center gap-6 sm:gap-10 mb-3">
              <button onClick={handleDownload} className="text-[#4b5563] hover:text-[#D4AF37] transition-colors p-2" title="Download">
                 <Download size={18} />
              </button>
              <button className="text-[#4b5563] hover:text-white transition-colors"><SkipBack size={24} fill="currentColor" /></button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/5"
              >
                {isPlaying ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} className="ml-1" />}
              </button>
              <button className="text-[#4b5563] hover:text-white transition-colors"><SkipForward size={24} fill="currentColor" /></button>
              <button className="text-[#4b5563] hover:text-[#D4AF37] transition-colors hidden sm:block p-2"><Repeat size={18} /></button>
           </div>
           
           <div className="w-full flex items-center gap-4">
              <span className="text-[9px] text-[#4b5563] font-black font-mono tracking-widest">00:00</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden relative group cursor-pointer">
                 <div className={`absolute left-0 top-0 h-full bg-[#D4AF37] rounded-full transition-all ${isPlaying ? 'w-1/3 shadow-[0_0_10px_#D4AF37]' : 'w-1/3 opacity-50'}`}></div>
                 <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-[9px] text-[#4b5563] font-black font-mono tracking-widest">--:--</span>
           </div>

           {/* Motor de Áudio (YouTube/Drive Embed) */}
           <iframe 
              src={`${song.audioUrl}${song.audioUrl.includes('?') ? '&' : '?'}autoplay=${isPlaying ? 1 : 0}`} 
              className="w-0 h-0 absolute pointer-events-none opacity-0" 
              title="Som do Reino Engine"
              allow="autoplay"
            />
        </div>

        {/* Lado Direito: Utils */}
        <div className="flex items-center justify-end gap-6 w-1/4 min-w-[150px]">
           <div className="hidden lg:flex items-center gap-3 w-32 group">
              <button onClick={() => setIsMuted(!isMuted)} className="text-[#4b5563] group-hover:text-white transition-colors">
                 {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative cursor-pointer">
                 <div className="bg-white h-full transition-all" style={{ width: isMuted ? '0%' : `${volume}%` }}></div>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
              <a href={song.originalUrl} target="_blank" rel="noreferrer" className="p-3 text-[#4b5563] hover:text-white transition-colors" title="Abrir original">
                <ExternalLink size={20} />
              </a>
              <button 
                onClick={onClose}
                className="text-[#4b5563] hover:text-white transition-colors p-3 hover:bg-white/5 rounded-2xl"
              >
                <X size={22} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
