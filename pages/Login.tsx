
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, supabase } from '../services/supabase';
import { Mail, Lock, Loader2, Music, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import { useApp } from '../App';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast, refreshData } = useApp();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('som_do_reino_remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        addToast("Cadastro realizado! Verifique seu e-mail.", "success");
        setIsSignUp(false);
      } else {
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        
        if (signInError) throw signInError;

        if (user) {
          localStorage.setItem('som_do_reino_remembered_email', email);
          addToast("Paz seja contigo! Entrando...", "success");
          
          await refreshData();
          
          // Redirecionamento baseado no perfil ou e-mail super admin
          const profile = await api.auth.getProfile(user.id);
          const isSuperAdmin = user.email === 'somdoreinoangola@gmail.com' || profile?.role === 'admin';
          
          setTimeout(() => {
            if (isSuperAdmin) {
              navigate('/admin', { replace: true });
            } else {
              const from = (location.state as any)?.from?.pathname || "/";
              navigate(from, { replace: true });
            }
          }, 600);
        }
      }
    } catch (error: any) {
      let msg = "Erro ao entrar. Verifique suas credenciais.";
      if (error.message.includes('Invalid login credentials')) msg = 'E-mail ou senha incorretos.';
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0B0D]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[150px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] -ml-64 -mb-64"></div>
      </div>

      <div className="w-full max-w-md bg-[#121214] rounded-[40px] border border-white/5 p-10 sm:p-14 shadow-2xl relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-[#D4AF37] rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-[#D4AF37]/30 transform hover:rotate-12 transition-transform">
            <Music className="text-black w-10 h-10" />
          </div>
          <h1 className="text-4xl font-display font-black text-white tracking-tighter uppercase leading-none text-center">
            {isSignUp ? 'Nova Conta' : (
              <>Acesse o <span className="text-[#D4AF37]">Altar</span></>
            )}
          </h1>
          <p className="text-[#6b7280] text-[10px] font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
            <ShieldCheck size={12} className="text-[#D4AF37]" /> Proteção Criptografada
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4b5563] group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-medium focus:border-[#D4AF37] outline-none transition-all placeholder:text-[#374151]"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4b5563] group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-medium focus:border-[#D4AF37] outline-none transition-all placeholder:text-[#374151]"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-[#D4AF37]/20 active:scale-95 disabled:opacity-50 group overflow-hidden"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                {isSignUp ? <UserPlus size={22} /> : <LogIn size={22} className="group-hover:translate-x-1 transition-transform" />}
                <span className="uppercase tracking-widest text-sm">{isSignUp ? 'Criar Cadastro' : 'Entrar no Sistema'}</span>
              </>
            )}
          </button>

          <div className="text-center pt-4">
            <button 
              type="button" 
              onClick={() => { setIsSignUp(!isSignUp); setPassword(''); }}
              className="text-[10px] text-[#6b7280] hover:text-[#D4AF37] font-black uppercase tracking-[0.2em] transition-colors border-b border-transparent hover:border-[#D4AF37] pb-1"
            >
              {isSignUp ? 'Já tem conta? Faça Login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
