/** Outlined registration runs, with the drawn extent each one occupies on the plate. */
export function registrationRuns(html: string) {
  return [...html.matchAll(/data-registration="([^"]*)"(?: data-face="[^"]*")? data-extent="([^"]+)"/g)].map(([, text, extent]) => {
    const [left, right] = extent!.split(" ").map(Number);
    return { text: text!.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">"), left: left!, right: right! };
  });
}
