import type { ComponentType } from "react";
import Gold from "../components/design/simple/gold";
import ClassicBlue from "../components/design/classic/blue";
import Modern from "../components/design/modern/pink";

export type ThemeComponent = ComponentType;

export const THEME_BY_ID: Record<number, ThemeComponent> = {
  1: Gold,
  2: ClassicBlue,
  3: Modern,
};

export const DEFAULT_THEME: ThemeComponent = Gold;

export function resolveTheme(designId?: number | null): ThemeComponent {
  if (designId && THEME_BY_ID[designId]) {
    return THEME_BY_ID[designId];
  }

  return DEFAULT_THEME;
}