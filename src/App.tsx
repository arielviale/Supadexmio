import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { features, Feature } from './constants';
import { cn } from './lib/utils';

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

  const filteredFeatures = features.filter(f => {
    const matchesCategory = !selectedCategory || f.category === selectedCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(features.map(f => f.category)));

  return (
    <div className="flex h-screen bg-supabase-black text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="border-r border-white/10 bg-supabase-dark flex flex-col z-20"
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
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {isSidebarOpen && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-supabase-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search features, functions, docs..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-supabase-green/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
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
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <header className="mb-12">
              <h1 className="text-4xl font-bold mb-4 tracking-tight">
                {selectedCategory || 'Supabase Features'}
              </h1>
              <p className="text-white/60 text-lg max-w-2xl">
                Explore the powerful tools and functions that make Supabase the best open-source Firebase alternative.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-supabase-dark border-l border-white/10 z-50 overflow-y-auto"
            >
              <div className="p-8">
                <button 
                  onClick={() => setActiveFeature(null)}
                  className="mb-8 p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-supabase-green/10 rounded-2xl flex items-center justify-center">
                    {React.createElement(IconMap[activeFeature.icon], { 
                      className: "text-supabase-green",
                      size: 32
                    })}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-supabase-green mb-1 block">
                      {activeFeature.category}
                    </span>
                    <h2 className="text-3xl font-bold">{activeFeature.title}</h2>
                  </div>
                </div>

                <p className="text-white/60 text-lg mb-10 leading-relaxed">
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
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Code2 size={16} /> Code Example
                      </h4>
                      <button className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                        Copy Snippet
                      </button>
                    </div>
                    <div className="bg-supabase-black rounded-xl p-6 border border-white/10 font-mono text-sm overflow-x-auto">
                      <pre className="text-supabase-green">
                        <code>{activeFeature.codeSnippet}</code>
                      </pre>
                    </div>
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

                  <div className="pt-8 border-t border-white/10 flex gap-4">
                    <button className="flex-1 bg-supabase-green text-supabase-black font-bold py-3 rounded-xl hover:bg-supabase-green/90 transition-colors flex items-center justify-center gap-2">
                      Documentation <ExternalLink size={18} />
                    </button>
                    <button className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                      View Examples
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
