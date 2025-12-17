// src/app/api-docs/page.tsx
'use client';

import { useEffect } from 'react';

export default function ApiDocsPage() {
  useEffect(() => {
    // Загружаем Swagger UI
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js';
    script.onload = () => {
      // @ts-ignore
      window.SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        presets: [
          // @ts-ignore
          window.SwaggerUIBundle.presets.apis,
          // @ts-ignore
          window.SwaggerUIBundle.presets.standalone
        ],
        layout: 'StandaloneLayout',
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        onComplete: () => {
          console.log('Swagger UI loaded');
        },
        onFailure: (error: any) => {
          console.error('Swagger UI failed to load:', error);
        }
      });
    };
    document.head.appendChild(script);

    // Загружаем CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css';
    document.head.appendChild(link);

    return () => {
      // Cleanup
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GetLifeUndo API Documentation
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Интерактивная документация API с возможностью тестирования
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/docs" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Простая документация
            </a>
            <a 
              href="/api/openapi.json" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              OpenAPI JSON
            </a>
          </div>
        </div>
        
        <div id="swagger-ui" className="swagger-ui"></div>
      </div>
    </div>
  );
}
