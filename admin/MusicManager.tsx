
import React, { useState, useRef } from 'react';
import { Song, Artist, Genre } from '../types';
import { Plus, Search, Trash2, ExternalLink, Music, Link as LinkIcon, Star, Upload, Loader2, X, Edit3, Save } from 'lucide-react';
import { convertToEmbedUrl, getPlatformName } from '../services/urlConverter';
import { api, uploadFile } from '../services/supabase';
import { useToast } from '../App';

interface MusicManagerProps {
  songs: Song[];
  artists: Artist[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdate: (song: Song) => void;
}

const MusicManager: React.FC<MusicManagerProps> = ({ songs, artists, onAdd, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addToast = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    artistId: '',
    originalUrl: '',
    cover: '',
    isFeatured: false,
    genre: 'Louvor' as Genre
  });

  const handleOpenModal = (song?: Song) => {
    if (song) {
      setEditingSong(song);
      setFormData({
        title: song.title,
        artistId: song.artistId,
        originalUrl: song.originalUrl,
        cover: song.cover,
        isFeatured: song.isFeatured,
        genre: song.genre
      });
    } else {
      setEditingSong(null);
      setFormData({ title: '', artistId: '', originalUrl: '', cover: '', isFeatured: false, genre: 'Louvor' });
    }
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const publicUrl = await uploadFile('covers', file);
      setFormData(prev => ({ ...prev, cover: publicUrl }));
      addToast("Capa carregada com sucesso!", "success");
    } catch (error) {
      addToast("Erro ao subir imagem.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cover) {
      addToast("A capa é obrigatória.", "info");
      return;
    }

    setIsSaving(true);
    try {
      const artist = artists.find(a => a.id === formData.artistId);
      const songData = {
        title: formData.title,
        artistId: formData.artistId,
        artistName: artist?.name || 'Artista Desconhecido',
        genre: formData.genre,
        originalUrl: formData.originalUrl,
        audioUrl: convertToEmbedUrl(formData.originalUrl),
        cover: formData.cover,
        date: editingSong ? editingSong.date : new Date().toISOString().split('T')[0],
        isFeatured: formData.isFeatured,
        playCount: editingSong ? editingSong.playCount : 0
      };

      if (editingSong) {
        await api.songs.update(editingSong.id, songData);
        addToast("Louvor atualizado no Altar!", "success");
      } else {
        await api.songs.insert(songData);
        addToast("Música adicionada ao Altar!", "success");
      }

      onAdd();
      setShowModal(false);
    } catch (error: any) {
      addToast("Erro ao salvar: " + error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente remover esta música?")) return;
    try {
      await api.songs.delete(id);
      addToast("Música removida.", "success");
      onDelete(id);
    } catch (error: any) {
      addToast("Erro ao deletar: " + error.message, "error");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white font-display uppercase tracking-tight">Acervo de <span className="text-[#D4AF37]">Louvores</span></h1>
          <p className="text-[#6b7280] font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Sincronização em tempo real para toda a nação</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#D4AF37] hover:bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#D4AF37]/10 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Nova Música
        </button>
      </div>

      <div className="bg-[#121214] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0B0B0D] text-[#6b7280] text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                <th className="px-8 py-6">Música</th>
                <th className="px-8 py-6">Ministro</th>
                <th className="px-8 py-6">Canal</th>
                <th className="px-8 py-6">Destaque</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {songs.map((song) => (
                <tr key={song.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-lg border border-white/5" alt="" />
                      <div className="text-white font-bold">{song.title}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[#B3B3B3] font-bold text-sm">{song.artistName}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[9px] text-white bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/5 font-black uppercase tracking-widest">
                      <LinkIcon size={12} className="text-[#D4AF37]" />
                      {getPlatformName(song.originalUrl)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {song.isFeatured ? (
                      <span className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">
                        <Star size={14} fill="currentColor" /> Sim
                      </span>
                    ) : (
                      <span className="text-[#4b5563] text-[10px] font-bold uppercase tracking-widest">Não</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleOpenModal(song)}
                        className="p-3 bg-white/5 text-[#6b7280] hover:text-[#D4AF37] hover:bg-white/10 rounded-xl transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(song.id)}
                        className="p-3 bg-red-500/10 text-[#6b7280] hover:text-red-500 hover:bg-red-500/20 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {songs.length === 0 && (
            <div className="p-32 text-center text-[#4b5563] font-black uppercase tracking-[0.4em] text-sm">
              Altar vazio. Aguardando novos louvores.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121214] w-full max-w-2xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl animate-zoom-in flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#0B0B0D]">
              <div>
                <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                  {editingSong ? 'Editar Obra' : 'Novo Registro'}
                </h2>
                <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mt-1">Detalhes do louvor</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 text-[#6b7280] hover:text-white rounded-2xl transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-[#6b7280] uppercase tracking-[0.2em] mb-4">Arte do Álbum / Capa</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-[#0B0B0D] border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-all overflow-hidden group relative"
                  >
                    {formData.cover ? (
                      <img src={formData.cover} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center">
                        {isUploading ? <Loader2 className="animate-spin text-[#D4AF37]" size={32} /> : <Upload className="text-[#6b7280] group-hover:text-[#D4AF37]" size={32} />}
                        <span className="text-[10px] font-black text-[#6b7280] mt-4 uppercase tracking-widest">UPLOAD CAPA</span>
                      </div>
                    )}
                    <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-[#6b7280] uppercase mb-3 tracking-widest">Título da Obra</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0B0B0D] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-[#D4AF37] outline-none transition-all" placeholder="Nome da música" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#6b7280] uppercase mb-3 tracking-widest">Gênero Musical</label>
                    <select required value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value as Genre})} className="w-full bg-[#0B0B0D] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-[#D4AF37] outline-none transition-all">
                      {['Louvor', 'Adoração', 'Gospel Pop', 'Pentecostal', 'Instrumental', 'Devocional'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#6b7280] uppercase mb-3 tracking-widest">Ministro Responsável</label>
                    <select required value={formData.artistId} onChange={e => setFormData({...formData, artistId: e.target.value})} className="w-full bg-[#0B0B0D] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-[#D4AF37] outline-none transition-all">
                      <option value="">Selecionar Ministro...</option>
                      {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#6b7280] uppercase mb-3 tracking-widest">Link de Áudio/Vídeo (YouTube / Drive / Audiomack)</label>
                <input required value={formData.originalUrl} onChange={e => setFormData({...formData, originalUrl: e.target.value})} className="w-full bg-[#0B0B0D] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-[#D4AF37] outline-none transition-all" placeholder="https://..." />
              </div>

              <label className="flex items-center gap-4 cursor-pointer group bg-white/5 p-6 rounded-2xl border border-white/5">
                <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-6 h-6 rounded-lg bg-[#0B0B0D] border-white/10 checked:bg-[#D4AF37] text-[#D4AF37] transition-all" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">Destacar na Vitrine Principal</span>
                  <span className="text-[10px] text-[#6b7280] font-bold">Esta música aparecerá na seção de heróis da página inicial.</span>
                </div>
              </label>

              <button type="submit" disabled={isUploading || isSaving} className="w-full bg-[#D4AF37] hover:bg-white text-black font-black py-5 rounded-2xl transition-all shadow-2xl shadow-[#D4AF37]/20 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50">
                {isSaving ? <Loader2 className="animate-spin" size={24} /> : (editingSong ? <Save size={22} /> : <Plus size={22} />)}
                <span className="uppercase tracking-[0.2em] text-sm">{editingSong ? 'Atualizar Louvor' : 'Cadastrar Louvor'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicManager;
