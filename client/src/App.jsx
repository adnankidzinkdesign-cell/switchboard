import { apps } from './apps';
import AppCard from './AppCard';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden px-[18px] pt-5 pb-10 sm:px-8 sm:pt-7 sm:pb-14">
      <div className="pointer-events-none absolute -left-28 top-24 z-0 h-56 w-[420px] rounded-[54%_46%_54%_46%/56%_44%_56%_44%] bg-[#f2bfd9] opacity-70 sm:opacity-100" />
      <div className="pointer-events-none absolute -right-24 top-2.5 z-0 h-[400px] w-[400px] rounded-full bg-[#f5c738] opacity-70 sm:opacity-100" />
      <div className="pointer-events-none absolute -right-36 -bottom-[110px] z-0 h-64 w-[480px] rounded-[50%_50%_0_50%] bg-[#ef5a51] opacity-70 sm:opacity-100" />
      <div className="pointer-events-none absolute -left-36 -bottom-[100px] z-0 h-64 w-[520px] rounded-[48%_52%_0_50%] bg-[#51b4b8] opacity-70 sm:opacity-100" />

      <div className="pointer-events-none absolute right-[200px] top-24 z-1 hidden w-[132px] grid-cols-4 gap-3.5 min-[900px]:grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-[#6f55b3]/28" />
        ))}
      </div>

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
