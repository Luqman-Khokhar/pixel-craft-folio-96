// Native smooth scrolling only: wheel, keys, touch and anchors all stay with the browser.
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function scrollToY(y: number, instant = false) {
  window.scrollTo({ top: Math.max(0, y), behavior: instant || reducedMotion() ? "auto" : "smooth" });
}

export function scrollToHash(hash: string, instant = false) {
  if (!hash || hash === "#") return false;
  let el: Element | null = null;
  try {
    el = document.querySelector(hash);
  } catch {
    return false;
  }
  if (!el) return false;
  scrollToY(el.getBoundingClientRect().top + window.scrollY, instant);
  return true;
}

/** Click handler for in-page anchors: smooth scroll, and the hash follows without a jump or a history entry. */
export function goToAnchor(e: { preventDefault: () => void }, href: string) {
  e.preventDefault();
  if (scrollToHash(href)) {
    try {
      window.history.replaceState(null, "", href);
    } catch {
      /* some sandboxes block history updates; the scroll already happened */
    }
  }
}
