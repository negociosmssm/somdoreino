
import React from 'react';
import { AppState } from '../types';
import { Target, Heart, ShieldCheck, Users } from 'lucide-react';

interface AboutProps {
  data: AppState;
}

const About: React.FC<AboutProps> = ({ data }) => {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <header className="text-center mb-20">
          <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs mb-4 block">Nossa Missão</span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 font-display">Louvor que <span className="text-[#D4AF37]">Edifica</span></h1>
          <p className="text-xl text-[#B3B3B3] leading-relaxed italic">
            "{data.settings.slogan}"
          </p>
        </header>

        <div className="bg-[#121214] p-10 md:p-16 rounded-[40px] border border-white/5 shadow-2xl mb-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
           <p className="text-white text-lg md:text-2xl leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-[#D4AF37] first-letter:mr-3 first-letter:float-left">
             {data.settings.aboutText}
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { icon: Target, title: 'Propósito', text: 'Centralizar o louvor que carrega a presença de Deus para fácil acesso.' },
             { icon: Heart, title: 'Adoração', text: 'Promover um estilo de vida de adoração além das paredes da igreja.' },
             { icon: ShieldCheck, title: 'Curadoria', text: 'Garantir conteúdos biblicamente sólidos e musicalmente excelentes.' },
             { icon: Users, title: 'Comunidade', text: 'Apoiar novos talentos e conectar ministérios em todo o mundo.' }
           ].map((item, i) => (
             <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
                <item.icon className="text-[#D4AF37] mb-6" size={32} />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[#B3B3B3]">{item.text}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default About;
