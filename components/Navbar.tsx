
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Music, X, LayoutDashboard, User, LogOut } from 'lucide-react';
import { supabase } from '../services/supabase';
import { UserProfile } from '../types';

interface NavbarProps {
  userProfile: UserProfile | null;
}

const Navbar: React.FC<NavbarProps> = ({ userProfile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const isAdminPath = location.pathname.startsWith('/admin');
  if (isAdminPath) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchValue)}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-xl border-b border-[#121214] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
            <Music className="text-black w-6 h-6" />
          </div>
          <span className="font-display text-2xl font-black tracking-tighter text-white uppercase">Som do Reino</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-black text-[#6b7280] uppercase tracking-[0.2em]">
          <Link to="/" className={`hover:text-[#D4AF37] transition-colors ${location.pathname === '/' ? 'text-[#D4AF37]' : ''}`}>Início</Link>
          <Link to="/explorar" className={`hover:text-[#D4AF37] transition-colors ${location.pathname === '/explorar' ? 'text-[#D4AF37]' : ''}`}>Explorar</Link>
          <Link to="/missao" className={`hover:text-[#D4AF37] transition-colors ${location.pathname === '/missao' ? 'text-[#D4AF37]' : ''}`}>A Missão</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'w-48 sm:w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
             <form onSubmit={handleSearch} className="w-full">
                <input 
                  type="text" autoFocus value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Buscar..." className="bg-[#121214] border border-white/10 rounded-full px-4 py-2 text-xs text-white w-full outline-none focus:border-[#D4AF37]"
                />
             </form>
          </div>
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-[#6b7280] hover:text-[#D4AF37] transition-colors">
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          
          {userProfile ? (
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              {userProfile.role === 'admin' && (
                <Link to="/admin" className="p-2 bg-[#D4AF37] rounded-lg text-black hover:scale-105 transition-transform" title="Painel Admin">
                  <LayoutDashboard size={18} />
                </Link>
              )}
              <div className="flex items-center gap-2 group cursor-pointer relative">
                 <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
                   <User size={16} />
                 </div>
                 <div className="absolute top-full right-0 mt-2 w-48 bg-[#121214] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                    <p className="px-4 py-2 text-[10px] font-bold text-[#6b7280] border-b border-white/5 truncate">{userProfile.email}</p>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red-500 hover:bg-white/5 rounded-lg transition-colors font-bold">
                       <LogOut size={14} /> Sair do Altar
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase px-6 py-3 rounded-xl border border-white/10 tracking-widest transition-all">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
