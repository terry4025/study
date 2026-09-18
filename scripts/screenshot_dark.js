import { execSync } from 'child_process';

const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const targetPath = 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_dark_bilingual.png';
const cmd = `"${edgePath}" --headless --disable-gpu --virtual-time-budget=2000 --screenshot="${targetPath}" --window-size=1280,1800 "http://localhost:4173/?mode=bilingual&dark=true"`;

execSync(cmd, { stdio: 'inherit' });
console.log('Dark mode & bilingual screenshot saved with delay!');
