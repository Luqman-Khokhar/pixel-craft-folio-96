/** Cover sources: an 800 wide copy for phones, the full 1600 for wide and dense screens. */
export const coverSources = (cover: string) => ({
  src: cover,
  srcSet: `${cover.replace("/covers/", "/covers/800/")} 800w, ${cover} 1600w`,
});

/** The stage is one tabpanel; each name in the index is a tab that controls it. */
export const STAGE_ID = "project-stage";
export const tabId = (i: number) => `project-tab-${i}`;
