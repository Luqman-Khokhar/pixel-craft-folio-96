import { LoaderSeal } from "./LoaderSeal";

/** The brand mark: the entry screen's "LK" seal, already inked. */
export function Crest({ className = "" }: { className?: string }) {
  return <LoaderSeal still className={className} />;
}
