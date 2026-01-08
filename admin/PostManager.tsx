
import React, { useState, useRef } from 'react';
import { BlogPost } from '../types';
import { 
  Plus, Edit2, Trash2, Newspaper, 
  X, Upload, Loader2, Calendar, 
  User, CheckCircle, FileText, Eye
} from 'lucide-react';
import { api, uploadFile } from '../services/supabase';
import { useToast } from '../App';

interface PostManagerProps {
  posts: BlogPost[];
  onUpdate: () => void;
}

const PostManager: React.FC<PostManagerProps> = ({ posts, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Fix: the useToast hook returns the addToast function directly
  const addToast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    cover: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Notícia' as BlogPost['category'],
    status: 'published' as BlogPost['status']
  });

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        subtitle: post.subtitle,
        content: post.content,
        cover: post.cover,
        author: post.author,
        date: post.date,
        category: post.category,
        status: post.status
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        subtitle: '',
        content: '',
        cover: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Notícia',
        status: 'published'
      });
    }
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const publicUrl = await uploadFile('blog-covers', file);
      setFormData(prev => ({ ...prev, cover: publicUrl }));
      addToast("Imagem de capa carregada!", "success");
    } catch (error) {
      addToast("Erro ao subir imagem.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cover) {
      addToast("A imagem de capa é obrigatória.", "info");
      return;
    }

    setIsSaving(true);
    try {
      if (editingPost) {
        await api.posts.update(editingPost.id, formData);
        addToast("Artigo atualizado!", "success");
      } else {
        await api.posts.insert(formData);
        addToast("Artigo publicado no blog!", "success");
      }
      onUpdate();
      setShowModal(false);
    } catch (error: any) {
      addToast("Erro ao salvar: " + error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este post permanentemente?")) return;
    try {
      await api.posts.delete(id);
      addToast("Artigo removido.", "success");
      onUpdate();
    } catch (error: any) {
      addToast("Erro ao deletar: " + error.message, "error");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white font-display">Blog & <span className="text-[#D4AF37]">Edificação</span></h1>
          <p className="text-[#6b7280] font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Gestão de conteúdos e notícias do reino</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#D4AF37] hover:bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#D4AF37]/10 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Novo Artigo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {posts.map(post => (
          <div key={post.id} className="bg-[#121214] rounded-[32px] border border-white/5 overflow-hidden flex flex-col group hover:border-[#D4AF37]/30 transition-all shadow-lg">
            <div className="h-48 relative overflow-hidden">
              <img src={post.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md ${
                  post.status === 'published' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                  {post.category}
                </span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-[#D4AF37] transition-colors">{post.title}</h3>
              <p className="text-[#6b7280] text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{post.subtitle}</p>
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#D4AF37] text-[10px] font-bold">
                    {post.author.substring(0, 1)}
                  </div>
                  <div className="text-[10px] uppercase font-black text-[#4b5563] tracking-tighter">
                    {post.author}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(post)}
                    className="p-3 bg-white/5 hover:bg-[#D4AF37] text-[#6b7280] hover:text-black rounded-xl transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-3 bg-white/5 hover:bg-red-500 text-[#6b7280] hover:text-white rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-[#4b5563] bg-[#121214] rounded-[40px] border border-dashed border-white/5">
           <Newspaper size={64} className="mb-6 opacity-20" />
           <p className="font-bold uppercase tracking-[0.3em] text-xs">Nenhum artigo publicado no altar digital.</p>
        </div>
      )}

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121214] w-full max-w-4xl max-h-[90vh] rounded-[40px] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-zoom-in">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#0B0B0D]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37]">
                  <Newspaper size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                    {editingPost ? 'Editar Artigo' : 'Nova Publicação'}
                  </h2>
                  <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Preencha os detalhes da mensagem</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 text-[#6b7280] hover:text-white hover:bg-red-500/20 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Lateral Esquerda - Imagem e Configs */}
                <div className="lg:col-span-4 space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-[#6b7280] uppercase tracking-[0.2em] mb-4">Capa do Artigo</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[4/3] bg-[#0B0B0D] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-all overflow-hidden group relative"
                    >
                      {formData.cover ? (
                        <>
                          <img src={formData.cover} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" alt="Preview" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="text-white" size={32} />
                          </div>
                        </>
                      ) : (
                        <>
                          {isUploading ? <Loader2 className="animate-spin text-[#D4AF37]" size={32} /> : <Upload className="text-[#6b7280] group-hover:text-[#D4AF37]" size={32} />}
                          <span className="text-[10px] font-bold text-[#6b7280] mt-4 uppercase tracking-widest">Carregar Imagem</span>
                        </>
                      )}
                      <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
                    </div>
                  </div>

                  <div className="space-y-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                    <div>
                      <label className="block text-[10px] font-black text-[#6b7280] uppercase tracking-widest mb-3">Categoria</label>
                      <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-[#0B0B0D] border border-white/10 rounded-xl px-4 py-4 text-white font-bold text-sm focus:border-[#D4AF37] outline-none transition-colors">
                        <option value="Notícia">Notícia</option>
                        <option value="Devocional">Devocional</option>
                        <option value="Evento">Evento</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-[#6b7280] uppercase tracking-widest mb-3">Status</label>
                      <div className="flex gap-3">
                        {['published', 'draft'].map(status => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setFormData({...formData, status: status as any})}
                            className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all ${
                              formData.status === status 
                                ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' 
                                : 'bg-[#0B0B0D] border-white/10 text-[#6b7280] hover:border-white/20'
                            }`}
                          >
                            {status === 'published' ? 'Público' : 'Rascunho'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Área de Conteúdo */}
                <div className="lg:col-span-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-[#6b7280] uppercase tracking-widest mb-3">Título Principal</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" size={18} />
                        <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0B0B0D] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-[#4b5563] focus:border-[#D4AF37] outline-none transition-all" placeholder="Ex: O despertar da fé em Luanda" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#6b7280] uppercase tracking-widest mb-3">Autor / Ministro</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" size={18} />
                        <input required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full bg-[#0B0B0D] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-[#4b5563] focus:border-[#D4AF37] outline-none transition-all" placeholder="Nome do autor" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#6b7280] uppercase tracking-widest mb-3">Subtítulo (Resumo Curto)</label>
                    <input required value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-[#0B0B0D] border border-white/10 rounded-xl py-4 px-6 text-white font-bold placeholder:text-[#4b5563] focus:border-[#D4AF37] outline-none transition-all" placeholder="Uma breve descrição que aparece na listagem..." />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#6b7280] uppercase tracking-widest mb-3">Corpo da Mensagem (Markdown Suportado)</label>
                    <textarea required rows={12} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-[#0B0B0D] border border-white/10 rounded-3xl py-6 px-8 text-white font-medium leading-relaxed placeholder:text-[#4b5563] focus:border-[#D4AF37] outline-none transition-all custom-scrollbar resize-none" placeholder="Escreva a mensagem aqui..." />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button 
                  type="submit" 
                  disabled={isUploading || isSaving} 
                  className="flex-1 bg-[#D4AF37] hover:bg-white text-black font-black py-5 rounded-2xl transition-all shadow-2xl shadow-[#D4AF37]/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : (editingPost ? <CheckCircle size={22} /> : <Newspaper size={22} />)}
                  {editingPost ? 'Salvar Alterações' : 'Publicar Agora'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManager;