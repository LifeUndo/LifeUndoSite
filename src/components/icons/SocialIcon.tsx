type Props = { name: 'telegram'|'reddit'|'vcru'|'habr'|'x'|'youtube'|'github'; className?: string };
export const SocialIcon = ({ name, className }: Props) => {
  const cn = className ?? 'h-5 w-5';
  switch (name) {
    case 'telegram': return (<svg className={cn} viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M9.9 12.3l-.3 4.6c.4 0 .6-.2.8-.4l2-1.9 4.1 3c.8.4 1.4.2 1.6-.8l2.9-13.7c.3-1.3-.5-1.8-1.4-1.4L2.8 9.3c-1.2.5-1.2 1.2-.2 1.5l4.5 1.4 10.4-6.6c.5-.3.9-.1.6.2"/></svg>);
    case 'reddit':   return (<svg className={cn} viewBox="0 0 24 24"><path fill="currentColor" d="M14.5 15.4c-.8.8-2.2.8-3 0"/><path fill="currentColor" d="M12 2l2.7.6L14 6.2c2 .2 3.9.9 5.3 2 1-.7 2.3-.5 3 .5.6 1 .4 2.3-.6 3-.2.2-.5.3-.7.4.1.4.1.8.1 1.2 0 3.6-3.8 6.5-8.5 6.5S4 17 4 13.4c0-.4 0-.8.1-1.1-.3-.1-.6-.3-.8-.5-1-.7-1.2-2-.6-3 .6-1 2-1.2 3-.5 1.4-1.1 3.3-1.8 5.3-2l.7-3.6L12 2z"/></svg>);
    case 'vcru':     return (<svg className={cn} viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h4l3 7 3-7h4L12 21"/></svg>);
    case 'habr':     return (<svg className={cn} viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v4H4zM4 10h10v4H4zM4 16h16v4H4z"/></svg>);
    case 'x':        return (<svg className={cn} viewBox="0 0 24 24"><path fill="currentColor" d="M18 2l-6.1 7.9L6 2H2l8.2 10.3L2.5 22H6l6-7.8L18 22h3.5l-8-9.8L21.5 2z"/></svg>);
    case 'youtube':  return (<svg className={cn} viewBox="0 0 24 24"><path fill="currentColor" d="M23 7s-.2-1.5-.8-2.1c-.8-.8-1.6-.8-2-.9C17.4 3.6 12 3.6 12 3.6h0s-5.4 0-8.2.4c-.4 0-1.2.1-2 .9C1.2 5.5 1 7 1 7S.8 8.8.8 10.6v1.8C.8 14.2 1 16 1 16s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9C7.1 19.7 12 19.7 12 19.7s5.4 0 8.2-.4c.4-.1 1.2-.1 2-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.6v-1.8C23.2 8.8 23 7 23 7zM9.8 15.2V8.9l6 3.2-6 3.1z"/></svg>);
    case 'github':   return (<svg className={cn} viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.3.8-.6v-2.3c-3.2.7-3.9-1.5-3.9-1.5-.6-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 2.3.1 2.9-.5-.9-.1-1.8-.5-1.8-2.3 0-.5.2-.9.4-1.2-1.4-.2-2.9-.7-2.9-3.4 0-.8.3-1.5.8-2-.1-.2-.4-1 .1-2 0 0 1.2-.4 3.9 1.4a13.6 13.6 0 0 1 7.1 0c2.7-1.8 3.9-1.4 3.9-1.4.5 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.7-1.5 3.2-2.9 3.4.3.3.5.8.5 1.6v3.6c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>);
  }
  return null;
};

