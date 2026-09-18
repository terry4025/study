import { execSync } from 'child_process';

const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const targetPath = 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_code_union.png';
const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${targetPath}" --window-size=1280,3800 "http://localhost:4173"`;

execSync(cmd, { stdio: 'inherit' });
console.log('Code and union screenshot saved!');
