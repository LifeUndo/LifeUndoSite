'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface VersionInfo {
  version: string;
  publishedAt: string;
  files: {
    firefox?: string;
    win?: string;
    mac?: string;
  };
}

interface ArchiveVersion {
  version: string;
  publishedAt: string;
  files: string[];
  changelog?: string;
}

export default function ArchivePage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'ru';
  const isRussian = locale === 'ru';
  
  const [versions, setVersions] = useState<ArchiveVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем список доступных версий
    // В реальном проекте это будет API или чтение файловой системы
    const mockVersions: ArchiveVersion[] = [
      {
        version: '0.3.7.12',
        publishedAt: '2025-10-04T10:00:00Z',
        files: ['lifeundo-0.3.7.12.xpi', 'undo-setup-0.3.7.12.exe', 'undo-0.3.7.12.dmg'],
        changelog: 'Новый платёжный поток, RU/EN локализация, мобильная оптимизация'
      },
      {
        version: '0.3.7.11',
        publishedAt: '2025-09-30T15:00:00Z',
        files: ['lifeundo-0.3.7.11.xpi'],
        changelog: 'Первая стабильная версия с базовой функциональностью'
      }
    ];
    
    setVersions(mockVersions);
    setLoading(false);
  }, []);

  const getFileIcon = (filename: string) => {
    if (filename.includes('.xpi')) return '🦊';
    if (filename.includes('.exe')) return '🪟';
    if (filename.includes('.dmg')) return '🍎';
    return '📦';
  };

  const getFileType = (filename: string) => {
    if (filename.includes('.xpi')) return isRussian ? 'Firefox' : 'Firefox';
    if (filename.includes('.exe')) return isRussian ? 'Windows' : 'Windows';
    if (filename.includes('.dmg')) return isRussian ? 'macOS' : 'macOS';
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isRussian ? 'Архив версий' : 'Version Archive'}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {isRussian 
              ? 'Скачайте предыдущие версии GetLifeUndo для совместимости или тестирования'
              : 'Download previous versions of GetLifeUndo for compatibility or testing'
            }
          </p>
          
          <Link 
            href={`/${locale}/downloads`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {isRussian ? '← Вернуться к загрузкам' : '← Back to Downloads'}
          </Link>
        </div>

        {/* Versions List */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-300">
              {isRussian ? 'Загрузка...' : 'Loading...'}
            </div>
          ) : (
            <div className="space-y-8">
              {versions.map((version) => (
                <div key={version.version} className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {isRussian ? 'Версия' : 'Version'} {version.version}
                      </h3>
                      <p className="text-gray-300 mb-2">
                        {isRussian ? 'Опубликовано:' : 'Published:'} {new Date(version.publishedAt).toLocaleDateString('ru-RU')}
                      </p>
                      {version.changelog && (
                        <p className="text-gray-400 text-sm">
                          {version.changelog}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        version.version === '0.3.7.12' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {version.version === '0.3.7.12' 
                          ? (isRussian ? 'Текущая' : 'Current')
                          : (isRussian ? 'Архивная' : 'Archived')
                        }
                      </span>
                    </div>
                  </div>

                  {/* Files */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {version.files.map((file) => (
                      <div key={file} className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">{getFileIcon(file)}</div>
                        <h4 className="font-semibold text-white mb-1">
                          {getFileType(file)}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {file}
                        </p>
                        <a
                          href={`https://cdn.getlifeundo.com/app/${version.version}/${file}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {isRussian ? 'Скачать' : 'Download'}
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Checksums */}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <details className="group">
                      <summary className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                        {isRussian ? '🔐 Проверить целостность файлов (SHA256)' : '🔐 Verify file integrity (SHA256)'}
                      </summary>
                      <div className="mt-3 p-4 bg-black/20 rounded-lg">
                        <p className="text-gray-400 text-sm mb-2">
                          {isRussian 
                            ? 'Скачайте checksums.txt для проверки целостности:'
                            : 'Download checksums.txt to verify file integrity:'
                          }
                        </p>
                        <a
                          href={`https://cdn.getlifeundo.com/app/${version.version}/checksums.txt`}
                          className="text-blue-400 hover:text-blue-300 underline text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          checksums.txt
                        </a>
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              {isRussian ? 'Важная информация' : 'Important Information'}
            </h3>
            <div className="text-gray-300 space-y-2 text-left max-w-2xl mx-auto">
              <p>
                {isRussian 
                  ? '• Рекомендуется использовать последнюю версию для получения всех обновлений безопасности'
                  : '• We recommend using the latest version for all security updates'
                }
              </p>
              <p>
                {isRussian 
                  ? '• Старые версии могут не поддерживать новые функции сайта'
                  : '• Older versions may not support new website features'
                }
              </p>
              <p>
                {isRussian 
                  ? '• Все файлы проверены на вирусы и безопасны для загрузки'
                  : '• All files are virus-checked and safe to download'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
