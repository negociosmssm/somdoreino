
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper, Calendar, User } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogProps {
  posts: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ posts }) => {
  const publishedPosts = posts.filter(p => p.status === 'published');

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <span className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block animate-fade-in">Altar Digital</span>
          <h1 className="text-5xl md:text-7xl font-black text-white font-display leading-tight animate-slide-up">
            Blog & <span className="text-[#D4AF37]">Edificação</span>
          </h1>
          <p className="text-[#6b7280] text-lg mt-6 max-w-2xl font-medium animate-slide-up delay-100">
            Mensagens, notícias e conteúdos exclusivos para fortalecer a sua caminhada com Cristo.
          </p>
        </header>

        {publishedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {publishedPosts.map((post, idx) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.id}`} 
                className="group bg-[#121214] rounded-[40px] overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-all shadow-xl flex flex-col animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="h-64 relative overflow-hidden">
                  <img src={post.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-6 text-[#6b7280] text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar size={12} className="text-[#D4AF37]" /> {post.date}</span>
                    <span className="flex items-center gap-2"><User size={12} className="text-[#D4AF37]" /> {post.author}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-[#D4AF37] transition-colors">{post.title}</h3>
                  <p className="text-[#B3B3B3] text-sm line-clamp-3 mb-8 leading-relaxed font-medium">{post.subtitle}</p>
                  
                  <div className="mt-auto flex items-center gap-3 text-white text-xs font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                    Ler Mensagem <ArrowRight size={16} className="text-[#D4AF37]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-[#121214] rounded-[60px] border border-dashed border-white/5">
            <Newspaper size={80} className="text-[#D4AF37] opacity-20 mb-8" />
            <h2 className="text-2xl font-bold text-white mb-2">Aguardando Novas Revelações</h2>
            <p className="text-[#6b7280] font-medium">Em breve teremos novos conteúdos edificantes aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
