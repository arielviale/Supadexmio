export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Database' | 'Auth' | 'Storage' | 'Edge Functions' | 'Realtime';
  codeSnippet: string;
  details: string[];
}

export const features: Feature[] = [
  {
    id: 'db-tables',
    title: 'Table Editor',
    description: 'Manage your data with a spreadsheet-like interface.',
    icon: 'Database',
    category: 'Database',
    codeSnippet: `const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', '123')`,
    details: [
      'Relational database (PostgreSQL)',
      'Auto-generated APIs',
      'Real-time subscriptions',
      'Policy-based security'
    ]
  },
  {
    id: 'auth-providers',
    title: 'Authentication',
    description: 'Add user login and management in minutes.',
    icon: 'Lock',
    category: 'Auth',
    codeSnippet: `const { user, error } = await supabase.auth.signInWithOAuth({
  provider: 'github'
})`,
    details: [
      'Social logins (Google, GitHub, etc.)',
      'Email & Password',
      'Magic links',
      'Multi-factor authentication'
    ]
  },
  {
    id: 'storage-buckets',
    title: 'Storage',
    description: 'Store and serve any type of digital content.',
    icon: 'Folder',
    category: 'Storage',
    codeSnippet: `const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar.png', file)`,
    details: [
      'Large file support',
      'Image transformations',
      'CDN integration',
      'Access control policies'
    ]
  },
  {
    id: 'edge-functions',
    title: 'Edge Functions',
    description: 'Server-side TypeScript functions, distributed globally.',
    icon: 'Zap',
    category: 'Edge Functions',
    codeSnippet: `Deno.serve(async (req) => {
  const { name } = await req.json()
  return new Response(\`Hello \${name}!\`)
})`,
    details: [
      'Low latency',
      'TypeScript support',
      'Deno runtime',
      'Seamless integration'
    ]
  },
  {
    id: 'realtime-sync',
    title: 'Realtime',
    description: 'Listen to database changes in real-time.',
    icon: 'Activity',
    category: 'Realtime',
    codeSnippet: `supabase
  .channel('room1')
  .on('postgres_changes', { event: 'INSERT', schema: 'public' }, payload => {
    console.log('Change received!', payload)
  })
  .subscribe()`,
    details: [
      'Broadcast messages',
      'Presence tracking',
      'Postgres CDC',
      'Low latency'
    ]
  }
];
