const fs = require('fs');
const path = require('path');

const files = [
  'app/api/activities/[id]/route.ts',
  'app/api/suppliers/[id]/route.ts',
  'app/api/suppliers/[id]/stage/route.ts',
  'app/suppliers/[id]/page.tsx',
  'app/suppliers/[id]/edit/page.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace the type and add the await line
  // Case 1: page.tsx with { params }: { params: { id: string } }
  // Case 2: route.ts with { params }: { params: { id: string } }
  
  // Note: I'll use a simple regex to swap the type for Promise and inject the await.
  
  content = content.replace(
    /({ params }: { params: { id: string } })/g,
    '({ params }: { params: Promise<{ id: string }> })'
  );

  // Inject await params at the start of the function body
  // We'll look for the opening brace of the function and insert after it or after auth check.
  // Actually, let's just insert it as the first line of the function.
  
  content = content.split('\n').map(line => {
    if (line.includes('export async function') || line.includes('export default async function')) {
      return line;
    }
    return line;
  }).join('\n');

  // Let's be more precise with a multi-step replace.
  // Actually, I'll just rewrite the specific parts.

  // 1. Update the type
  content = content.replace(/: { id: string } }/g, ': Promise<{ id: string }> }');

  // 2. Inject the await line. We look for `{` after the signature.
  // This is tricky with regex. I'll do a simple find/replace on known patterns.

  const patterns = [
    { from: 'async function GET(req: NextRequest, { params }: Promise<{ id: string }> }) {', to: 'async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;' },
    { from: 'async function PUT(req: NextRequest, { params }: Promise<{ id: string }> }) {', to: 'async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;' },
    { from: 'async function DELETE(req: NextRequest, { params }: Promise<{ id: string }> }) {', to: 'async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;' },
    { from: 'async function PATCH(req: NextRequest, { params }: Promise<{ id: string }> }) {', to: 'async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;' },
    { from: 'async function SupplierPage({ params }: Promise<{ id: string }> }) {', to: 'async function SupplierPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;' },
    { from: 'async function EditSupplierPage({ params }: Promise<{ id: string }> }) {', to: 'async function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;' }
  ];

  patterns.forEach(p => {
    content = content.replace(p.from, p.to);
  });

  // 3. Replace params.id with id
  content = content.replace(/params\.id/g, 'id');

  fs.writeFileSync(f, content, 'utf8');
  console.log('Fixed', f);
});
