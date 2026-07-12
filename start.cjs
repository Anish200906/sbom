const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', 'Starting Cyclops SBOM (Backend + Frontend)...');

// Spawn backend server (node server.cjs)
const backend = spawn('node', [path.join(__dirname, 'server.cjs')], { shell: true });

// Spawn frontend server (npx vite)
const frontend = spawn('npx', ['vite'], { shell: true });

function prefixLog(prefix, colorCode, stream) {
  if (!stream) return;
  stream.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed) {
        console.log(`${colorCode}${prefix}\x1b[0m ${trimmed}`);
      }
    });
  });
}

prefixLog('[Backend]', '\x1b[32m', backend.stdout);
prefixLog('[Backend Error]', '\x1b[31m', backend.stderr);
prefixLog('[Frontend]', '\x1b[35m', frontend.stdout);
prefixLog('[Frontend Error]', '\x1b[31m', frontend.stderr);

// Graceful exit
function cleanup() {
  console.log('\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
