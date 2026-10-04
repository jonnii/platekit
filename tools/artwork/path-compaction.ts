/** Build-time encodings only: these helpers never round coordinates or simplify curves. */
const command = /^[MmLlHhVvCcSsQqTtAaZz]$/;
const number = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;

function tokensFor(path: string): string[] | undefined {
  const tokens = path.match(/[MmLlHhVvCcSsQqTtAaZz]|[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g) ?? [];
  // Refuse unfamiliar syntax rather than silently dropping it.
  return tokens.join("") === path.replace(/[\s,]/g, "") ? tokens : undefined;
}

/** Strip separators and decimal suffixes without changing any command or numeric value. */
export function compactPathSyntax(path: string): string {
  const tokens = tokensFor(path);
  if (!tokens) return path;
  let previousWasNumber = false;
  return tokens.map(token => {
    if (command.test(token)) {
      previousWasNumber = false;
      return token;
    }
    // Work on decimal text, avoiding precision loss through Number conversion.
    const value = /[eE]/.test(token) ? token : token.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
    const separator = previousWasNumber && !/^[+-]/.test(value) ? " " : "";
    previousWasNumber = true;
    return separator + value;
  }).join("");
}

/** Encode fontkit's explicit absolute integer M/L/Q/C/Z paths as exact relative commands.
 * Other path formats are left intact. All endpoint/control-point arithmetic must be safe integers.
 */
export function compactIntegerPath(path: string): string {
  const tokens = tokensFor(path);
  if (!tokens?.length || tokens[0] !== "M") return path;
  const arities: Record<string, number> = { M: 2, L: 2, Q: 4, C: 6, Z: 0 };
  let i = 0, x = 0, y = 0, startX = 0, startY = 0, previous = "", output = "";
  const encode = ([cmd, values]: [string, number[]]) =>
    (cmd === previous && cmd !== "m" ? (values[0] < 0 ? "" : " ") : cmd) +
    values.join(" ").replace(/ (?=-)/g, "");
  while (i < tokens.length) {
    const cmd = tokens[i++];
    const count = arities[cmd];
    if (count === undefined) return path;
    if (cmd === "Z") {
      output += "Z";
      x = startX; y = startY; previous = "Z";
      continue;
    }
    const parameters = tokens.slice(i, i + count);
    if (parameters.length !== count || parameters.some(value => !number.test(value) || !Number.isSafeInteger(Number(value)))) return path;
    const values = parameters.map(Number);
    i += count;
    const relative = values.map((value, axis) => value - (axis % 2 ? y : x));
    if (!relative.every(Number.isSafeInteger)) return path;
    const candidates: [string, number[]][] = [[cmd.toLowerCase(), relative]];
    if (cmd === "L") {
      if (values[1] === y) candidates.push(["h", [relative[0]]]);
      if (values[0] === x) candidates.push(["v", [relative[1]]]);
    }
    candidates.sort((a, b) => encode(a).length - encode(b).length);
    output += encode(candidates[0]);
    previous = candidates[0][0];
    x = values.at(-2)!; y = values.at(-1)!;
    if (cmd === "M") { startX = x; startY = y; }
  }
  return output.length < path.length ? output : path;
}
