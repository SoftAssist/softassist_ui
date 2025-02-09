const { exec } = require('child_process');
const os = require('os');

const port = 3000; // Match this with your webpack config port

const isWindows = os.platform() === 'win32';

const command = isWindows
  ? `FOR /F "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /F /PID %a`
  : `lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs -r kill -9`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    // Ignore errors as the port might not be in use
    console.log('Port was not in use, starting fresh.');
    return;
  }
  if (stdout) {
    console.log('Cleaned up port', port);
  }
});

// Handle cleanup on process termination
process.on('SIGINT', () => {
  exec(command, () => {
    console.log('\nPort cleanup completed. Exiting...');
    process.exit(0);
  });
}); 