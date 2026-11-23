// Entry program for the make.fun bounty "Promote make.fun's make-your-own-bounty post on X".
//
// The post itself is the entry: one post of your own on X that quotes make.fun's
// make-your-own-bounty post (https://x.com/makefunai/status/2124915864336236646)
// or links to it, with a photo of its own attached and make.fun (or the @makefunai
// tag) plus your play code in its text. This program only hands the post's address
// to the gate: it reads POST.json from the repository root and writes it into the
// output directory, where the gate reads it. Nothing this program writes about
// the post is scored; places go by the post's replies plus reposts plus quotes.
//
// Run the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const SOURCE = join(BOT_DIR, 'POST.json');
const TARGET = join(OUTPUT_DIR, 'POST.json');

let post: string;
try {
  post = readFileSync(SOURCE, 'utf8');
} catch (err) {
  console.error(`cannot read ${SOURCE}: ${(err as Error).message}`);
  process.exit(1);
}

// The gate refuses a POST.json that names no post, so fail loudly here
// instead of handing it a file it cannot use.
let parsed: unknown;
try {
  parsed = JSON.parse(post);
} catch (err) {
  console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (
  typeof parsed !== 'object' ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== 'string' ||
  ((parsed as { url: string }).url.length === 0)
) {
  console.error('POST.json must hold an object with a non-empty string "url"');
  process.exit(1);
}

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(TARGET, post);
} catch (err) {
  console.error(`cannot write ${TARGET}: ${(err as Error).message}`);
  process.exit(1);
}
