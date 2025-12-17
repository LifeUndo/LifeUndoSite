export default function GlassCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl p-6 border border-white/8 bg-white/5 backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}

