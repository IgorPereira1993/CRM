import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = Object.fromEntries(
  fs.readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.split('='))
);
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const systems = await supabase.from('systems').select('*').limit(1);
console.log('systems error:', systems.error);
console.log('systems data:', systems.data);

const versions = await supabase.from('versions').select('*').limit(1);
console.log('versions error:', versions.error);
console.log('versions data:', versions.data);
