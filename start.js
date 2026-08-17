const { spawn } = require('child_process');
const path = require('path');

const rootDir = __dirname;

const apps = [
  { dir: 'services/api', cmd: 'node', args: ['src/server.js'], port: 4000, name: 'api' },
  { dir: 'apps/shell', cmd: 'npx', args: ['next', 'dev', '-p', '3000'], port: 3000, name: 'shell' },
  { dir: 'apps/dashboard', cmd: 'npx', args: ['next', 'dev', '-p', '3001'], port: 3001, name: 'dashboard' },
  { dir: 'apps/users', cmd: 'npx', args: ['next', 'dev', '-p', '3002'], port: 3002, name: 'users' },
  { dir: 'apps/finance', cmd: 'npx', args: ['next', 'dev', '-p', '3003'], port: 3003, name: 'finance' },
  { dir: 'apps/operations', cmd: 'npx', args: ['next', 'dev', '-p', '3004'], port: 3004, name: 'operations' },
  { dir: 'apps/inventory', cmd: 'npx', args: ['next', 'dev', '-p', '3005'], port: 3005, name: 'inventory' },
  { dir: 'apps/reports', cmd: 'npx', args: ['next', 'dev', '-p', '3006'], port: 3006, name: 'reports' },
  { dir: 'apps/analytics', cmd: 'npx', args: ['next', 'dev', '-p', '3007'], port: 3007, name: 'analytics' },
  { dir: 'apps/systemHealth', cmd: 'npx', args: ['next', 'dev', '-p', '3008'], port: 3008, name: 'system-health' }
];

console.log('================================================================');
console.log('🚀 Launching NexaSphere Enterprise Multi-Zone Cluster (10 Nodes)');
console.log('================================================================\n');

for (const app of apps) {
  const cwd = path.join(rootDir, app.dir);
  const env = { ...process.env, PORT: String(app.port) };
  
  const proc = spawn(app.cmd, app.args, {
    cwd,
    env,
    shell: true,
    stdio: 'inherit'
  });

  proc.on('error', (err) => {
    console.error(`[${app.name}] Error: ${err.message}`);
  });
}

console.log('\n🌟 All 10 services spawned.');
console.log('👉 Open your browser at: http://localhost:3000 (Shell Gateway)');
console.log('👉 Login Portal:        http://localhost:3000/login');
console.log('👉 Backend API:         http://localhost:4000/api/health\n');
