import React, { useState, useEffect } from 'react';
import { Database, Play, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { RealtimeDisplay } from './RealtimeDisplay';

interface DemoEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Record<string, any>;
  timestamp: string;
}

export function RealtimeDemo() {
  const [selectedTable, setSelectedTable] = useState('users');
  const [demoEvents, setDemoEvents] = useState<DemoEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showRealtime, setShowRealtime] = useState(false);

  const tables = ['users', 'posts', 'comments', 'profiles'];
  const operations = ['INSERT', 'UPDATE', 'DELETE'] as const;

  const sampleData: Record<string, Record<string, any>> = {
    users: {
      id: Math.floor(Math.random() * 1000),
      email: 'user@example.com',
      name: 'John Doe',
      created_at: new Date().toISOString(),
    },
    posts: {
      id: Math.floor(Math.random() * 1000),
      title: 'My First Post',
      content: 'This is a sample post',
      user_id: Math.floor(Math.random() * 100),
    },
    comments: {
      id: Math.floor(Math.random() * 1000),
      post_id: Math.floor(Math.random() * 100),
      author: 'Jane Doe',
      text: 'Great post!',
    },
    profiles: {
      id: Math.floor(Math.random() * 1000),
      bio: 'Software Developer',
      avatar_url: 'https://avatar.example.com',
      website: 'https://example.com',
    },
  };

  const simulateEvent = () => {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const event: DemoEvent = {
      type: operation,
      table: selectedTable,
      record: sampleData[selectedTable],
      timestamp: new Date().toLocaleTimeString('es-ES'),
    };

    setDemoEvents((prev) => [event, ...prev].slice(0, 8));
  };

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      simulateEvent();
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, selectedTable]);

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-supabase-dark border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Database className="text-supabase-green" size={20} />
          <h3 className="text-lg font-bold">Realtime Demo</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tables.map((table) => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`px-4 py-2 rounded-lg font-mono text-sm font-bold uppercase tracking-widest transition-all ${
                selectedTable === table
                  ? 'bg-supabase-green text-supabase-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {table}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold transition-all ${
              isSimulating
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-supabase-green/20 text-supabase-green border border-supabase-green/30'
            }`}
          >
            <Play size={16} />
            {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
          </motion.button>

          <button
            onClick={() => setDemoEvents([])}
            className="px-4 py-2 rounded-lg font-bold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Realtime Events Display */}
      <div className="bg-supabase-dark border border-white/10 rounded-xl p-6 space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/60">
          Live Events ({selectedTable})
        </h4>

        {demoEvents.length === 0 ? (
          <div className="text-center py-12">
            <Database className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-white/40 text-sm">
              Click "Start Simulation" to see live events
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {demoEvents.map((event, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start gap-3 text-xs font-mono bg-black/30 border border-white/5 p-3 rounded-lg hover:border-white/10 transition-colors"
              >
                <span
                  className={`font-bold px-2 py-1 rounded whitespace-nowrap ${
                    event.type === 'INSERT'
                      ? 'text-green-400 bg-green-500/10'
                      : event.type === 'UPDATE'
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-red-400 bg-red-500/10'
                  }`}
                >
                  {event.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-white opacity-60 break-words max-h-16 overflow-y-auto">
                    {JSON.stringify(event.record, null, 2)}
                  </div>
                  <div className="text-white/30 mt-1">{event.timestamp}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
        <p className="text-sm text-white/80">
          <span className="font-bold text-supabase-green">💡 Tip:</span> Para ver datos reales de tu Supabase, completa las credenciales en el archivo{' '}
          <code className="bg-black/30 px-2 py-1 rounded">.env.local</code> y selecciona una tabla que exista en tu base de datos.
        </p>
      </div>
    </div>
  );
}
