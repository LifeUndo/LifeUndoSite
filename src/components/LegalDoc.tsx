import fs from 'fs';
import path from 'path';
import { LEGAL } from '@/config/legal';

function applyPlaceholders(text: string): string {
  return Object.entries(LEGAL).reduce((acc, [k, v]) => 
    acc.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v)), text);
}

export default function LegalDoc({ lang, slug }: { lang: 'ru' | 'en'; slug: string }) {
  try {
    const filePath = path.join(process.cwd(), 'content', 'legal', lang, `${slug}.md`);
    const raw = fs.readFileSync(filePath, 'utf8');
    const processed = applyPlaceholders(raw);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="prose prose-invert max-w-none">
                {processed.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl md:text-4xl font-semibold text-white mb-8">{line.slice(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-semibold text-white mb-4 mt-8">{line.slice(3)}</h2>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={index} className="text-gray-300 mb-6 font-semibold">{line.slice(2, -2)}</p>;
                  }
                  if (line.startsWith('_') && line.endsWith('_')) {
                    return <p key={index} className="text-gray-400 text-sm mt-8 italic">{line.slice(1, -1)}</p>;
                  }
                  if (line.trim() === '') {
                    return <br key={index} />;
                  }
                  return <p key={index} className="text-gray-300 mb-4">{line}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <h1 className="text-3xl font-semibold text-white mb-4">Document not found</h1>
              <p className="text-gray-300">The requested legal document could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

