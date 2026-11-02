let settle: () => void = () => undefined;

/** Resolves once the hero's 3D symbols have drawn their first frame, or will never need to. */
export const symbolsWarm = new Promise<void>((resolve) => {
  settle = resolve;
});

export const markSymbolsWarm = () => settle();
