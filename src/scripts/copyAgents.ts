import fs from 'fs';
import path from 'path';

// Arquivos que não queremos exportar pro consumidor final
const EXCLUDES = [
    'publishNpm.md',
    'test-atlas.md',
    'commit.md'
];

function run() {
    const srcDir = path.resolve(process.cwd(), '.agents');
    const destDir = path.resolve(process.cwd(), 'dist', 'agents-template');

    if (!fs.existsSync(srcDir)) {
        console.warn('⚠️ No .agents directory found to copy.');
        return;
    }

    if (fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true, force: true });
    }
    fs.mkdirSync(destDir, { recursive: true });

    function copyRecursive(src: string, dest: string) {
        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
            if (EXCLUDES.includes(entry.name)) {
                continue; // Ignorar o pacote de desenvolvimento interno
            }

            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyRecursive(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    copyRecursive(srcDir, destDir);
    console.log(`✅ Copied public .agents to ${destDir}`);
}

run();
