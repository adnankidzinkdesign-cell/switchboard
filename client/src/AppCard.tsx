import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { STATUS_LABEL, type AppEntry } from './apps';

// React's CSSProperties doesn't know about custom properties -- --icon-bg
// is read by the color-mix() Tailwind arbitrary-value classes below.
interface CardStyle extends CSSProperties {
  '--icon-bg': string;
}

export default function AppCard({ app }: { app: AppEntry }) {
  const { title, description, status, icon: Icon, bg, iconBg, href } = app;
  const isLive = status === 'in-development';
  const cta = isLive ? 'Open app' : 'Learn more';
  const cardStyle: CardStyle = { backgroundColor: bg, '--icon-bg': iconBg };

  return (
    <article
      className="relative flex min-h-[280px] flex-col overflow-hidden rounded-[28px] px-[22px] pt-[22px] pb-5 shadow-[0_10px_26px_rgba(24,24,27,0.07)]"
      style={cardStyle}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1.25}
        className="pointer-events-none absolute -right-[18px] -bottom-[18px] h-32 w-32 text-white/55"
      />

      <div
        className="relative z-1 mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-2xl shadow-[inset_0_-6px_10px_rgba(0,0,0,0.12)]"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={30} strokeWidth={2} className="text-white" aria-hidden="true" />
      </div>

      <div className="relative z-1 mb-2.5 flex items-start justify-between gap-2">
        <h2 className="text-[1.3rem] leading-tight font-bold tracking-[-0.03em] text-ink-strong">
          {title}
        </h2>
        <span className="mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-bold whitespace-nowrap text-[color-mix(in_srgb,var(--icon-bg)_82%,black)] bg-[color-mix(in_srgb,var(--icon-bg)_18%,white)]">
          {STATUS_LABEL[status]}
        </span>
      </div>

      <p className="relative z-1 grow text-[1rem] leading-snug font-semibold tracking-[-0.01em] text-[color-mix(in_srgb,var(--icon-bg)_60%,var(--color-ink-strong)_40%)]">
        {description}
      </p>

      <a
        className={`relative z-1 mt-[18px] inline-flex w-fit items-center gap-2 self-start rounded-full border-[1.5px] border-ink-strong/16 bg-white/55 px-[18px] py-2.5 text-[0.95rem] font-bold text-ink-strong no-underline transition hover:-translate-y-px hover:bg-white/85 hover:shadow-[0_8px_16px_rgba(24,24,27,0.1)] ${
          isLive ? '' : 'opacity-85'
        }`}
        href={href ?? '#'}
        aria-disabled={!href}
        onClick={(e) => {
          if (!href) e.preventDefault();
        }}
      >
        {cta}
        <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
      </a>
    </article>
  );
}
