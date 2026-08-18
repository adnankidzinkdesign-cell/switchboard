import { ArrowRight } from 'lucide-react';
import { STATUS_LABEL } from './apps';

export default function AppCard({ app }) {
  const { title, description, status, icon: Icon, bg, iconBg, href } = app;
  const isLive = status === 'in-development';
  const cta = isLive ? 'Open app' : 'Learn more';

  return (
    <article
      className="app-card"
      style={{ '--card-bg': bg, '--icon-bg': iconBg }}
    >
      <Icon className="app-card__watermark" aria-hidden="true" strokeWidth={1.25} />

      <div className="app-card__icon">
        <Icon size={30} strokeWidth={2} color="#ffffff" aria-hidden="true" />
      </div>

      <div className="app-card__header">
        <h2>{title}</h2>
        <span className="app-card__pill">{STATUS_LABEL[status]}</span>
      </div>

      <p className="app-card__description">{description}</p>

      <a
        className={`app-card__cta ${isLive ? '' : 'app-card__cta--muted'}`}
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
