import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createSupabaseClient } from "./supabase.js";

const config = loadConfig();
const supabase = createSupabaseClient(config);
const app = createApp({ supabase });

app.listen(config.port, () => {
  console.log(`Server running and connected to Supabase on http://localhost:${config.port}`);
});
