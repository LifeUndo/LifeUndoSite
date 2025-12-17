import { SOCIALS } from '@/config/socials';
import { SocialIcon } from '@/components/icons/SocialIcon';

export function SocialBar({ place = 'footer' }: { place?: 'header'|'footer'|'hero' }) {
  return (
    <div className="flex items-center gap-3">
      {Object.values(SOCIALS).map(s => {
        // РџСЂРѕРїСѓСЃРєР°РµРј РїСѓСЃС‚С‹Рµ URL (РїР»РµР№СЃС…РѕР»РґРµСЂС‹)
        if (!s.url) return null;
        
        const href = s.url;
        return (
          <a key={s.label} href={href} aria-label={s.label}
             target="_blank" rel="noopener noreferrer me"
             className="text-slate-300/90 hover:text-white transition">
            <SocialIcon name={s.icon} className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}

