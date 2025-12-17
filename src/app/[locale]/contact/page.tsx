import { redirect } from 'next/navigation';

export default function ContactRedirect({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'ru';
  redirect(`/${locale}/support`);
}