import React, { useState, useEffect } from 'react';
import { realtimeService, RealtimeEvent } from '../lib/supabase';
import { AlertCircle, Activity, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RealtimeDisplayProps {
  table: string;
  maxItems?: number;
}

export function RealtimeDisplay({ table, maxItems = 10 }: RealtimeDisplayProps) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsConnected(true);
    setError(null);

    try {
      const unsubscribe = realtimeService.subscribe(table, (event) => {
        setEvents((prev) => {
          const updated = [event, ...prev];
          return updated.slice(0, maxItems);
        });
      });

      return () => {
        unsubscribe();
        setIsConnected(false);
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect';
      setError(message);
      setIsConnected(false);
    }
  }, [table, maxItems]);

  const handleClear = () => {
    setEvents([]);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'INSERT':
        return 'text-green-400 bg-green-500/10';
      case 'UPDATE':
        return 'text-blue-400 bg-blue-500/10';
      case 'DELETE':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-white/60 bg-white/5';
    }
  };

  return (
    <div className="bg-supabase-dark border border-white/10 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-sm font-mono font-bold uppercase tracking-widest text-white/60">
              Table: {table}
            </span>
          </div>
        </div>
        {events.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors flex items-center gap-1"
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="w-8 h-8 text-white/20 mx-auto mb-2" />
          <p className="text-white/40 text-sm">
            Waiting for live updates...
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {events.map((event, index) => (
              <motion.div
                key={`${event.timestamp}-${index}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start gap-3 text-xs font-mono bg-black/30 border border-white/5 p-3 rounded-lg hover:border-white/10 transition-colors"
              >
                <span className={`font-bold px-2 py-1 rounded whitespace-nowrap ${getEventColor(event.type)}`}>
                  {event.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-white opacity-60 break-words">
                    {JSON.stringify(event.record, null, 2)}
                  </div>
                  <div className="text-white/30 mt-1">{event.timestamp}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="pt-4 border-t border-white/5">
        <p className="text-xs text-white/40 font-mono">
          Status: <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span> • Events: {events.length}
        </p>
      </div>
    </div>
  );
}
