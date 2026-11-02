import { Monitor, Smartphone } from "lucide-react";
import type { Project } from "@/data/portfolio";

/** The device a project runs on, drawn: a screen for the web, a phone for mobile, both for both. */
export const PLATFORM_ICONS: Record<Project["platform"], readonly (typeof Monitor)[]> = {
  mobile: [Smartphone],
  web: [Monitor],
  all: [Monitor, Smartphone],
};
