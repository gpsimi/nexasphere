const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;

// Locate the local Next.js CLI binary inside node_modules
function getNextBin() {
  const possiblePaths = [
    path.join(rootDir, 'node_modules', '.pnpm', 'next@14.1.0_react-dom@18.3.1_react@18.3.1__react@18.3.1', 'node_modules', 'next', 'dist', 'bin', 'next'),
    path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  const pnpmDir = path.join(rootDir, 'node_modules', '.pnpm');
  if (fs.existsSync(pnpmDir)) {
    const entries = fs.readdirSync(pnpmDir);
    for (const e of entries) {
      if (e.startsWith('next@')) {
        const candidate = path.join(pnpmDir, e, 'node_modules', 'next', 'dist', 'bin', 'next');
        if (fs.existsSync(candidate)) return candidate;
      }
    }
  }
  return null;
}

const nextBin = getNextBin();

if (!nextBin) {
  console.error('❌ Could not locate Next.js binary in node_modules.');
  process.exit(1);
}

const apps = [
  { dir: 'services/api', args: ['src/server.js'], port: 4000, name: 'api', isNext: false },
  { dir: 'apps/shell', args: [nextBin, 'dev', '-p', '3000'], port: 3000, name: 'shell', isNext: true },
  { dir: 'apps/dashboard', args: [nextBin, 'dev', '-p', '3001'], port: 3001, name: 'dashboard', isNext: true },
  { dir: 'apps/users', args: [nextBin, 'dev', '-p', '3002'], port: 3002, name: 'users', isNext: true },
  { dir: 'apps/finance', args: [nextBin, 'dev', '-p', '3003'], port: 3003, name: 'finance', isNext: true },
  { dir: 'apps/operations', args: [nextBin, 'dev', '-p', '3004'], port: 3004, name: 'operations', isNext: true },
  { dir: 'apps/inventory', args: [nextBin, 'dev', '-p', '3005'], port: 3005, name: 'inventory', isNext: true },
  { dir: 'apps/reports', args: [nextBin, 'dev', '-p', '3006'], port: 3006, name: 'reports', isNext: true },
  { dir: 'apps/analytics', args: [nextBin, 'dev', '-p', '3007'], port: 3007, name: 'analytics', isNext: true },
  { dir: 'apps/systemHealth', args: [nextBin, 'dev', '-p', '3008'], port: 3008, name: 'system-health', isNext: true }
];

console.log('========================================================================');
console.log('🚀 NEXASPHERE ENTERPRISE CONSOLE — MULTI-ZONE CLUSTER (10 SERVICES)');
console.log('========================================================================\n');

const childProcesses = [];

for (const app of apps) {
  const cwd = path.join(rootDir, app.dir);
  const env = { ...process.env, PORT: String(app.port) };

  const proc = spawn(process.execPath, app.args, {
    cwd,
    env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  proc.stdout.on('data', (data) => {
    const str = data.toString().trim();
    if (str.includes('Ready') || str.includes('running') || str.includes('Connected')) {
      console.log(`[${app.name}:${app.port}] ${str}`);
    }
  });

  proc.stderr.on('data', (data) => {
    const err = data.toString().trim();
    if (!err.includes('Fast Refresh') && !err.includes('warn') && !err.includes('browserslist') && !err.includes('casing')) {
      // ignore minor warnings
    }
  });

  proc.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`[${app.name}] Process exited with code ${code}`);
    }
  });

  childProcesses.push(proc);
  console.log(`✅ Started [${app.name}] on port ${app.port}`);
}

console.log('\n------------------------------------------------------------------------');
console.log('🌟 All 10 services are running concurrently.');
console.log('👉 Host Gateway Shell:  http://localhost:3000');
console.log('👉 Login Portal:        http://localhost:3000/login');
console.log('👉 Executive Dashboard: http://localhost:3000/dashboard');
console.log('👉 Backend REST API:    http://localhost:4000/api/health');
console.log('------------------------------------------------------------------------');
console.log('Press Ctrl + C in this terminal to stop all services.\n');

// Clean termination handler
function cleanExit() {
  console.log('\n🛑 Stopping all NexaSphere services...');
  for (const proc of childProcesses) {
    try {
      proc.kill();
    } catch (e) {}
  }
  process.exit(0);
}

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);

// Keep Node process running
setInterval(() => {}, 1000 * 60);
