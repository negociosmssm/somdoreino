
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogPostDetailProps {
  posts: BlogPost[];
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ posts }) => {
  const { id } = useParams();
  const post = posts.find(p => p.id === id);

  if (!post) return <Navigate to="/blog" />;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#D4AF37] transition-colors font-bold text-xs uppercase tracking-widest mb-12 animate-fade-in">
          <ArrowLeft size={16} /> Voltar para o Blog
        </Link>

        <article className="animate-slide-up">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#D4AF37]/20">
                {post.category}
              </span>
              <span className="text-[#6b7280] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> {post.date}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white font-display leading-tight mb-8">
              {post.title}
            </h1>
            <p className="text-xl text-[#B3B3B3] font-medium leading-relaxed border-l-4 border-[#D4AF37] pl-8">
              {post.subtitle}
            </p>
          </header>

          <div className="aspect-video w-full rounded-[40px] overflow-hidden mb-16 shadow-2xl">
            <img src={post.cover} className="w-full h-full object-cover" alt={post.title} />
          </div>

          <div className="prose prose-invert prose-p:text-[#B3B3B3] prose-p:text-lg prose-p:leading-loose prose-headings:text-white prose-headings:font-display max-w-none">
            {post.content.split('\n').map((para, i) => (
              para.trim() && <p key={i} className="mb-8">{para}</p>
            ))}
          </div>

          <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#f5e0a3] flex items-center justify-center text-black font-black text-xl shadow-xl">
                {post.author.substring(0,1)}
              </div>
              <div>
                <p className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest mb-1">Autor da Mensagem</p>
                <p className="text-white font-bold text-lg">{post.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-2xl text-white font-bold transition-all border border-white/10 group">
                  <Share2 size={18} className="group-hover:rotate-12 transition-transform" /> Compartilhar Alimento
               </button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogPostDetail;
