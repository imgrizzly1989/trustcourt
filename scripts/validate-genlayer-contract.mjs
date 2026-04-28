import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const contractPath = resolve("contracts/trustcourt.py");
const source = readFileSync(contractPath, "utf8");

const requiredSnippets = [
  ["GenVM dependency header", /^# \{ "Depends": "py-genlayer:/m],
  ["GenLayer import", "from genlayer import *"],
  ["Contract inheritance", "class TrustCourt(gl.Contract):"],
  ["persistent agreement storage", "agreements = TreeMap"],
  ["public create method", "@gl.public.write"],
  ["payable funding method", "@gl.public.write.payable"],
  ["sender authorization", "gl.message.sender_address"],
  ["payable value", "gl.message.value"],
  ["AI nondeterministic boundary", "gl.vm.run_nondet_unsafe"],
  ["LLM JSON prompt", "gl.nondet.exec_prompt"],
];

const forbiddenSnippets = [
  ["dataclass draft", "from dataclasses import"],
  ["normal dict storage", "Dict["],
  ["NotImplemented arbitration", "NotImplementedError"],
  ["user supplied sender", "sender:"],
];

const failures = [];

for (const [label, snippet] of requiredSnippets) {
  const present = snippet instanceof RegExp ? snippet.test(source) : source.includes(snippet);
  if (!present) {
    failures.push(`missing ${label}`);
  }
}

for (const [label, snippet] of forbiddenSnippets) {
  if (source.includes(snippet)) {
    failures.push(`contains obsolete ${label}`);
  }
}

if (failures.length > 0) {
  console.error("GenLayer contract validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("GenLayer contract validation passed.");
