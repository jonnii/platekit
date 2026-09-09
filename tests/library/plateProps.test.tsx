import { expect, it } from "bun:test";
import { renderToString } from "react-dom/server";
import { LicensePlate, PLATES, PLATE_STATES } from "../../src/index.js";

it("individual plates supply their own state and forward wrapper props", () => {
  for (const state of PLATE_STATES) {
    const { component: Plate, name } = PLATES[state];
    const html = renderToString(<Plate plate="ABC1234" id="preview" className="example"
      style={{ width: 340, display: "block" }} tabIndex={0} aria-describedby="caption" />);
    expect(html).toContain(`aria-label="License plate ABC1234 from ${name}"`);
    expect(html).not.toContain("undefined");
    expect(html).toContain('id="preview"');
    expect(html).toContain('class="example"');
    expect(html).toContain("width:340px");
    expect(html).toContain("display:block");
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('aria-describedby="caption"');
  }
});

it("forwards custom accessible labels and DOM props through dispatch and fallback", () => {
  for (const state of ["New York", "AZ", "unknown"]) {
    const html = renderToString(<LicensePlate plate="ABC1234" state={state}
      aria-label="Selected plate" data-testid="selection" style={{ width: 240 }} />);
    expect(html).toContain('aria-label="Selected plate"');
    expect(html).toContain('data-testid="selection"');
    expect(html).toContain("width:240px");
  }
});
