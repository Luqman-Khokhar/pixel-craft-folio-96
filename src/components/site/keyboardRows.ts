import { cardsUsing, skills } from "@/data/portfolio";
import type { SkillProof } from "./SkillCards";

// Top row to bottom row: what people touch, down to where it ships.
const ORDER = ["UI / UX", "Frontend", "State Management", "Real-time & APIs", "Backend", "Deployment"];
// Legends for the function row a phone gets in place of the full board.
const SHORT: Record<string, string> = {
  "UI / UX": "UI",
  Frontend: "Front",
  "State Management": "State",
  "Real-time & APIs": "Live",
  Backend: "Back",
  Deployment: "Ship",
};
const rank = (category: string) => {
  const i = ORDER.indexOf(category);
  return i === -1 ? ORDER.length : i;
};

/** "A", "A and B", "A, B and C". */
const listOf = (names: string[]) => (names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`);

export const ROWS = [...skills]
  .sort((a, b) => rank(a.category) - rank(b.category))
  .map((group) => ({
    ...group,
    short: SHORT[group.category] ?? group.category,
    proofs: group.items.map((name): SkillProof => ({ name, cards: cardsUsing(name) })),
  }));
export const TOTAL = ROWS.reduce((sum, row) => sum + row.proofs.length, 0);

export type At = { row: number; col: number };
export const same = (a: At | null, b: At | null) => !!a && !!b && a.row === b.row && a.col === b.col;
export const shippedIn = (proof: SkillProof) => (proof.cards.length ? listOf(proof.cards.map((card) => card.title)) : null);
export const labelFor = (proof: SkillProof) => (proof.cards.length ? `${proof.name}, shipped in ${shippedIn(proof)}` : proof.name);
