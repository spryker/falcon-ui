
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const searchDirs = [
    path.resolve(__dirname, "../../../../../../../../Spryker"),
    path.resolve(__dirname, "../../../../../../../../SprykerFeature")
];
const outputFile = path.join(__dirname, "auto.zed.entries.ts");

// Optimized parallel directory scanning with early filtering
function findEntries(dir, list = []) {
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // Skip irrelevant directories for performance
                if (!entry.name.startsWith('.') && !entry.name.startsWith('node_modules')) {
                    findEntries(fullPath, list);
                }
            } else if (entry.name === "zed.entry.ts") {
                // Include both Spryker/Zed and SprykerFeature/Zed paths
                if (fullPath.includes("/src/Spryker/Zed/") || fullPath.includes("/src/SprykerFeature/Zed/")) {
                    list.push(fullPath);
                }
            }
        }
    } catch (err) {
        // Silently skip inaccessible directories
        if (err.code !== 'ENOENT' && err.code !== 'EPERM') {
            console.warn(`Warning: Could not access ${dir}:`, err.message);
        }
    }
    return list;
}

const allEntries = [];
searchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        findEntries(dir, allEntries);
    }
});

if (!allEntries.length) {
    console.warn("⚠️  No zed.entry.ts files found under", searchDirs.join(', '));
    // Create empty file to prevent build errors
    const content = `
// AUTO-GENERATED FILE. DO NOT EDIT.
// No zed.entry.ts files found

export const allZedModules = [];
`;
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, content);
    console.log(`Generated empty entries → ${outputFile}`);
    process.exit(0);
}

console.log(`✓ Found ${allEntries.length} zed.entry.ts files`);

const imports = allEntries
    .map((file, i) => {
        const rel = path
            .relative(path.dirname(outputFile), file)
            .split(path.sep)
            .join("/");
        return `import { providers as mod${i} } from './${rel.replace(/\.[^/.]+$/, "")}';`;
    })
    .join("\n");

const array = allEntries.map((_, i) => `mod${i}`).join(", ");
const content = `
// AUTO-GENERATED FILE. DO NOT EDIT.
${imports}

export const allZedModules = [${array}];
`;

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, content);
console.log(`Generated ${allEntries.length} entries → ${outputFile}`);
