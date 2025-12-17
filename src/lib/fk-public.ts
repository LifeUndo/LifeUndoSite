// FreeKassa Public Configuration (Client-side)
// Безопасные переменные для клиентской части

export const fkPublic = {
  enabled: process.env.NEXT_PUBLIC_FK_ENABLED === "true",
  
  // Debug информация (только для разработки)
  debug: {
    env: process.env.VERCEL_ENV || process.env.NODE_ENV,
    isPreview: process.env.VERCEL_ENV === "preview",
    isDevelopment: process.env.NODE_ENV === "development"
  }
};

// Логирование для диагностики (только в Preview/Development)
if (typeof window !== 'undefined' && (fkPublic.debug.isPreview || fkPublic.debug.isDevelopment)) {
  console.log('[FK] enabled=', fkPublic.enabled);
  console.log('[FK] env=', fkPublic.debug.env);
}
