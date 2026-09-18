import { execSync } from 'child_process';
import fs from 'fs';

const edgePaths = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];

const foundPath = edgePaths.find(p => fs.existsSync(p));

if (!foundPath) {
  console.error('No browser executable found among standard paths');
  process.exit(1);
}

const targetPath = 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_reader_fig310.png';
const cmd = `"${foundPath}" --headless --disable-gpu --screenshot="${targetPath}" --window-size=1280,1200 "http://localhost:4173"`;
console.log('Running browser screenshot command...');
execSync(cmd, { stdio: 'inherit' });
console.log('Screenshot saved to:', targetPath);
