
import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { Save, Globe, Mail, Info, Loader2 } from 'lucide-react';
import { api } from '../services/supabase';
import { useToast } from '../App';

interface SettingsManagerProps {
  settings: SiteSettings;
  onUpdate: () => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  // Fix: the useToast hook returns the addToast function directly
  const addToast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.settings.update(formData);
      addToast("Configurações publicadas com sucesso!", "success");
      onUpdate();
    } catch (error: any) {
      addToast("Erro ao salvar: " + error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações Gerais</h1>
        <p className="text-[#B3B3B3]">Identidade institucional sincronizada com a nuvem.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-[#121214] p-8 rounded-2xl border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe size={20} className="text-[#D4AF37]" /> Identidade Visual
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-2">Nome da Plataforma</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#0B0B0D] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-2">Slogan (Hero)</label>
              <input 
                value={formData.slogan}
                onChange={e => setFormData({...formData, slogan: e.target.value})}
                className="w-full bg-[#0B0B0D] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-2">Email de Contacto</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={18} />
                <input 
                  value={formData.contactEmail}
                  onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full bg-[#0B0B0D] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#D4AF37] outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#121214] p-8 rounded-2xl border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Info size={20} className="text-[#D4AF37]" /> Página Sobre (Missão)
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-2">História & Propósito</label>
              <textarea 
                rows={10}
                value={formData.aboutText}
                onChange={e => setFormData({...formData, aboutText: e.target.value})}
                className="w-full bg-[#0B0B0D] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none resize-none leading-relaxed" 
                placeholder="Conte a história do Som do Reino..."
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#D4AF37] hover:bg-[#b8972e] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#D4AF37]/10"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={22} />}
            Publicar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;