
import React, { useState } from 'react';
import { UPCOMING_PROJECTS } from './constants';
import InstagramGallerySection from './components/InstagramGallerySection';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarLinks = [
    "About us", "Article", "Upcoming", "Our Projects", "Recommendations", "Contact us"
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-200 flex selection:bg-yellow-500 selection:text-black">
      {/* PROFESSIONAL SIDEBAR */}
      <aside 
        className={`fixed lg:sticky top-0 h-screen z-50 bg-zinc-950/40 backdrop-blur-3xl border-r border-white/5 transition-all duration-700 flex flex-col ${
          isSidebarOpen ? 'w-72' : 'w-0 lg:w-20'
        }`}
      >
        <div className="p-8 flex items-center gap-5 mb-10 group cursor-pointer">
          <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.2)] shrink-0 transition-transform group-hover:scale-110 duration-500">
            <span className="text-black font-black text-2xl tracking-tighter -translate-x-0.5">ee</span>
          </div>
          {isSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
              <h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none text-zinc-100">VEE</h1>
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1.5">Art Media Collective</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarLinks.map(link => (
            <button 
              key={link}
              className={`w-full text-left px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 rounded-xl group relative overflow-hidden ${
                link === 'Upcoming' ? 'text-zinc-100 bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              {isSidebarOpen ? link : link[0]}
              {link === 'Upcoming' && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-yellow-400 rounded-full"></div>}
            </button>
          ))}
        </nav>

        {isSidebarOpen && (
          <div className="p-8 border-t border-white/5 space-y-4">
            <div className="flex gap-4 opacity-40 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 rounded-full bg-white/10"></div>
              <div className="w-6 h-6 rounded-full bg-white/10"></div>
              <div className="w-6 h-6 rounded-full bg-white/10"></div>
            </div>
            <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">EST. 2013 • HK ARCHIVE</p>
          </div>
        )}
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 lg:px-16 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-16">
          {/* UPCOMING SECTION */}
          <section className="mb-24">
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none text-zinc-100">Upcoming</h2>
                <div className="h-2 w-24 bg-yellow-500 mt-4"></div>
              </div>
              <span className="text-zinc-700 text-[11px] font-black uppercase tracking-[0.4em] hidden md:block">Future Trajectory</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              {UPCOMING_PROJECTS.map(proj => (
                <div key={proj.id} className="group relative bg-zinc-950 border border-white/5 rounded-[40px] overflow-hidden p-10 lg:p-14 hover:border-yellow-500/20 transition-all duration-700">
                  <div className="flex justify-between items-start mb-16">
                    <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black px-4 py-2 rounded-full tracking-widest uppercase">
                      {proj.tag}
                    </span>
                    <span className="text-zinc-600 text-[11px] font-bold tracking-widest uppercase">{proj.date}</span>
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-black italic mb-6 leading-none group-hover:text-yellow-400 transition-colors duration-500 text-zinc-100">{proj.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-12 max-w-md">{proj.description}</p>
                  <div className="flex items-center gap-6">
                    <button className="bg-zinc-200 text-black text-[10px] font-black px-8 py-4 rounded-2xl tracking-[0.2em] hover:bg-yellow-400 transition-all uppercase active:scale-95">
                      REGISTER INTEREST
                    </button>
                    <div className="flex-1 h-[1px] bg-white/5 group-hover:bg-yellow-500/20 transition-colors duration-700"></div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-500/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                </div>
              ))}
            </div>
          </section>

          {/* INSTAGRAM GALLERY SECTION */}
          <InstagramGallerySection />
        </main>

        <footer className="p-20 text-center border-t border-white/5 mt-auto bg-zinc-950/20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto space-y-8">
             <div className="w-10 h-10 bg-[#FFD700] rounded-full mx-auto flex items-center justify-center shadow-lg">
                <span className="text-black font-black text-lg tracking-tighter -translate-x-0.5">ee</span>
             </div>
             <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.6em] leading-relaxed">
              VEEHK COLLECTIVE ARCHIVE • GLOBAL MEDIA ASSETS • SINCE 2013 • HK UNDERGROUND FREQUENCY
             </p>
          </div>
        </footer>
      </div>

    </div>
  );
};

export default App;
