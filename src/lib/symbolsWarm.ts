let settle: () => void = () => undefined;

/** Resolves once the hero's 3D symbols have drawn their first frame, or will never need to. */
export const symbolsWarm = new Promise<void>((resolve) => {
  settle = resolve;
});

export const markSymbolsWarm = () => settle();

export const SEEN_KEY = "lk-intro-seen";

/** True when the entry screen already played this session (false too when storage is unavailable). */
export const introSeen = () => {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};
