// traveler-from-1800
// One sentence explaining the modern internet to a traveler from 1800,
// built only from things they could picture: roads, post offices, libraries.
// The program is deterministic: no clock reads, no randomness, no network,
// no environment secrets. It validates the sentence and writes it to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SENTENCE =
  "Imagine all the roads, post offices, and libraries of the world woven into one web, where a letter you write reaches anyone before your tea cools and a book you name opens before your eyes.";

const MAX_CHARS = 200;

// Length gate: 1-200 characters, counted as Unicode code points.
const charCount = [...SENTENCE].length;
if (charCount < 1 || charCount > MAX_CHARS) {
  throw new Error(
    `sentence must be 1-${MAX_CHARS} characters, got ${charCount}`,
  );
}

// One-sentence gate: exactly one sentence terminator, the final period,
// no other terminators, no line breaks, no surrounding whitespace.
if (SENTENCE !== SENTENCE.trim()) {
  throw new Error("sentence must not have leading or trailing whitespace");
}
if (/[\r\n]/.test(SENTENCE)) {
  throw new Error("sentence must be a single line");
}
const terminators = SENTENCE.match(/[.!?]/g) ?? [];
if (terminators.length !== 1 || !SENTENCE.endsWith(".")) {
  throw new Error(
    `sentence must end with exactly one terminator, found ${terminators.length}`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, SENTENCE, "utf8");

// Read back and confirm the written file is exactly the sentence.
const written = readFileSync(outPath, "utf8");
if (written !== SENTENCE) {
  throw new Error("written entry.txt does not match the sentence");
}
