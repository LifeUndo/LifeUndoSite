import GlassCard from './GlassCard';

export default function ServiceCard({
  icon,
  title,
  description,
  features,
  price,
  period,
  ctaText,
  ctaLink,
  customCTA,
  isPopular = false,
}: {
  icon?: string;
  title: string;
  description: string;
  features?: string[];
  price: string;
  period: string;
  ctaText: string;
  ctaLink: string;
  customCTA?: React.ReactNode;
  isPopular?: boolean;
}) {
  return (
    <GlassCard className={`h-full flex flex-col hover:scale-105 transition-transform duration-300 ${isPopular ? 'ring-2 ring-purple-500' : ''}`}>
      {icon && (
        <div className="text-4xl mb-4 text-center">{icon}</div>
      )}
      <h4 className="text-lg font-semibold gradient-text mb-2 text-center">{title}</h4>
      <p className="text-sm text-white/80 mb-4 text-center">{description}</p>

      {features && (
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="text-sm text-white/70 flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      )}

      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-white">{price}</div>
        <div className="text-sm text-white/60">{period}</div>
      </div>

      <div className="mt-auto">
        {customCTA || (
          <a
            href={ctaLink}
            className="block w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded text-center hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            {ctaText}
          </a>
        )}
      </div>
    </GlassCard>
  );
}
