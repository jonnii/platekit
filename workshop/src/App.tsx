import Gallery from "./Gallery";
import ComparePage from "./ComparePage";
import ContactSheetPage from "./ContactSheetPage";
import FontProbePage from "./FontProbePage";

export default function App() {
  const url = new URL(window.location.href);
  const route = ({ "/dev/plate-compare": "/compare", "/dev/plate-compare/all-states": "/contact-sheet", "/dev/plate-compare/font-probe": "/font-probe" } as Record<string, string>)[url.pathname] ?? url.pathname;
  const state = url.searchParams.get("state") ?? undefined;
  const plate = url.searchParams.get("plate")?.slice(0, 20);
  return <>
    <nav className="flex flex-wrap gap-5 bg-white px-8 py-4 text-sm" aria-label="Workshop">
      <span className="font-semibold">Platekit / workshop</span>
      <a href="/">Gallery</a>
      <a href="/compare">Compare plates</a>
      <a href="/contact-sheet">Contact sheet</a>
      <a href="/font-probe">Font probe</a>
    </nav>
    <p className="px-8 pt-3 text-xs text-zinc-500">Preview lettering uses Platekit’s bundled fonts. Import <code>platekit/fonts.css</code> in your app to reproduce it.</p>
    {route === "/" ? <Gallery initialPlate={plate} />
      : route === "/compare" ? <ComparePage state={state} plate={plate} />
      : route === "/contact-sheet" ? <ContactSheetPage />
      : route === "/font-probe" ? <FontProbePage />
      : <main className="p-8"><h1>Page not found</h1><a href="/">Return to gallery</a></main>}
  </>;
}
