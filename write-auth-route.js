const fs = require('fs');
const path = require('path');

// Write the auth route handler (brackets in path require Node.js fs, not PowerShell)
const dir = path.join('app', 'api', 'auth', '[...nextauth]');
fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'route.ts'), `import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
`, 'utf8');
console.log('✓ app/api/auth/[...nextauth]/route.ts');

// Verify
console.log('Files in auth dir:', fs.readdirSync(dir));
