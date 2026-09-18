import { execSync } from 'child_process';
import fs from 'fs';

const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const targetPath = 'C:/Users/Administrator/.gemini/antigravity/brain/8729da27-8359-487f-bba9-80250895f622/screenshot_fig310_focused.png';
// Large vertical viewport to capture Figure 3.10 clearly
const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${targetPath}" --window-size=1280,2600 "http://localhost:4173"`;

execSync(cmd, { stdio: 'inherit' });
console.log('Tall screenshot saved!');
