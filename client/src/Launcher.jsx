import { apps } from './apps';
import AppCard from './AppCard';

export default function Launcher() {
  return (
    <>
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
    </>
  );
}
