import { redirect } from 'next/navigation';

export default function ContactsRedirect({ params }: { params: { locale: string } }) {
  const locale = params?.locale || 'ru';
  redirect(`/${locale}/support`);
}