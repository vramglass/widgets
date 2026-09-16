import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const [pack] = JSON.parse(execFileSync('npm',['pack','--dry-run','--json'],{encoding:'utf8'}));
const allowed = ['package.json','src/index.js','src/index.d.ts','README.md','LICENSE','TERMS.md','TRADEMARKS.md','CHANGELOG.md'].sort();
assert.deepEqual(pack.files.map(file => file.path).sort(),allowed);
console.log(`Verified ${pack.files.length} files; ${pack.size} bytes compressed. No renderer or site source included.`);
