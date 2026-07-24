export function loadConfig(env = process.env) {
  const config = {
    supabaseUrl: env.SUPABASE_URL,
    supabaseKey: env.SUPABASE_KEY,
    port: Number(env.PORT || 3000),
  };

  if (!config.supabaseUrl || !config.supabaseKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_KEY are required. Copy .env.example to .env and add your project values.",
    );
  }

  return config;
}
