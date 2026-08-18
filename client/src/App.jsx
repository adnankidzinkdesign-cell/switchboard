import { apps } from './apps';
import AppCard from './AppCard';
import PageBackground from './PageBackground';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden px-[18px] pt-5 pb-10 sm:px-8 sm:pt-7 sm:pb-14 lg:pb-28">
      <PageBackground />

      <header className="relative z-2 mb-6">
        <img
          src="/brand/kidzink-logo-red.svg"
          alt="Kidzink"
          className="h-[38px] w-auto"
        />
      </header>

      <main className="relative z-2 mx-auto max-w-[1240px]">
        <h1 className="text-center text-[clamp(2.75rem,6vw,5.5rem)] leading-none font-extrabold tracking-[-0.04em] text-ink-strong">
          Switchboard
        </h1>
        <p className="mx-auto mt-3.5 mb-10 text-center text-[clamp(1.05rem,1.6vw,1.375rem)] font-medium text-ink-strong/68">
          Your starting point for Kidzink&rsquo;s digital tools.
        </p>

        <section
          className="grid grid-cols-1 gap-6 min-[561px]:grid-cols-2 min-[1081px]:grid-cols-4"
          aria-label="Kidzink applications"
        >
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </section>
      </main>
    </div>
  );
}
