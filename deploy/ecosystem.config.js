// pm2 process manager config for the two Node apps.
//   pm2 start deploy/ecosystem.config.js
//   pm2 save && pm2 startup      # survive reboots
//
// Secrets: the backend reads backend/.env via dotenv, so put production
// values there (see deploy/backend.env.example). The admin app has its API
// URL baked at BUILD time (NEXT_PUBLIC_API_BASE_URL) — nothing secret at runtime.

module.exports = {
  apps: [
    {
      name: "pp-api",
      cwd: "./backend",
      script: "dist/server.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "400M",
      env: { NODE_ENV: "production" },
    },
    {
      name: "pp-admin",
      cwd: "./admin",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 4000",
      instances: 1,
      autorestart: true,
      max_memory_restart: "400M",
      env: { NODE_ENV: "production" },
    },
  ],
};
