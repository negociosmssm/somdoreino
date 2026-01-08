
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Music, Users, Newspaper, 
  Settings, LogOut, Menu, X, 
  Loader2, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { INITIAL_DATA } from './store/mockData';
import { AppState, Song, UserProfile, Artist, BlogPost, SiteSettings } from './types';
import { api, supabase } from './services/supabase';

// Componentes e Páginas
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import About from './pages/About';
import Login from './pages/Login';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import AdminDashboard from './admin/AdminDashboard';
import MusicManager from './admin/MusicManager';
import ArtistManager from './admin/ArtistManager';
import SettingsManager from './admin/SettingsManager';
import PostManager from './admin/PostManager';

// Contextos
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  data: AppState;
  loading: boolean;
  addToast: (msg: string, type: Toast['type']) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

export const useToast = () => useApp().addToast;

const ToastContainer: React.FC<{ toasts: Toast[], remove: (id: number) => void }> = ({ toasts, remove }) => (
  <div className="fixed top-24 right-6 z-[200] space-y-3 pointer-events-none">
    {toasts.map(t => (
      <div 
        key={t.id} 
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-slide-up pointer-events-auto min-w-[300px] ${
          t.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
          t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
          'bg-[#121214] border-white/10 text-white'
        }`}
      >
        {t.type === 'success' && <CheckCircle2 size={18} />}
        {t.type === 'error' && <AlertCircle size={18} />}
        {t.type === 'info' && <Info size={18} />}
        <span className="text-sm font-bold tracking-tight">{t.message}</span>
        <button onClick={() => remove(t.id)} className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
);

// Guarda de Autenticação Robusto com Redundância Super Admin
const AuthGuard: React.FC<{ children: React.ReactNode, requireAdmin?: boolean }> = ({ children, requireAdmin }) => {
  const { data, loading } = useApp();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
    </div>
  );

  if (!data.userProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isSuperAdmin = data.userProfile.role === 'admin' || data.userProfile.email === 'somdoreinoangola@gmail.com';

  if (requireAdmin && !isSuperAdmin) {
     return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-4 px-8 py-5 transition-all duration-300 group ${
      active 
        ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-r-4 border-[#D4AF37]' 
        : 'text-[#6b7280] hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={22} className={active ? 'text-[#D4AF37]' : 'text-[#4b5563] group-hover:text-white'} />
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </Link>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useApp();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex">
      <aside className={`fixed inset-y-0 left-0 z-[120] w-80 bg-[#121214] border-r border-white/5 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#D4AF37]/20">
            <LayoutDashboard className="text-black w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-white text-lg tracking-tighter uppercase leading-none">Gestor</h2>
            <p className="text-[10px] text-[#6b7280] font-black tracking-[0.2em] uppercase mt-1">Som do Reino</p>
          </div>
        </div>
        <nav className="mt-6">
          <SidebarItem to="/admin" icon={LayoutDashboard} label="Visão Geral" active={location.pathname === '/admin'} />
          <SidebarItem to="/admin/musicas" icon={Music} label="Músicas" active={location.pathname === '/admin/musicas'} />
          <SidebarItem to="/admin/artistas" icon={Users} label="Artistas" active={location.pathname === '/admin/artistas'} />
          <SidebarItem to="/admin/posts" icon={Newspaper} label="Blog / Edificação" active={location.pathname === '/admin/posts'} />
          <SidebarItem to="/admin/config" icon={Settings} label="Configurações" active={location.pathname === '/admin/config'} />
        </nav>
        <div className="absolute bottom-10 left-0 right-0 px-8">
          <button onClick={handleLogout} className="flex items-center gap-4 text-[#6b7280] hover:text-red-500 transition-all w-full text-left font-black text-[10px] uppercase tracking-widest px-4 py-4 rounded-xl hover:bg-red-500/5">
            <LogOut size={18} /> Encerrar Sessão
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto max-h-screen custom-scrollbar relative">
        <header className="h-24 bg-[#0B0B0D]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-40">
           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden text-white hover:text-[#D4AF37] transition-colors"><Menu /></button>
           <div className="flex items-center gap-6 ml-auto">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-white tracking-tight uppercase truncate max-w-[150px]">{data.userProfile?.email.split('@')[0]}</span>
                <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">Administrador Master</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#f5e0a3] flex items-center justify-center font-black text-black text-sm shadow-xl uppercase">
                {data.userProfile?.email.substring(0,2)}
              </div>
           </div>
        </header>
        <div className="p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<AppState>({
    ...INITIAL_DATA,
    favorites: [],
    userProfile: null
  });
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      // Use settled to prevent total crash if one table fails
      const results = await Promise.allSettled([
        api.songs.getAll(),
        api.artists.getAll(),
        api.posts.getAll(),
        api.settings.get(),
        session?.user ? api.auth.getProfile(session.user.id) : Promise.resolve(null)
      ]);

      const songs = results[0].status === 'fulfilled' ? results[0].value : [];
      const artists = results[1].status === 'fulfilled' ? results[1].value : [];
      const posts = results[2].status === 'fulfilled' ? results[2].value : [];
      const settings = results[3].status === 'fulfilled' ? results[3].value : INITIAL_DATA.settings;
      const profile = results[4].status === 'fulfilled' ? results[4].value : null;

      let favorites: string[] = [];
      let history: Song[] = [];

      if (session?.user) {
        try {
          const favoriteIds = await api.favorites.get(session.user.id);
          favorites = favoriteIds;
          
          const recentIds = await api.history.getRecent(session.user.id);
          history = songs.filter(s => recentIds.includes(s.id));
        } catch (e) {
          console.error("Error loading user-specific data:", e);
        }
      }

      setData(prev => ({
        ...prev,
        songs: songs || [],
        artists: artists || [],
        posts: posts || [],
        settings: settings || prev.settings,
        userProfile: profile || null,
        favorites,
        history
      }));
    } catch (error: any) {
      console.error("Error loading initial data:", error);
      addToast("Erro ao sincronizar com o Altar Digital.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadData();
    });

    return () => subscription.unsubscribe();
  }, [loadData]);

  const handlePlay = async (song: Song) => {
    setActiveSong(song);
    if (data.userProfile) {
      try {
        await api.history.add(data.userProfile.id, song.id);
        await api.songs.updatePlayCount(song.id, song.playCount || 0);
      } catch (e) {
        console.error("Error recording play stats", e);
      }
    }
  };

  const contextValue: AppContextType = {
    data,
    loading,
    addToast,
    refreshData: loadData
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="bg-[#0B0B0D] min-h-screen text-white font-sans selection:bg-[#D4AF37] selection:text-black">
          <Navbar userProfile={data.userProfile} />
          
          <Routes>
            <Route path="/" element={<Home data={data} onPlay={handlePlay} />} />
            <Route path="/explorar" element={<Explore data={data} onPlay={handlePlay} />} />
            <Route path="/missao" element={<About data={data} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog posts={data.posts} />} />
            <Route path="/blog/:id" element={<BlogPostDetail posts={data.posts} />} />
            
            <Route path="/admin/*" element={
              <AuthGuard requireAdmin>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard data={data} />} />
                    <Route path="/musicas" element={<MusicManager songs={data.songs} artists={data.artists} onAdd={loadData} onDelete={loadData} onUpdate={loadData} />} />
                    <Route path="/artistas" element={<ArtistManager artists={data.artists} onAdd={loadData} onDelete={loadData} />} />
                    <Route path="/posts" element={<PostManager posts={data.posts} onUpdate={loadData} />} />
                    <Route path="/config" element={<SettingsManager settings={data.settings} onUpdate={loadData} />} />
                  </Routes>
                </AdminLayout>
              </AuthGuard>
            } />
          </Routes>

          {activeSong && (
            <MusicPlayer 
              song={activeSong} 
              onClose={() => setActiveSong(null)} 
            />
          )}

          <ToastContainer toasts={toasts} remove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
