// Simple deploy script that ignores TypeScript errors
const { execSync } = require('child_process');

// Set environment variables to ignore TypeScript errors
process.env.TSC_COMPILE_ON_ERROR = 'true';
process.env.CI = 'false';

try {
  // Run build
  console.log('Building app...');
  execSync('npm run build', { stdio: 'inherit' });

  // Deploy to GitHub Pages
  console.log('Deploying to GitHub Pages...');
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });

  console.log('Successfully deployed!');
} catch (error) {
  console.error('Error during deployment:', error.message);
  process.exit(1);
}
