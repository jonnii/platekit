import { useState } from "react";
import { LicensePlate, PLATES, PLATE_STATES, type PlateState } from "../../src";
import CodeBlock from "./CodeBlock";

const states = [...PLATE_STATES].sort((a, b) => PLATES[a].name.localeCompare(PLATES[b].name));
const links = [["get-started", "Get started"], ["playground", "Playground"], ["usage", "Usage"], ["props", "Props"], ["fonts", "Fonts"], ["states", "All plates"]] as const;
const variables = [
  ["--font-plate-ny", "Registration", "sans-serif"],
  ["--font-plate-script", "Script headings", "cursive"],
  ["--font-plate-place", "State headings", "Georgia, serif"],
  ["--font-plate-motto", "Mottos", "Georgia, serif"],
  ["--font-geist-sans", "Sans-serif lettering", "Arial, sans-serif"],
];

export default function App() {
  const [state, setState] = useState<PlateState>("NY");
  const [plate, setPlate] = useState("HELLO123");
  const [search, setSearch] = useState("");
  const shown = states.filter((code) => `${code} ${PLATES[code].name}`.toLowerCase().includes(search.toLowerCase().trim()));
  const example = `<LicensePlate\n  state=${JSON.stringify(state)}\n  plate=${JSON.stringify(plate)}\n  style={{ width: 400 }}\n/>`;
  return <>
    <header className="site-header">
      <a className="brand" href="#" aria-label="Platekit home"><span className="brand-mark">PK</span>platekit<span className="brand-tag">/ react</span></a>
      <nav aria-label="Main"><a href="#get-started">Documentation</a><a href="#states">51 plates</a><a href="https://github.com/jonnii/platekit">GitHub <span aria-hidden="true">↗</span></a></nav>
    </header>

    <div className="docs-layout">
      <aside className="sidebar">
        <p className="eyebrow">Documentation</p>
        <nav aria-label="Documentation">{links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
        <div className="sidebar-note"><span className="status-dot" />React 19<span>ESM · TypeScript · SVG</span></div>
      </aside>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">React component library</p>
          <h1 id="hero-title">License plate components for React</h1>
          <p className="hero-description">SVG components for all 50 US states and Washington, DC. Each component accepts registration text and scales to its container.</p>
          <div className="hero-actions"><a href="#get-started">Installation</a><a href="#props">API reference</a></div>
          <div className="hero-plates" aria-label="Example license plates">
            <figure><LicensePlate state="CA" plate="1ABC234" /><figcaption>California</figcaption></figure>
            <figure><LicensePlate state="NY" plate="ABC1234" /><figcaption>New York</figcaption></figure>
            <figure><LicensePlate state="CO" plate="ABC123" /><figcaption>Colorado</figcaption></figure>
          </div>
          <div className="feature-strip"><span>React 19</span><span>TypeScript declarations</span><span>51 designs</span></div>
        </section>

        <section id="get-started" className="doc-section">
          <p className="eyebrow">01 / Get started</p><h2>Installation</h2>
          <p>Platekit is a React 19 component library. No CSS import, framework, or image request is required to render a plate.</p>
          <div className="notice"><strong>Preview release.</strong> The npm package is not published yet. To try it now, build a package from the repository:</div>
          <CodeBlock label="terminal">{`git clone https://github.com/jonnii/platekit.git\ncd platekit\nbun install --frozen-lockfile\nbun run build\nnpm pack\n\n# In your React app:\nnpm install /path/to/platekit/platekit-0.1.0.tgz`}</CodeBlock>
          <p className="small">Building from source uses Bun 1.3.14. Your app only needs React 19.</p>
          <CodeBlock>{`import { LicensePlate } from "platekit";\n\nexport function Example() {\n  return (\n    <LicensePlate\n      state="NY"\n      plate="ABC1234"\n      style={{ width: 400 }}\n    />\n  );\n}`}</CodeBlock>
        </section>

        <section id="playground" className="doc-section">
          <p className="eyebrow">02 / Playground</p><h2>Interactive example</h2>
          <p>Choose a state and type a registration. The code sample updates with your selection.</p>
          <div className="playground">
            <div className="playground-controls">
              <label>State<select value={state} onChange={(event) => setState(event.target.value as PlateState)}>{states.map((code) => <option key={code} value={code}>{PLATES[code].name}</option>)}</select></label>
              <label>Registration<input value={plate} onChange={(event) => setPlate(event.target.value)} maxLength={20} spellCheck={false} /></label>
            </div>
            <div className="playground-preview"><LicensePlate state={state} plate={plate} /></div>
            <CodeBlock>{example}</CodeBlock>
          </div>
          <p className="small">These examples use the package’s default font fallbacks. See <a href="#fonts">Fonts</a> to customize the lettering.</p>
        </section>

        <section id="usage" className="doc-section">
          <p className="eyebrow">03 / Usage</p><h2>Usage</h2>
          <h3>Choose a state at runtime</h3>
          <p><code>LicensePlate</code> accepts a state code or full name, ignoring case and surrounding whitespace. Unknown states render a generic plate. The dispatcher imports all 51 designs.</p>
          <CodeBlock>{`<LicensePlate state="California" plate="1ABC234" />\n<LicensePlate state="ny" plate="ABC1234" />`}</CodeBlock>
          <h3>Import just the plate you need</h3>
          <p>Individual imports avoid the full registry. A state component already knows its state, so only the registration is required.</p>
          <CodeBlock>{`import NewYorkPlate from "platekit/plates/NewYorkPlate";\n\n<NewYorkPlate plate="ABC1234" />`}</CodeBlock>
          <h3>Fit it into your layout</h3>
          <p>Plates fill their container width and retain their aspect ratio. Standard div props—including styles, accessible labels, event handlers, and refs—apply to the wrapping div.</p>
          <CodeBlock>{`<LicensePlate\n  state="GA"\n  plate="PEACH123"\n  className="profile-plate"\n  style={{ width: "100%", maxWidth: 460 }}\n  aria-label="Your Georgia license plate"\n/>`}</CodeBlock>
        </section>

        <section id="props" className="doc-section">
          <p className="eyebrow">04 / API reference</p><h2>Props and exports</h2>
          <div className="table-scroll"><table><thead><tr><th>Prop</th><th>Type</th><th>Behavior</th></tr></thead><tbody>
            <tr><th><code>plate</code></th><td><code>string</code></td><td>Required. Registration text; formatting varies by state.</td></tr>
            <tr><th><code>state</code></th><td><code>string</code></td><td>Required for the dispatcher. Optional label override for an individual plate.</td></tr>
            <tr><th><code>className</code></th><td><code>string</code></td><td>Class applied to the wrapping div.</td></tr>
            <tr><th><code>style</code></th><td><code>CSSProperties</code></td><td>Wrapper styles, merged with layout defaults.</td></tr>
            <tr><th><code>ref</code></th><td><code>Ref&lt;HTMLDivElement&gt;</code></td><td>Access the wrapping div.</td></tr>
            <tr><th>Other div props</th><td>HTML attributes</td><td>Forwarded to the wrapper. Children are reserved for artwork.</td></tr>
          </tbody></table></div>
          <p>Types <code>LicensePlateProps</code>, <code>PlateProps</code>, and <code>PlateState</code> are exported from the package root. <code>PLATES</code> maps codes to names and components; <code>PLATE_STATES</code> lists the supported codes.</p>
          <p>Components support server rendering and include client boundaries for React hooks in Next.js applications.</p>
        </section>

        <section id="fonts" className="doc-section">
          <p className="eyebrow">05 / Typography</p><h2>Fonts</h2>
          <p>Platekit combines vector artwork and SVG text. Fonts are supplied by your app, so there are no bundled font files or automatic font downloads. The defaults depend on your platform.</p>
          <div className="table-scroll"><table><thead><tr><th>CSS variable</th><th>Used for</th><th>Fallback</th></tr></thead><tbody>{variables.map(([variable, use, fallback]) => <tr key={variable}><th><code>{variable}</code></th><td>{use}</td><td>{fallback}</td></tr>)}</tbody></table></div>
          <p>Load your chosen font with your app’s normal font setup, then set the variables on a parent element:</p>
          <CodeBlock label="css">{`.profile-plate {\n  --font-plate-ny: "Your Registration Font", sans-serif;\n  --font-plate-script: "Your Script Font", cursive;\n  --font-plate-place: Georgia, serif;\n}`}</CodeBlock>
        </section>

        <section id="states" className="doc-section">
          <div className="section-heading"><div><p className="eyebrow">06 / States</p><h2>Supported states</h2></div><span className="count">{shown.length} / 51</span></div>
          <label className="search-label">Search plates<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="State name or code…" /></label>
          <div className="state-grid">{shown.map((code) => <article key={code}>
            <div className="state-preview"><LicensePlate state={code} plate="ABC1234" /></div>
            <h3>{PLATES[code].name}<span>{code}</span></h3>
          </article>)}</div>
          {!shown.length && <p role="status">No states match “{search}”. Try a state name or two-letter code.</p>}
        </section>

        <footer className="site-footer"><span className="brand">platekit</span><p>React components · ESM · TypeScript</p><a href="https://github.com/jonnii/platekit/blob/main/LICENSE">MIT license ↗</a></footer>
      </main>
    </div>
  </>;
}
