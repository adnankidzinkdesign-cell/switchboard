// Purely decorative: the corner blobs, brand character illustrations, and
// dot-grid pattern behind the page content. Split out of App.jsx so the page
// layout isn't buried in a wall of absolutely-positioned divs.
//
// `showCharacters` defaults on for the launcher/login, whose content shape
// (a centered hero or a narrow card) was what the character positions were
// tuned around. The admin panel's wider, left-aligned table runs right into
// where the skater illustration sits at those same coordinates, so it opts
// out rather than the positions being fudged to accommodate every page.
export default function PageBackground({ showCharacters = true }) {
  return (
    <>
      <div className="pointer-events-none absolute -left-28 top-24 z-0 h-56 w-[420px] rounded-[54%_46%_54%_46%/56%_44%_56%_44%] bg-[#f2bfd9] opacity-70 sm:opacity-100" />
      <div className="pointer-events-none absolute -right-24 top-2.5 z-0 h-[400px] w-[400px] rounded-full bg-[#f5c738] opacity-70 sm:opacity-100" />
      <div className="pointer-events-none absolute -right-36 -bottom-[110px] z-0 h-64 w-[480px] rounded-[50%_50%_0_50%] bg-[#ef5a51] opacity-70 sm:opacity-100" />
      <div className="pointer-events-none absolute -left-36 -bottom-[100px] z-0 h-64 w-[520px] rounded-[48%_52%_0_50%] bg-[#51b4b8] opacity-70 sm:opacity-100" />

      {showCharacters && (
        <>
          <img
            src="/brand/characters/skater.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-36 z-0 hidden w-32 md:block lg:left-10 lg:top-40 lg:w-40"
          />
          <img
            src="/brand/characters/celebrate.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-4 bottom-2 z-0 hidden w-24 lg:right-8 lg:bottom-4 lg:block lg:w-32"
          />
          <img
            src="/brand/characters/spark.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[350px] top-16 z-0 hidden w-16 min-[900px]:block"
          />
        </>
      )}

      <div className="pointer-events-none absolute right-[200px] top-24 z-1 hidden w-[132px] grid-cols-4 gap-3.5 min-[900px]:grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-[#6f55b3]/28" />
        ))}
      </div>
    </>
  );
}
