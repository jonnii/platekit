import { useState } from "react";

export default function CodeBlock({ children, label = "tsx" }: { children: string; label?: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(children); setStatus("Copied"); }
    catch { setStatus("Select the code to copy"); }
  }
  return <div className="code-block">
    <div className="code-toolbar"><span>{label}</span><button type="button" onClick={copy}>Copy</button></div>
    <pre><code>{children}</code></pre>
    <span className="copy-status" aria-live="polite">{status}</span>
  </div>;
}
