import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase, realtimeService } from '../lib/supabase';
import { DataTable } from './DataTable';

interface User {
  id: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Permite cualquier otra columna
}

export function AuthUsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  // Fetch usuarios reales de Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Traer TODOS los datos de la tabla 'users'
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setUsers(data || []);
      setLastUpdate(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar usuarios al montar
    fetchUsers();

    // Suscribirse a cambios en tiempo real
    const setupRealtime = async () => {
      try {
        console.log('🔌 Intentando conectar a Realtime para tabla: users');
        
        const unsubscribe = realtimeService.subscribe('users', (event) => {
          console.log('✅ Cambio detectado en usuarios:', event);
          setRealtimeConnected(true);
          
          // Recargar datos después de detectar un cambio
          setTimeout(() => {
            fetchUsers();
          }, 500);
        });

        // Marcar como conectado después de suscribirse
        setRealtimeConnected(true);
        console.log('✅ Realtime conectado exitosamente');

        return () => {
          console.log('🔌 Desconectando Realtime');
          unsubscribe();
          setRealtimeConnected(false);
        };
      } catch (err) {
        console.warn('⚠️ Realtime no disponible:', err);
        setRealtimeConnected(false);
      }
    };

    const cleanup = setupRealtime();
    
    return () => {
      if (cleanup) cleanup.then(fn => fn?.());
    };
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(date);
    }
  };

  // Generar columnas dinámicamente basadas en los datos
  const generateColumns = () => {
    if (users.length === 0) return [];

    const firstUser = users[0];
    const commonFields = ['id', 'email', 'phone', 'first_name', 'last_name', 'name', 'created_at', 'updated_at', 'password', 'role'];
    
    const columnMap: Record<string, { key: string; label: string; render?: (value: any) => React.ReactNode }> = {
      email: {
        key: 'email',
        label: 'Email',
        render: (value: string) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-supabase-green/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-supabase-green">
                {value?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <span className="font-mono text-xs break-all">{value || '—'}</span>
          </div>
        ),
      },
      phone: {
        key: 'phone',
        label: 'Teléfono',
        render: (value?: string) => value || '—',
      },
      first_name: {
        key: 'first_name',
        label: 'Nombre',
        render: (value?: string) => value || '—',
      },
      last_name: {
        key: 'last_name',
        label: 'Apellido',
        render: (value?: string) => value || '—',
      },
      name: {
        key: 'name',
        label: 'Nombre',
        render: (value?: string) => value || '—',
      },
      created_at: {
        key: 'created_at',
        label: 'Registrado',
        render: (value?: string) => formatDate(value),
      },
      updated_at: {
        key: 'updated_at',
        label: 'Actualizado',
        render: (value?: string) => formatDate(value),
      },
    };

    // Construir columnas en orden de preferencia
    const cols = [];
    for (const field of commonFields) {
      if (field in firstUser && columnMap[field]) {
        cols.push(columnMap[field]);
      }
    }

    // Si hay columnas no comunes, agregarlas
    for (const key in firstUser) {
      if (!commonFields.includes(key) && !cols.some(c => c.key === key) && key !== 'id') {
        cols.push({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
          render: (value: any) => {
            if (typeof value === 'object') return JSON.stringify(value);
            return value || '—';
          },
        });
      }
    }

    return cols;
  };

  const columns = generateColumns();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-supabase-dark border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <Users className="text-supabase-green" size={24} />
          <div className="flex-1">
            <h3 className="text-lg font-bold">Usuarios de Supabase</h3>
            <p className="text-xs text-white/40 mt-1">
              {realtimeConnected && (
                <span className="text-green-400">
                  🟢 Realtime conectado
                </span>
              )}
              {!realtimeConnected && (
                <span className="text-yellow-400">
                  🔴 Realtime desconectado (configura la tabla con Realtime enabled)
                </span>
              )}
              {lastUpdate && ` • Última actualización: ${lastUpdate.toLocaleTimeString('es-ES')}`}
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
            title="Actualizar"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/30 border border-white/5 p-4 rounded-lg">
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
              Total de Usuarios
            </p>
            <p className="text-2xl font-bold text-supabase-green">{users.length}</p>
          </div>
          <div className="bg-black/30 border border-white/5 p-4 rounded-lg">
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
              Estado Realtime
            </p>
            <p className={`text-sm font-bold ${realtimeConnected ? 'text-green-400' : 'text-red-400'}`}>
              {realtimeConnected ? '✓ Conectado' : '✗ Desconectado'}
            </p>
          </div>
          <div className="bg-black/30 border border-white/5 p-4 rounded-lg">
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
              Tabla
            </p>
            <p className="text-sm font-bold text-white/80">users</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-400 font-bold">Error al conectar</p>
              <p className="text-xs text-red-300 mt-1">{error}</p>
              <p className="text-xs text-white/60 mt-2">
                Asegúrate de que la tabla <code className="bg-black/30 px-1 rounded">users</code> existe en tu Supabase
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      {users.length === 0 && !error && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-white/80">
            <span className="font-bold text-blue-400">ℹ️ Esperando datos...</span> Parece que la tabla está vacía o aún se está conectando.
          </p>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={users}
        columns={columns}
        title={`${users.length} Usuario${users.length !== 1 ? 's' : ''}`}
        loading={loading}
      />

      {/* Setup Instructions */}
      <div className="space-y-6">
        <div className="bg-supabase-dark border border-white/10 rounded-xl p-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">
            📋 Pasos para configurar tu tabla de usuarios
          </h4>
          <ol className="space-y-3 text-sm text-white/80">
            <li className="flex gap-3">
              <span className="font-bold text-supabase-green flex-shrink-0">1.</span>
              <span>
                Ve a tu proyecto en{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-supabase-green hover:underline"
                >
                  supabase.com
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-supabase-green flex-shrink-0">2.</span>
              <span>
                Ve a <strong>SQL Editor</strong> y ejecuta este código:
              </span>
            </li>
          </ol>
        </div>

        <div className="bg-supabase-dark border border-white/10 rounded-xl p-6">
          <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-xs font-mono text-green-400 whitespace-pre-wrap">
            <code>{`CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política pública (solo lectura)
CREATE POLICY "Public read access" ON users 
  FOR SELECT USING (true);

-- Política pública (inserción)
CREATE POLICY "Public insert access" ON users 
  FOR INSERT WITH CHECK (true);

-- Política pública (actualización)
CREATE POLICY "Public update access" ON users 
  FOR UPDATE USING (true);`}</code>
          </pre>
        </div>

        <div className="bg-supabase-dark border border-white/10 rounded-xl p-6 space-y-3">
          <div className="flex gap-3">
            <span className="font-bold text-supabase-green flex-shrink-0 mt-0.5">3.</span>
            <div className="space-y-2">
              <p className="text-sm text-white/80">
                Habilita <strong>Realtime</strong> en tu tabla:
              </p>
              <ul className="text-xs text-white/60 list-disc list-inside space-y-1">
                <li>Abre tu tabla <code className="bg-black/30 px-1 rounded">users</code></li>
                <li>Haz clic en <strong>Settings</strong> (arriba a la derecha)</li>
                <li>Busca <strong>Replication</strong> → <strong>Realtime</strong></li>
                <li>Activa el toggle</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-sm text-white/80">
            <span className="font-bold text-green-400">✓ Listo!</span> Una vez completados estos pasos, actualiza la página y verás tus datos en la tabla anterior.
          </p>
        </div>

        {/* Insertar datos de prueba */}
        <div className="bg-supabase-dark border border-white/10 rounded-xl p-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">
            (Opcional) Insertar datos de prueba
          </h4>
          <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-xs font-mono text-blue-400 whitespace-pre-wrap">
            <code>{`INSERT INTO users (email, phone, first_name, last_name) 
VALUES 
  ('juan@example.com', '+34 922 123456', 'Juan', 'García'),
  ('maria@example.com', '+34 922 654321', 'María', 'López'),
  ('carlos@example.com', '+34 922 789012', 'Carlos', 'Pérez');`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
