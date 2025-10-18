import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme, ThemeColors } from "@/contexts/ThemeContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ThemeCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const hslToHex = (hsl: string): string => {
  const [h, s, l] = hsl.split(" ").map((v) => parseFloat(v));
  const hDecimal = h / 360;
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
  const x = c * (1 - Math.abs(((hDecimal * 6) % 2) - 1));
  const m = lDecimal - c / 2;

  let r = 0, g = 0, b = 0;
  if (hDecimal < 1 / 6) [r, g, b] = [c, x, 0];
  else if (hDecimal < 2 / 6) [r, g, b] = [x, c, 0];
  else if (hDecimal < 3 / 6) [r, g, b] = [0, c, x];
  else if (hDecimal < 4 / 6) [r, g, b] = [0, x, c];
  else if (hDecimal < 5 / 6) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToHsl = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const colorLabels: Record<keyof ThemeColors, string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  background: "Background",
  foreground: "Text",
};

export const ThemeCustomizer = ({ open, onOpenChange }: ThemeCustomizerProps) => {
  const { colors, updateColor, resetTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState<keyof ThemeColors>("primary");
  const [hexValue, setHexValue] = useState(hslToHex(colors[selectedColor]));

  const handleColorChange = (hex: string) => {
    setHexValue(hex);
    const hsl = hexToHsl(hex);
    updateColor(selectedColor, hsl);
  };

  const handleColorSelect = (key: keyof ThemeColors) => {
    setSelectedColor(key);
    setHexValue(hslToHex(colors[key]));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>🎨 Customize Theme</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetTheme}
              className="h-8 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Color Variable Selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Select Variable</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(colors) as Array<keyof ThemeColors>).map((key) => (
                <motion.button
                  key={key}
                  onClick={() => handleColorSelect(key)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedColor === key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md border-2 border-border"
                      style={{ backgroundColor: hslToHex(colors[key]) }}
                    />
                    <span className="text-sm font-medium">{colorLabels[key]}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <p className="text-sm font-medium">
              Pick Color for {colorLabels[selectedColor]}
            </p>
            <div className="flex flex-col items-center gap-3">
              <HexColorPicker
                color={hexValue}
                onChange={handleColorChange}
                style={{ width: "100%", height: "180px" }}
              />
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={hexValue}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                  placeholder="#000000"
                />
                <div
                  className="w-12 h-10 rounded-md border-2 border-border"
                  style={{ backgroundColor: hexValue }}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Live Preview</p>
            <div className="p-4 rounded-lg border bg-card space-y-2">
              <div className="h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                Primary
              </div>
              <div className="h-8 rounded-md bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-medium">
                Secondary
              </div>
              <div className="h-8 rounded-md bg-accent flex items-center justify-center text-accent-foreground text-xs font-medium">
                Accent
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
