
import React, { useState, useRef } from 'react';
import { Artist } from '../types';
import { Plus, Edit2, Trash2, Camera, User, X, Upload, Loader2, Save } from 'lucide-react';
import { api, uploadFile } from '../services/supabase';
import { useToast } from '../App';

interface ArtistManagerProps {
  artists: Artist[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const ArtistManager: React.FC<ArtistManagerProps> = ({ artists, onAdd, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addToast = useToast();
  
  const [formData, setFormData] = useState({ name: '', bio: '', photo: '' });

  const handleOpenModal = (artist?: Artist) => {
    if (artist) {
      setEditingArtist(artist);
      setFormData({ name: artist.name, bio: artist.bio, photo: artist.photo });
    } else {
      setEditingArtist(null);
      setFormData({ name: '', bio: '', photo: '' });
    }
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const publicUrl = await uploadFile('photos', file);
      setFormData(prev => ({ ...prev, photo: publicUrl }));
      addToast("Foto do ministro carregada!", "success");
    } catch (error) {
      addToast("Erro ao subir foto.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photo) {
      addToast("A foto é obrigatória.", "info");
      return;
    }
    
    setIsSaving(true);
    try {
      if (editingArtist) {
        await api.artists.update(editingArtist.id, formData);
        addToast("Ministro atualizado com sucesso!", "success");
      } else {
        await api.artists.insert(formData);
        addToast("Ministro registrado com sucesso!", "success");
      }
      onAdd();
      setShowModal(false);
      setFormData({ name: '', bio: '', photo: '' });
    } catch (error: any) {
      addToast("Erro ao salvar: " + error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este artista apagará suas referências. Continuar?")) return;
    try {
      await api.artists.delete(id);
      addToast("Artista removido.", "success");
      onDelete(id);
    } catch (error: any) {
      addToast("Erro ao deletar: " + error.message, "error");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white font-display uppercase tracking-tight">Gestão de <span className="text-[#D4AF37]">Artistas</span></h1>
          <p className="text-[#6b7280] font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Corpo de ministros e adoradores do Altar</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#D4AF37] hover:bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#D4AF37]/10 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Novo Ministro
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {artists.map((artist, idx) => (
          <div key={artist.id} className="bg-[#121214] rounded-[32px] border border-white/5 overflow-hidden group hover:border-[#D4AF37]/30 transition-all animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="aspect-square relative overflow-hidden">
              <img src={artist.photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={artist.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-6 left-6 right-6">
                 <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">{artist.name}</h3>
                 <p className="text-[#6b7280] text-[10px] font-black uppercase tracking-widest mt-1">Ministro de Louvor</p>
              </div>
            </div>
            <div className="p-8">
              <p className="text-[#B3B3B3] text-sm line-clamp-2 mb-8 h-10 font-medium leading-relaxed">{artist.bio}</p>
              <div className="flex gap-3 pt-6 border-t border-white/5">
                <button 
                  onClick={() => handleOpenModal(artist)}
                  className="flex-1 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <Edit2 size={14} /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(artist.id)}
                  className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121214] w-full max-w-lg rounded-[40px] border border-white/10 overflow-hidden shadow-2xl animate-zoom-in">
             <div className="p-8 bg-[#0B0B0D] border-b border-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                    {editingArtist ? 'Editar Ministro' : 'Novo Ministro'}
                  </h2>
                  <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mt-1">Identidade do adorador</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 text-[#6b7280] hover:text-white rounded-2xl transition-all">
                  <X size={24} />
                </button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="flex flex-col items-center">
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className="w-40 h-40 rounded-[40px] bg-[#0B0B0D] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-all overflow-hidden relative group"
                   >
                     {formData.photo ? (
                        <img src={formData.photo} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="Preview" />
                     ) : (
                        <div className="flex flex-col items-center">
                          {isUploading ? <Loader2 className="animate-spin text-[#D4AF37]" size={32} /> : <Camera className="text-[#6b7280] group-hover:text-[#D4AF37]" size={32} />}
                          <span className="text-[10px] text-[#6b7280] font-black mt-4 uppercase tracking-widest">FOTO PERFIL</span>
                        </div>
                     )}
                     <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
                   </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-[#6b7280] uppercase mb-3 tracking-[0.2em] ml-1">Nome Artístico / Ministro</label>
                    <input 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Pr. Vanderlei Vss"
                      className="w-full bg-[#0B0B0D] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#D4AF37] transition-all" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-[#6b7280] uppercase mb-3 tracking-[0.2em] ml-1">Biografia Curta</label>
                    <textarea 
                      rows={4} 
                      required
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      placeholder="Conte um pouco sobre o ministério deste adorador..."
                      className="w-full bg-[#0B0B0D] border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-[#D4AF37] resize-none leading-relaxed transition-all" 
                    />
                  </div>
                </div>

                <button disabled={isUploading || isSaving} className="w-full bg-[#D4AF37] hover:bg-white text-black font-black py-5 rounded-2xl shadow-2xl shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                   {isSaving ? <Loader2 className="animate-spin" size={24} /> : (editingArtist ? <Save size={22} /> : <Plus size={22} />)}
                   <span className="uppercase tracking-widest text-sm">{editingArtist ? 'Salvar Alterações' : 'Confirmar Cadastro'}</span>
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistManager;
