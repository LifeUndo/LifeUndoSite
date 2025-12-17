export type SocialId = 'telegram' | 'reddit' | 'vcru' | 'habr' | 'x' | 'youtube' | 'github' | 'vk';
export type SocialLink = { id: SocialId; label: string; href: string; icon: SocialId; utm?: string; };

export const SOCIALS = {
  telegram: { label: 'Telegram', url: 'https://t.me/GetLifeUndoSupport', icon: 'telegram' },
  x:        { label: 'X',        url: 'https://x.com/GetLifeUndo',       icon: 'x' },
  reddit:   { label: 'Reddit',   url: 'https://www.reddit.com/r/GetLifeUndo', icon: 'reddit' },
  youtube:  { label: 'YouTube',  url: 'https://www.youtube.com/@GetLifeUndo', icon: 'youtube' },
  github:   { label: 'GitHub',   url: 'https://github.com/GetLifeUndo',  icon: 'github' },
  vc:       { label: 'VC.ru',    url: 'https://vc.ru/id5309084',         icon: 'vcru' },
  habr:     { label: 'Хабр',     url: 'https://habr.com/ru/users/GetLifeUndo25/', icon: 'habr' },
  vk:       { label: 'VK',       url: 'https://vk.ru/GetLifeUndo',       icon: 'vk' },
} as const;
