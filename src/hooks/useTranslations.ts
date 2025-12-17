import { useParams } from 'next/navigation';
import ru from '@/i18n/ru';
import en from '@/i18n/en';

export function useTranslations() {
  const params = useParams();
  const locale = params?.locale as string || 'ru';
  
  const t = locale === 'en' ? en : ru;
  
  return { t, locale };
}
