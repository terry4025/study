import { execSync } from 'child_process';

const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const targetPath = 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_library_modal.png';
const cmd = `"${edgePath}" --headless --disable-gpu --virtual-time-budget=2000 --screenshot="${targetPath}" --window-size=1280,1000 "http://localhost:4173/?library=true"`;

execSync(cmd, { stdio: 'inherit' });
console.log('Library modal screenshot saved!');
