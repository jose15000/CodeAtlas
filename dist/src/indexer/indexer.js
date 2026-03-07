import fs from "fs";
import path from "path";
export function indexerProject(dir) {
    const files = [];
    function walk(current) {
        const items = fs.readdirSync(current);
        for (const item of items) {
            const full = path.join(current, item);
            if (fs.statSync(full).isDirectory()) {
                walk(full);
            }
            else {
                files.push(full);
            }
        }
    }
    walk(dir);
    return files;
}
