export default function LegalLayout({ children }: { children: React.ReactNode }) {
  // Простой layout - наследует общий layout из [locale]
  return <div className="container mx-auto px-4">{children}</div>;
}
