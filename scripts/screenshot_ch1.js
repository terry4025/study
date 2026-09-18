import { execSync } from 'child_process';

const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const target1 = 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch01_01_full.png';
const target3 = 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_ch01_03_overview.png';

console.log('Capturing Chapter 1.1...');
execSync(`"${edgePath}" --headless --disable-gpu --virtual-time-budget=2000 --screenshot="${target1}" --window-size=1280,2400 "http://localhost:4173/?sec=ch01-01"`, { stdio: 'inherit' });

console.log('Capturing Chapter 1.3...');
execSync(`"${edgePath}" --headless --disable-gpu --virtual-time-budget=2000 --screenshot="${target3}" --window-size=1280,2400 "http://localhost:4173/?sec=ch01-03"`, { stdio: 'inherit' });

console.log('Done captures!');
