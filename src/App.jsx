import { apps } from './apps';
import AppCard from './AppCard';

export default function App() {
  return (
    <div className="page">
      <div className="blob blob--pink" aria-hidden="true" />
      <div className="blob blob--yellow" aria-hidden="true" />
      <div className="blob blob--red" aria-hidden="true" />
      <div className="blob blob--teal" aria-hidden="true" />
      <div className="dot-grid" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <header className="brand-bar">
        <img
          src="/brand/kidzink-logo-red.svg"
          alt="Kidzink"
          className="brand-bar__logo"
        />
      </header>

      <main className="hero">
        <h1>Switchboard</h1>
        <p>Your starting point for Kidzink&rsquo;s digital tools.</p>

        <section className="app-grid" aria-label="Kidzink applications">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </section>
      </main>
    </div>
  );
}
