const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

// Replace standard :root with extended variables
css = css.replace(/:root \{[\s\S]*?\n\}/, `:root {
  --bg-primary: #f5f5f7;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --bg-hover: #e8e8ed;
  --border: #d2d2d7;
  --border-light: #e5e5ea;
  --text-primary: #1d1d1f;
  --text-secondary: #86868b;
  --text-muted: #9e9ea7;
  --accent: #007aff;
  --accent-hover: #005bb5;
  --accent-light: rgba(0, 122, 255, 0.1);
  --success: #34c759;
  --warning: #ff9500;
  --danger: #ff3b30;
  --info: #5ac8fa;
  --purple: #af52de;
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-sidebar: rgba(245, 245, 247, 0.75);
  --shadow-color: rgba(0,0,0,0.03);
  --shadow-strong: rgba(0,0,0,0.08);
  --border-subtle: rgba(0,0,0,0.05);
  --highlight-subtle: rgba(0,0,0,0.05);
  --btn-secondary-bg: #ffffff;
  --btn-secondary-hover: #f0f0f4;
  --table-header: #f9f9fb;
  --toast-bg: rgba(255,255,255,0.9);
}`);

css = css.replace(/\.dark \{[\s\S]*?\n\}/, `.dark {
  --bg-primary: #000000;
  --bg-secondary: #1c1c1e;
  --bg-card: #1c1c1e;
  --bg-hover: #2c2c2e;
  --border: #38383a;
  --border-light: #2c2c2e;
  --text-primary: #f5f5f7;
  --text-secondary: #98989d;
  --text-muted: #636366;
  --accent: #0a84ff;
  --accent-hover: #007aff;
  --accent-light: rgba(10, 132, 255, 0.15);
  --success: #32d74b;
  --warning: #ff9f0a;
  --danger: #ff453a;
  --info: #64d2ff;
  --purple: #bf5af2;
  --glass-bg: rgba(28, 28, 30, 0.85);
  --glass-sidebar: rgba(28, 28, 30, 0.75);
  --shadow-color: rgba(0,0,0,0.3);
  --shadow-strong: rgba(0,0,0,0.5);
  --border-subtle: rgba(255,255,255,0.1);
  --highlight-subtle: rgba(255,255,255,0.05);
  --btn-secondary-bg: #1c1c1e;
  --btn-secondary-hover: #2c2c2e;
  --table-header: #1c1c1e;
  --toast-bg: rgba(28, 28, 30, 0.9);
}`);

