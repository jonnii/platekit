import { describe, expect, it } from "bun:test";
import { renderToString } from "react-dom/server";
import LicensePlate from "../../src/LicensePlate.js";

// Helper function to extract formatting results from rendered components
function getPlateFormatting(plate: string, state: string) {
  const html = renderToString(<LicensePlate plate={plate} state={state} />);
  return html;
}

describe("License Plate Formatting Functions", () => {
  describe("California Plate (formatCaPlate)", () => {
    it("should identify canonical California plates and render split format", () => {
      const canonicalPlates = [
        "1ABC123",
        "2XYZ789", 
        "9DEF456",
        "5GHI012"
      ];
      
      canonicalPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "CA");
        
        // Canonical plates should have split rendering (separate text elements)
        expect(html).toMatch(/id="registration-/);
        expect(html).toContain(plate.charAt(0)); // First digit
        expect(html).toContain(plate.slice(1, 4)); // Middle letters
        expect(html).toContain(plate.slice(4)); // Last digits
      });
    });

    it("should identify non-canonical California plates and render centered format", () => {
      const nonCanonicalPlates = [
        "ABC123",     // Missing leading digit
        "12ABC123",   // Too many digits
        "1AB123",     // Too few letters
        "1ABCD123",   // Too many letters
        "1ABC12",     // Too few trailing digits
        "1ABC1234",   // Too many trailing digits
        "A1BC123",    // Letter in wrong position
        "INVALID",    // Completely invalid
        "1234567"     // All digits
      ];
      
      nonCanonicalPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "CA");
        
        // Non-canonical plates should render as single centered text
        const cleaned = plate.toUpperCase().replace(/[\s\-\u2013\u2014]/g, "");
        expect(html).toContain(cleaned);
        // Should not have the split registration structure
        expect(html).not.toMatch(/id="registration-/);
      });
    });
  });

  describe("Florida Plate (formatFlPlate)", () => {
    it("should identify canonical Florida plates and render split format", () => {
      const canonicalPlates = [
        "ABC123",
        "XYZ789",
        "DEF456", 
        "GHI012",
        "123ABC",
        "456XYZ"
      ];
      
      canonicalPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "FL");
        
        // Canonical plates should have split rendering
        expect(html).toMatch(/id="registration-/);
        expect(html).toContain(plate.slice(0, 3)); // First 3 characters
        expect(html).toContain(plate.slice(3)); // Last 3 characters
      });
    });

    it("should identify non-canonical Florida plates and render centered format", () => {
      const nonCanonicalPlates = [
        "ABC12",      // Too short
        "ABC1234",    // Too long
        "INVALID",    // Completely invalid
        "12345",      // Too short
        "ABCDEFG"     // Too long
      ];
      
      nonCanonicalPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "FL");
        
        // Non-canonical plates should render as single centered text
        const cleaned = plate.toUpperCase().replace(/[\s\-\u2013\u2014]/g, "");
        expect(html).toContain(cleaned);
        // Should not have the split registration structure
        expect(html).not.toMatch(/id="registration-/);
      });
    });
  });

  describe("New York Plate (formatNyPlate)", () => {
    it("should identify canonical New York plates and render split format", () => {
      const canonicalPlates = [
        "ABC1234",
        "XYZ9876",
        "DEF5432",
        "GHI1098"
      ];

      canonicalPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "NY");

        // Canonical plates should have split rendering with NY state symbol
        expect(html).toMatch(/id="registration-/);
        expect(html).toMatch(/href="#nyState-/); // State symbol indicates canonical split format
        const letters = plate.replace(/[^A-Z]/g, "").slice(0, 3);
        const digits = plate.replace(/[^0-9]/g, "").slice(-4);
        expect(html).toContain(letters);
        expect(html).toContain(digits);
      });
    });

    it("should identify non-canonical New York plates and render centered format", () => {
      const nonCanonicalPlates = [
        "AB1234",     // Too few letters (only 2 letters)
        "ABC123",     // Too few digits (only 3 digits)
        "INVALID",    // Completely invalid
        "1234567"     // All digits (no letters)
      ];

      nonCanonicalPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "NY");

        // Non-canonical plates should render as single centered text (no state symbol)
        const cleaned = plate.toUpperCase().replace(/[\s\-\u2013\u2014]/g, "");
        expect(html).toMatch(/id="registration-/);
        expect(html).toContain(cleaned);
        // Should not have the state symbol (only canonical plates have it)
        expect(html).not.toMatch(/href="#nyState-/);
      });
    });
  });

  describe("Texas Plate (formatTxPlate)", () => {
    it("should identify canonical Texas plates and render split format", () => {
      const canonicalPlates = [
        "ABC1234",
        "XYZ9876", 
        "DEF5432",
        "GHI1098"
      ];
      
      canonicalPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "TX");
        
        // Canonical plates should have split rendering
        expect(html).toMatch(/id="registration-/);
        expect(html).toContain(plate.slice(0, 3)); // First 3 letters
        expect(html).toContain(plate.slice(3)); // Last 4 digits
      });
    });

    it("keeps the Texas separator and supplied characters for custom and blank registrations", () => {
      for (const plate of ["", "A", "AB1234", "ABCD1234", "ABC123", "ABC12345", "INVALID", "1234567", "TX*99X", "custom–12345"]) {
        const html = getPlateFormatting(plate, "TX");
        const registration = html.match(/<g id="registration-[^>]*>([\s\S]*?)<\/g>/)![1];
        const groups = [...registration.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)];
        expect(groups.map((match) => match[1]).join("")).toBe(plate.toUpperCase().replace(/[\s\-–—]/g, ""));
        expect(registration).toMatch(/href="#txState-/);
      }
    });

  });

  describe("New Jersey Plate (formatNjPlate)", () => {
    it("should identify canonical New Jersey plates and render split format", () => {
      const canonicalPlates = [
        "ABC123",
        "XYZ789",
        "DEF456",
        "GHI012",
        "123ABC",
        "456XYZ"
      ];
      
      canonicalPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "NJ");
        
        // Canonical plates should have split rendering
        expect(html).toMatch(/<use href="#[^"]+-njState"/);
        expect(html).toContain(plate.slice(0, 3)); // First 3 characters
        expect(html).toContain(plate.slice(3, 5)); // Middle 2 characters
        expect(html).toContain(plate.slice(5)); // Last character
      });
    });

    it("should identify non-canonical New Jersey plates and render centered format", () => {
      const nonCanonicalPlates = [
        "ABC12",      // Too short
        "ABC1234",    // Too long
        "INVALID",    // Completely invalid
        "12345",      // Too short
        "ABCDEFG"     // Too long
      ];
      
      nonCanonicalPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "NJ");
        
        // Non-canonical plates should render as single centered text
        const cleaned = plate.toUpperCase().replace(/[\s\-\u2013\u2014]/g, "");
        expect(html).toContain(cleaned);
        // Custom registrations stay centered and do not render the separator.
        expect(html).toMatch(/<text[^>]*x="500"[^>]*>[^<]*<\/text>/);
        expect(html).not.toMatch(/<use href="#[^"]+-njState"/);
      });
    });
  });

  describe("Anonymized Plate Rendering", () => {
    it("should render anonymized California plates in canonical format", () => {
      const anonymizedPlates = [
        "1***123",    // Anonymized: 1ABCD123 -> 1***123
        "2***789",    // Anonymized: 2XYZ789 -> 2***789
        "9***456"     // Anonymized: 9DEF456 -> 9***456
      ];
      
      anonymizedPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "CA");
        
        // Anonymized plates should render in canonical split format
        expect(html).toMatch(/id="registration-/);
        expect(html).toContain(plate.charAt(0)); // First digit
        expect(html).toContain(plate.slice(1, 4)); // Middle letters (asterisks)
        expect(html).toContain(plate.slice(4)); // Last digits
      });
    });

    it("should render anonymized Florida plates in canonical format", () => {
      const anonymizedPlates = [
        "AB**23",     // Anonymized: ABC123 -> AB**23
        "XY**89",     // Anonymized: XYZ789 -> XY**89
        "DE**56"      // Anonymized: DEF456 -> DE**56
      ];
      
      anonymizedPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "FL");
        
        // Anonymized plates should render in canonical split format
        expect(html).toMatch(/id="registration-/);
        expect(html).toContain(plate.slice(0, 3)); // First 3 characters
        expect(html).toContain(plate.slice(3)); // Last 3 characters
      });
    });

    it("should render anonymized New York plates in canonical format", () => {
      const anonymizedPlates = [
        "AB***34",    // Anonymized: ABC1234 -> AB***34 (3 letters + 4 digits with asterisks)
        "XY***76",    // Anonymized: XYZ9876 -> XY***76
        "DE***32"     // Anonymized: DEF5432 -> DE***32
      ];

      anonymizedPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "NY");

        // Anonymized plates should render in canonical split format with state symbol
        expect(html).toMatch(/id="registration-/);
        expect(html).toMatch(/href="#nyState-/); // State symbol indicates canonical split format
        const letters = plate.replace(/[^A-Z*]/g, "").slice(0, 3);
        const digits = plate.replace(/[^0-9*]/g, "").slice(-4);
        expect(html).toContain(letters);
        expect(html).toContain(digits);
      });
    });

    it("should render anonymized Texas plates in canonical format", () => {
      const anonymizedPlates = [
        "AB***34",    // Anonymized: ABC1234 -> AB***34
        "XY***76",    // Anonymized: XYZ9876 -> XY***76
        "DE***32"     // Anonymized: DEF5432 -> DE***32
      ];
      
      anonymizedPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "TX");
        
        // Anonymized plates should render in canonical split format
        expect(html).toMatch(/id="registration-/);
        expect(html).toContain(plate.slice(0, 3)); // First 3 letters
        expect(html).toContain(plate.slice(3)); // Last 4 digits
      });
    });

    it("should render anonymized New Jersey plates in canonical format", () => {
      const anonymizedPlates = [
        "AB**23",     // Anonymized: ABC123 -> AB**23
        "XY**89",     // Anonymized: XYZ789 -> XY**89
        "DE**56"      // Anonymized: DEF456 -> DE**56
      ];
      
      anonymizedPlates.forEach(plate => {
        const html = getPlateFormatting(plate, "NJ");
        
        // Anonymized plates should render in canonical split format
        expect(html).toMatch(/<use href="#[^"]+-njState"/);
        expect(html).toContain(plate.slice(0, 3)); // First 3 characters
        expect(html).toContain(plate.slice(3, 5)); // Middle 2 characters
        expect(html).toContain(plate.slice(5)); // Last character
      });
    });

    it("should treat asterisks as digits in New York plate formatting", () => {
      // Test that asterisks are treated as digits for canonical detection
      // NY canonical format: 3 letters + 4 digits, so AB***34 (AB* + **34) is canonical
      const html = getPlateFormatting("AB***34", "NY");

      // Should render in canonical format (split with state symbol)
      expect(html).toMatch(/id="registration-/);
      expect(html).toMatch(/href="#nyState-/);
      expect(html).toContain("AB*");
      expect(html).toContain("**34");
    });

    it("should treat asterisks as digits in Texas plate formatting", () => {
      // Test that asterisks are treated as digits for canonical detection
      const html = getPlateFormatting("AB***34", "TX");
      
      // Should render in canonical format (split with state symbol)
      expect(html).toMatch(/id="registration-/);
      expect(html).toMatch(/href="#txState-/);
      expect(html).toContain("AB*");
      expect(html).toContain("**34");
    });
  });

  describe("Edge Cases and Input Sanitization", () => {
    it("should handle whitespace and separators in all plate types", () => {
      const platesWithSeparators = [
        { plate: "1 ABC-123", state: "CA", parts: ["1", "ABC", "123"] },
        { plate: "ABC 123", state: "FL", parts: ["ABC", "123"] },
        { plate: "ABC–1234", state: "NY", parts: ["ABC", "1234"] },
        { plate: "ABC—1234", state: "TX", parts: ["ABC", "1234"] },
        { plate: "ABC 123", state: "NJ", parts: ["ABC", "123"] }
      ];
      
      platesWithSeparators.forEach(({ plate, state, parts }) => {
        const html = getPlateFormatting(plate, state);
        // Each part of the cleaned text should appear in the HTML
        parts.forEach(part => {
          expect(html).toContain(part);
        });
      });
    });

    it("should handle mixed case input", () => {
      const mixedCasePlates = [
        { plate: "1abc123", state: "CA", parts: ["1", "ABC", "123"] },
        { plate: "abc123", state: "FL", parts: ["ABC", "123"] },
        { plate: "abc1234", state: "NY", parts: ["ABC", "1234"] },
        { plate: "abc1234", state: "TX", parts: ["ABC", "1234"] },
        { plate: "abc123", state: "NJ", parts: ["ABC", "123"] }
      ];
      
      mixedCasePlates.forEach(({ plate, state, parts }) => {
        const html = getPlateFormatting(plate, state);
        // Each part of the cleaned text should appear in the HTML
        parts.forEach(part => {
          expect(html).toContain(part);
        });
      });
    });

    it("should handle empty and invalid input gracefully", () => {
      const invalidInputs = [
        { plate: "", state: "CA" },
        { plate: "   ", state: "FL" },
        { plate: "---", state: "NY" },
        { plate: "123", state: "TX" },
        { plate: "ABC", state: "NJ" }
      ];
      
      invalidInputs.forEach(({ plate, state }) => {
        const html = getPlateFormatting(plate, state);
        // Should render something without crashing
        expect(html).toBeTruthy();
        expect(html).toContain("svg");
      });
    });
  });
});
