import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Lock, 
  Folder, 
  Zap, 
  Activity, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Code2, 
  ExternalLink,
  Github,
  Twitter,
  LayoutGrid,
  Layers,
  Zap as Bolt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { features, Feature } from './constants';
import { cn } from './lib/utils';
import { CodePlayground } from './components/CodePlayground';
import { RealtimeDemo } from './components/RealtimeDemo';
import { AuthUsersList } from './components/AuthUsersList';

const IconMap: Record<string, React.ElementType> = {
  Database,
  Lock,
  Folder,
  Zap,
  Activity,
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'features' | 'realtime' | 'users'>('features');

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredFeatures = features.filter(f => {
    const matchesCategory = !selectedCategory || f.category === selectedCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(features.map(f => f.category)));

  return (
    <div className="flex h-screen bg-supabase-black text-white overflow-hidden">
      {/* Mobile overlay when sidebar is open */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 80,
          x: isMobile && !isSidebarOpen ? -280 : 0
        }}
        className={cn(
          "border-r border-white/10 bg-supabase-dark flex flex-col z-40",
          isMobile ? "fixed h-screen" : "relative"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-supabase-green rounded-lg flex items-center justify-center">
                <Database className="text-supabase-black w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">Supadex</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-supabase-green rounded-lg flex items-center justify-center mx-auto">
              <Database className="text-supabase-black w-5 h-5" />
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              !selectedCategory ? "bg-supabase-green/10 text-supabase-green" : "hover:bg-white/5 text-white/60 hover:text-white"
            )}
          >
            <LayoutGrid size={20} />
            {isSidebarOpen && <span>All Features</span>}
          </button>
          
          <div className="pt-4 pb-2 px-3">
            {isSidebarOpen && <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Categories</p>}
          </div>

          {categories.map(cat => {
            const Icon = IconMap[features.find(f => f.category === cat)?.icon || 'Database'];
            return (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  selectedCategory === cat ? "bg-supabase-green/10 text-supabase-green" : "hover:bg-white/5 text-white/60 hover:text-white"
                )}
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{cat}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button 
            onClick={() => {
              setViewMode('features');
              setSelectedCategory(null);
              setActiveFeature(null);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
              viewMode === 'features' 
                ? "bg-supabase-green/10 text-supabase-green" 
                : "hover:bg-white/5 text-white/60 hover:text-white"
            )}
          >
            <LayoutGrid size={20} />
            {isSidebarOpen && <span>Características</span>}
          </button>

          <button 
            onClick={() => {
              setViewMode('users');
              setSelectedCategory(null);
              setActiveFeature(null);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
              viewMode === 'users' 
                ? "bg-supabase-green/10 text-supabase-green" 
                : "hover:bg-white/5 text-white/60 hover:text-white"
            )}
          >
            <Lock size={20} />
            {isSidebarOpen && <span>Usuarios</span>}
          </button>

          <button 
            onClick={() => {
              setViewMode('realtime');
              setSelectedCategory(null);
              setActiveFeature(null);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
              viewMode === 'realtime' 
                ? "bg-supabase-green/10 text-supabase-green" 
                : "hover:bg-white/5 text-white/60 hover:text-white"
            )}
          >
            <Activity size={20} />
            {isSidebarOpen && <span>Tiempo Real</span>}
          </button>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {isSidebarOpen && <span>Ocultar Sidebar</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden relative transition-all",
        isMobile && isSidebarOpen ? "ml-0" : ""
      )}>
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-supabase-black/50 backdrop-blur-md sticky top-0 z-10">
          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <div className={cn(
            "relative flex-1 max-w-96",
            isMobile && isSidebarOpen ? "hidden" : ""
          )}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
            <input 
              type="text" 
              placeholder={isMobile ? "Search..." : "Search features, functions, docs..."}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-supabase-green/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Desktop header buttons */}
          <div className={cn(
            "flex items-center gap-4",
            isMobile ? "hidden" : ""
          )}>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <button className="bg-supabase-green text-supabase-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-supabase-green/90 transition-colors">
              Get Started
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {viewMode === 'realtime' && (
              <>
                <header className="mb-8 md:mb-12">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="text-supabase-green" size={32} />
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                      Tiempo Real
                    </h1>
                  </div>
                  <p className="text-white/60 text-sm md:text-lg max-w-2xl">
                    Monitorea cambios en vivo en tus tablas de Supabase. Visualiza operaciones INSERT, UPDATE y DELETE conforme suceden.
                  </p>
                </header>
                <RealtimeDemo />
              </>
            )}

            {viewMode === 'users' && (
              <>
                <header className="mb-8 md:mb-12">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 tracking-tight">
                    Control de Usuarios
                  </h1>
                  <p className="text-white/60 text-sm md:text-lg max-w-2xl">
                    Visualiza y gestiona todos los usuarios autenticados en tu aplicación Supabase.
                  </p>
                </header>
                <AuthUsersList />
              </>
            )}

            {viewMode === 'features' && (
              <>
                <header className="mb-8 md:mb-12">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 tracking-tight">
                    {selectedCategory || 'Características de Supabase'}
                  </h1>
                  <p className="text-white/60 text-sm md:text-lg max-w-2xl">
                    Explora las herramientas y funciones que hacen de Supabase la mejor alternativa open-source a Firebase.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredFeatures.map((feature) => (
                  <motion.div
                    layout
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    className="group cursor-pointer"
                    onClick={() => setActiveFeature(feature)}
                  >
                    <div className="bg-supabase-dark border border-white/10 p-6 rounded-2xl h-full flex flex-col hover:border-supabase-green/30 transition-all duration-300 shadow-xl shadow-black/20">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-supabase-green/10 transition-colors">
                          {React.createElement(IconMap[feature.icon], { 
                            className: "text-white/60 group-hover:text-supabase-green transition-colors",
                            size: 24
                          })}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 bg-white/5 px-2 py-1 rounded">
                          {feature.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-supabase-green transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-supabase-green text-sm font-medium gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ChevronRight size={16} />
                      </div>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal / Panel */}
      <AnimatePresence>
        {activeFeature && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFeature(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed bg-supabase-dark border-white/10 z-50 overflow-y-auto",
                isMobile 
                  ? "inset-x-0 bottom-0 top-16 rounded-t-3xl border-t"
                  : "right-0 top-0 bottom-0 w-full max-w-2xl border-l"
              )}
            >
              <div className="p-4 md:p-8">
                <button 
                  onClick={() => setActiveFeature(null)}
                  className="mb-4 md:mb-8 p-2 hover:bg-white/5 rounded-full transition-colors float-right"
                >
                  <X size={24} />
                </button>

                <div className="flex flex-col md:flex-row items-start gap-4 mb-6 clear-both">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-supabase-green/10 rounded-2xl flex-shrink-0 flex items-center justify-center">
                    {React.createElement(IconMap[activeFeature.icon], { 
                      className: "text-supabase-green",
                      size: isMobile ? 24 : 32
                    })}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-supabase-green mb-1 block">
                      {activeFeature.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold">{activeFeature.title}</h2>
                  </div>
                </div>

                <p className="text-white/60 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
                  {activeFeature.description}
                </p>

                <div className="space-y-8">
                  <section>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                      <Layers size={16} /> Key Capabilities
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeFeature.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                          <div className="w-1.5 h-1.5 bg-supabase-green rounded-full" />
                          <span className="text-sm text-white/80">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                      <Code2 size={16} /> Code Example
                    </h4>
                    <CodePlayground 
                      code={activeFeature.codeSnippet}
                      language="typescript"
                    />
                  </section>

                  {activeFeature.id === 'realtime-sync' && (
                    <section className="bg-supabase-black/50 border border-supabase-green/20 rounded-xl p-6">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-supabase-green mb-4 flex items-center gap-2">
                        <Activity size={16} /> Live Simulation
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-white/40 font-mono">
                          <span>Channel: room1</span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-supabase-green rounded-full animate-pulse" />
                            Connected
                          </span>
                        </div>
                        <div className="bg-supabase-black border border-white/5 rounded-lg p-3 font-mono text-xs space-y-2 h-32 overflow-y-auto">
                          <p className="text-supabase-green opacity-50">[15:08:01] Subscribed to postgres_changes</p>
                          <p className="text-white/80 animate-in fade-in slide-in-from-left-2">
                            <span className="text-supabase-green">INSERT:</span> {"{ id: 1, name: 'New User' }"}
                          </p>
                          <p className="text-white/80 animate-in fade-in slide-in-from-left-2 delay-1000">
                            <span className="text-supabase-green">UPDATE:</span> {"{ id: 1, status: 'online' }"}
                          </p>
                        </div>
                      </div>
                    </section>
                  )}

                  <div className={cn(
                    "pt-8 border-t border-white/10 flex gap-4",
                    isMobile ? "flex-col" : ""
                  )}>
                    <button className={cn(
                      "bg-supabase-green text-supabase-black font-bold py-3 rounded-xl hover:bg-supabase-green/90 transition-colors flex items-center justify-center gap-2",
                      isMobile ? "w-full" : "flex-1"
                    )}>
                      Documentation <ExternalLink size={18} />
                    </button>
                    <button className={cn(
                      "bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10",
                      isMobile ? "w-full" : "flex-1"
                    )}>
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
