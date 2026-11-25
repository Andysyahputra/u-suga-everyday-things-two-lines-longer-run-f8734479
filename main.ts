import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One everyday thing (a toaster), one analogy: a tiny lift / elevator
// that carries bread down, toasts it, and brings it back up.
const LINE_1 =
  "A toaster is a tiny lift that carries your bread down into a hot little basement, toasts it brown, and brings it straight back up again.";
const LINE_2 =
  "The lift covers the bread going down, getting brown from heat, and popping back up, but it leaves out that glowing wires do the heating, not a basement, and the bread never really travels anywhere.";

// Revision 2: validate the entry against the competition gate before
// writing it, so a bad edit fails loudly instead of shipping an
// invalid entry. Checks: exactly two lines, one sentence (one
// terminating period) per line, 1-400 characters total, not only
// whitespace, and a clean UTF-8 round-trip.
function validateEntry(entry: string): void {
  const body = entry.replace(/\n$/, "");
  if (body.length < 1 || body.length > 400) {
    throw new Error(`entry must be 1-400 characters, got ${body.length}`);
  }
  if (body.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  const lines = body.split("\n");
  if (lines.length !== 2) {
    throw new Error(`entry must be exactly two lines, got ${lines.length}`);
  }
  for (const [i, line] of lines.entries()) {
    const periods = (line.match(/\./g) ?? []).length;
    if (periods !== 1 || !line.endsWith(".")) {
      throw new Error(
        `line ${i + 1} must be exactly one sentence, got ${periods} period(s)`,
      );
    }
  }
  const bytes = Buffer.from(body, "utf8");
  new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

const ENTRY = `${LINE_1}\n${LINE_2}\n`;
validateEntry(ENTRY);

const outDir = "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