// Now replace hardcoded occurences with the CSS variables.
const replacements = [
  // Box shadows
  [/box-shadow: 0 4px 20px rgba\(0,0,0,0.03\);/g, 'box-shadow: 0 4px 20px var(--shadow-color);'],
  [/box-shadow: 0 1px 2px rgba\(0,0,0,0.05\);/g, 'box-shadow: 0 1px 2px var(--shadow-color);'],
  [/box-shadow: 0 4px 16px rgba\(0,0,0,0.03\);/g, 'box-shadow: 0 4px 16px var(--shadow-color);'],
  [/box-shadow: 0 6px 20px rgba\(0,0,0,0.06\);/g, 'box-shadow: 0 6px 20px var(--shadow-strong);'],
  [/box-shadow: 0 2px 8px rgba\(0,0,0,0.02\);/g, 'box-shadow: 0 2px 8px var(--shadow-color);'],
  [/box-shadow: 0 20px 40px rgba\(0,0,0,0.15\);/g, 'box-shadow: 0 20px 40px var(--shadow-strong);'],
  [/box-shadow: 0 1px 3px rgba\(0,0,0,0.05\);/g, 'box-shadow: 0 1px 3px var(--shadow-color);'],
  [/box-shadow: 0 4px 12px rgba\(0,0,0,0.08\);/g, 'box-shadow: 0 4px 12px var(--shadow-strong);'],
  [/box-shadow: 0 8px 20px rgba\(0,0,0,0.1\);/g, 'box-shadow: 0 8px 20px var(--shadow-strong);'],
  [/box-shadow: 0 1px 3px rgba\(0,0,0,0.1\);/g, 'box-shadow: 0 1px 3px var(--shadow-color);'],
  [/box-shadow: 0 1px 2px rgba\(0,0,0,0.02\);/g, 'box-shadow: inset 0 1px 2px var(--shadow-color);'],
  [/box-shadow: 0 4px 12px rgba\(0,0,0,0.05\);/g, 'box-shadow: 0 4px 12px var(--shadow-color);'],
  [/box-shadow: 0 4px 12px rgba\(0,0,0,0.02\);/g, 'box-shadow: 0 4px 12px var(--shadow-color);'],
  [/box-shadow: 0 1px 2px rgba\(0,0,0,0.03\);/g, 'box-shadow: 0 1px 2px var(--shadow-color);'],
  [/box-shadow: 4px 0 24px rgba\(0,0,0,0.1\);/g, 'box-shadow: 4px 0 24px var(--shadow-strong);'],
  [/box-shadow: 0 8px 32px rgba\(0,0,0,0.1\);/g, 'box-shadow: 0 8px 32px var(--shadow-strong);'],
  [/box-shadow: inset 0 1px 2px rgba\(0,0,0,0.02\);/g, 'box-shadow: inset 0 1px 2px var(--shadow-color);'],

  // Subtle Borders
  [/border: 1px solid rgba\(0,0,0,0.05\);/g, 'border: 1px solid var(--border-subtle);'],
  [/border: 1px solid rgba\(0,0,0,0.1\);/g, 'border: 1px solid var(--border-subtle);'],
  [/border-right: 1px solid rgba\(0,0,0,0.1\);/g, 'border-right: 1px solid var(--border-subtle);'],
  [/border-top: 1px solid rgba\(0,0,0,0.1\);/g, 'border-top: 1px solid var(--border-subtle);'],
  [/border-bottom: 1px solid rgba\(0,0,0,0.05\);/g, 'border-bottom: 1px solid var(--border-subtle);'],
  [/border: 3px solid rgba\(0,0,0,0.1\);/g, 'border: 3px solid var(--border-subtle);'],
  [/border-color: rgba\(0,0,0,0.1\);/g, 'border-color: var(--border-subtle);'],

  // Translucent / Glass Backgrounds
  [/background: rgba\(245, 245, 247, 0.75\);/g, 'background: var(--glass-sidebar);'],
  [/background: rgba\(255, 255, 255, 0.85\);/g, 'background: var(--glass-bg);'],
  [/background: rgba\(0,0,0,0.25\);/g, 'background: rgba(0,0,0,0.5); /* Modal Overlay is always dark */'],
  [/background: rgba\(255,255,255,0.95\);/g, 'background: var(--glass-bg);'],
  [/background: rgba\(255,255,255,0.9\);/g, 'background: var(--toast-bg);'],
  [/background: rgba\(255,255,255,0.9\);/g, 'background: var(--glass-sidebar);'], // For mobile sidebar

  // Highlight Subtle
  [/background: rgba\(0,0,0,0.05\);/g, 'background: var(--highlight-subtle);'],
  [/background: rgba\(0,0,0,0.02\);/g, 'background: var(--bg-hover);'],

  // Hardcoded Whites
  [/background: #ffffff;/g, 'background: var(--bg-secondary);'],
  [/background: #fff;/g, 'background: var(--bg-card);'],
  [/color: #fff;/g, 'color: #ffffff; /* keep pure white for accent text */'],

  // Specific elements
  [/background: #f9f9fb;/g, 'background: var(--table-header);'],
  [/background: #f0f0f4;/g, 'background: var(--btn-secondary-hover);'],
];

replacements.forEach(([regex, replacement]) => {
  css = css.replace(regex, replacement);
});

// Since btn-secondary needs variable, update it precisely:
css = css.replace(/\.btn-secondary \{\n  background: var\(--bg-secondary\);\n  color: var\(--text-primary\);\n  border: 1px solid var\(--border\);\n\}/, 
  `.btn-secondary {\n  background: var(--btn-secondary-bg);\n  color: var(--text-primary);\n  border: 1px solid var(--border);\n}`);

fs.writeFileSync('app/globals.css', css, 'utf8');
console.log('Fixed globals.css');
