import DevelopersPage from '@/app/[locale]/developers/page';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <DevelopersPage params={{ locale: 'ru' }} />;
}
