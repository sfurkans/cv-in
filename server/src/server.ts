import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 Server: http://localhost:${env.PORT}`);
  console.log(`📦 Env: ${env.NODE_ENV}`);
});
