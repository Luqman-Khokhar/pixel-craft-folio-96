/** A w × h rectangle with cut corners, drawn `inset` in from its edge. The one shape every card and plate on the site is cut to. */
export const chamferPath = (w: number, h: number, inset: number, cut: number) =>
  `M${inset + cut} ${inset} H${w - inset - cut} L${w - inset} ${inset + cut} V${h - inset - cut} L${w - inset - cut} ${h - inset} H${inset + cut} L${inset} ${h - inset - cut} V${inset + cut} Z`;
