import { createClient, RealtimeChannel } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

export interface RealtimeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Record<string, any>;
  timestamp: string;
}

export class RealtimeService {
  private channel: RealtimeChannel | null = null;
  private listeners: ((event: RealtimeEvent) => void)[] = [];

  /**
   * Subscribe to real-time changes in a Supabase table
   */
  public subscribe(table: string, callback: (event: RealtimeEvent) => void) {
    this.listeners.push(callback);

    if (!this.channel) {
      this.channel = supabase
        .channel(`public:${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
          },
          (payload) => {
            const event: RealtimeEvent = {
              type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
              table: table,
              record: payload.new || payload.old,
              timestamp: new Date().toLocaleTimeString('es-ES'),
            };

            this.listeners.forEach((listener) => listener(event));
          }
        )
        .subscribe((status) => {
          console.log(`Realtime subscription status: ${status}`);
        });
    }

    return () => this.unsubscribe();
  }

  /**
   * Unsubscribe from real-time updates
   */
  public unsubscribe() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
      this.listeners = [];
    }
  }

  /**
   * Fetch initial data from a table
   */
  public async fetchData<T>(
    table: string,
    options?: { limit?: number; select?: string }
  ): Promise<T[]> {
    try {
      let query = supabase.from(table).select(options?.select || '*');

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as T[];
    } catch (error) {
      console.error(`Error fetching data from ${table}:`, error);
      return [];
    }
  }

  /**
   * Insert data into a table
   */
  public async insertData(table: string, data: Record<string, any>) {
    try {
      const { error } = await supabase.from(table).insert([data]);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error inserting data into ${table}:`, error);
      return { success: false, error };
    }
  }

  /**
   * Update data in a table
   */
  public async updateData(
    table: string,
    id: string | number,
    data: Record<string, any>
  ) {
    try {
      const { error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error updating data in ${table}:`, error);
      return { success: false, error };
    }
  }
}

export const realtimeService = new RealtimeService();
