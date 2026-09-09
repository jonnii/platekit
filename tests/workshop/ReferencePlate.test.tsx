import { describe, expect, it } from "bun:test";
import ReferencePlate from "../../workshop/src/components/ReferencePlate";
import { cleanedReferenceSource } from "../../tools/artwork/reference-assets";
import { PLATE_REFERENCES } from "../../tools/artwork/references";

const maine = PLATE_REFERENCES.find((ref) => ref.state === "ME")!;

describe("cleaned plate references", () => {
  it("displays the cleaned crop without changing the scoring reference", () => {
    const original = JSON.stringify(maine);
    const plate = ReferencePlate({ reference: maine, width: 340 });
    expect(plate.props.style.backgroundImage).toBe('url("/plate-references/cleaned/me.webp")');
    expect(plate.props.style.backgroundPosition).toBe("0px 0px");
    expect(plate.props.style.height).toBe(170);
    expect(plate.props["aria-label"]).toContain("sample registration removed");
    expect(JSON.stringify(maine)).toBe(original);
    expect(maine.src).toStartWith("https://");
  });

  it("falls back to the original when the source or crop changes", () => {
    for (const reference of [
      { ...maine, src: "https://example.com/new-maine.jpg" },
      { ...maine, image: { ...maine.image, w: 2400 } },
      { ...maine, plate: { ...maine.plate, x: maine.plate.x + 1 } },
      { ...maine, state: "UNKNOWN" },
    ]) {
      expect(cleanedReferenceSource(reference)).toBeUndefined();
      const plate = ReferencePlate({ reference, width: reference.plate.w });
      expect(plate.props.style.backgroundImage).toBe(`url("${reference.src}")`);
      expect(plate.props.style.backgroundPosition).toBe(`${-reference.plate.x}px ${-reference.plate.y}px`);
      expect(plate.props["aria-label"]).toContain("reference photo");
    }
  });

  it("uses the same coordinate scale for cleaned artwork close-ups", () => {
    const detail = { label: "Pinecone", x: 43, y: 250, w: 112, h: 175 };
    const plate = ReferencePlate({ reference: maine, width: 1500, detail });
    expect(plate.props.style.backgroundSize).toBe("1500px 750px");
    expect(plate.props.style.backgroundPosition).toBe("-64.5px -375px");
    expect(plate.props.style.width).toBe(168);
    expect(plate.props.style.height).toBe(262.5);
  });
});
