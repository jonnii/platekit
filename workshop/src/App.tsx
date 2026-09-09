import Gallery from "./Gallery";
import ComparePage from "./ComparePage";
import ContactSheetPage from "./ContactSheetPage";
import FontProbePage from "./FontProbePage";

const probeFonts = ["Bodoni Moda:wght@700", "Libre Bodoni:wght@700", "Source Serif 4:wght@700", "PT Serif:wght@700", "Noto Serif:wght@700", "Bitter:wght@800", "Zilla Slab:wght@700", "Roboto Slab:wght@800", "Aleo:wght@800", "Crete Round", "Grand Hotel", "Kaushan Script", "Satisfy", "Courgette", "Damion"];

export default function App() {
  const url = new URL(window.location.href);
  const route = ({ "/dev/plate-compare": "/compare", "/dev/plate-compare/all-states": "/contact-sheet", "/dev/plate-compare/font-probe": "/font-probe" } as Record<string, string>)[url.pathname] ?? url.pathname;
  const fontUrl = `https://fonts.googleapis.com/css2?${probeFonts.map((font) => `family=${font.replaceAll(" ", "+")}`).join("&")}&display=swap`;
  const state = url.searchParams.get("state") ?? undefined;
  const plate = url.searchParams.get("plate")?.slice(0, 20);
  return <>
    {route.endsWith("/font-probe") && <link rel="stylesheet" href={fontUrl} />}
    <nav className="flex flex-wrap gap-5 bg-white px-8 py-4 text-sm" aria-label="Workshop">
      <span className="font-semibold">Platekit / workshop</span>
      <a href="/">Gallery</a>
      <a href="/compare">Compare plates</a>
      <a href="/contact-sheet">Contact sheet</a>
      <a href="/font-probe">Font probe</a>
    </nav>
    <p className="px-8 pt-3 text-xs text-zinc-500">Preview lettering uses a local serial font and Google Fonts. Configure your app’s fonts to reproduce it.</p>
    {route === "/" ? <Gallery initialPlate={plate} />
      : route === "/compare" ? <ComparePage state={state} plate={plate} />
      : route === "/contact-sheet" ? <ContactSheetPage />
      : route === "/font-probe" ? <FontProbePage />
      : <main className="p-8"><h1>Page not found</h1><a href="/">Return to gallery</a></main>}
  </>;
}
