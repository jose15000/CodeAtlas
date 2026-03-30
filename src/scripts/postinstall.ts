import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function run() {
    const targetDirStr = process.env.INIT_CWD;

    if (!targetDirStr) {
        return;
    }

    const currentDir = process.cwd();
    if (path.resolve(targetDirStr) === path.resolve(currentDir)) {
        return;
    }

    const templateDir = path.resolve(__dirname, '..', 'agents-template');
    const targetAgentsDir = path.resolve(targetDirStr, '.agents');

    if (!fs.existsSync(templateDir)) {
        return;
    }

    if (!fs.existsSync(targetAgentsDir)) {
        fs.mkdirSync(targetAgentsDir, { recursive: true });
    }

    function copyRecursive(src: string, dest: string) {
        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                if (!fs.existsSync(destPath)) {
                    fs.mkdirSync(destPath, { recursive: true });
                }
                copyRecursive(srcPath, destPath);
            } else {
                if (!fs.existsSync(destPath)) {
                    fs.copyFileSync(srcPath, destPath);
                    console.log(`[ContextAtlas] Workflow agent model instalado: ${entry.name}`);
                }
            }
        }
    }

    copyRecursive(templateDir, targetAgentsDir);
}

run();
