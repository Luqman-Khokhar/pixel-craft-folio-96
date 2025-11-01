import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme, ThemeColors } from "@/contexts/ThemeContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ThemeCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// --- helpers ---
const hslToHex = (hsl?: string): string => {
  if (!hsl) return "#ccc";
  const parts = hsl.replace(/[^\d.%]/g, "").split(/\s+/).filter(Boolean);
  const [h, s, l] = parts.map(v => parseFloat(v));
  if ([h, s, l].some(isNaN)) return "#ccc";
  const a = s * Math.min(l / 100, 1 - l / 100) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
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
    h =
      max === r ? ((g - b) / d + (g < b ? 6 : 0)) :
      max === g ? ((b - r) / d + 2) :
      ((r - g) / d + 4);
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const colorLabels: Record<keyof ThemeColors, string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  background: "Background",
  foreground: "Text",
  rainbow: "Rainbow"
};

export const ThemeCustomizer = ({ open, onOpenChange }: ThemeCustomizerProps) => {
  const { colors, updateColor, resetTheme } = useTheme();
  const [pending, setPending] = useState(colors);
  const [selected, setSelected] = useState<keyof ThemeColors>("primary");
  const [hex, setHex] = useState(hslToHex(colors.primary));
  const [rainbow, setRainbow] = useState(["#3b82f6", "#9333ea"]);

  useEffect(() => {
    if (open) {
      setPending(colors);
      const val = colors[selected];
      setHex(selected === "rainbow" ? "" : hslToHex(val));
    }
  }, [open, colors, selected]);

  const handleChange = (hex: string) => {
    setHex(hex);
    setPending(p => ({ ...p, [selected]: hexToHsl(hex) }));
  };

  const save = () => {
    Object.entries(pending).forEach(([k, v]) => updateColor(k as keyof ThemeColors, v));
    onOpenChange(false);
  };

  const reset = () => {
    resetTheme();
    setPending(colors);
    setHex(hslToHex(colors[selected]));
  };

return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className="
        w-[95vw] max-w-full md:max-w-[900px] lg:max-w-[1000px]
        p-4 sm:p-6
        max-h-[90vh] overflow-y-auto
      "
    >
      <DialogHeader className=" bg-background  pb-2">
        <DialogTitle className="text-base sm:text-lg md:text-xl">
          🎨 Customize Theme
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left: Picker */}
        <div className="space-y-4">
          <p className="text-sm font-medium">
            Pick Color for {selected === "rainbow"? "Gradient":colorLabels[selected]}
          </p>

          {selected === "rainbow" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rainbow.map((clr, i) => (
                <div key={i} className="flex justify-center">
                  <HexColorPicker
                    color={clr}
                    onChange={newClr => {
                      const arr = [...rainbow];
                      arr[i] = newClr;
                      setRainbow(arr);
                      setPending(p => ({
                        ...p,
                        rainbow: `linear-gradient(90deg, ${arr[0]}, ${arr[1]})`,
                      }));
                    }}
                    style={{ width: "100%" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <HexColorPicker
              color={hex}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          )}
        </div>

        {/* Right: Preview & Actions */}
        <div className="space-y-4">
          <p className="text-sm font-medium">Preview (click to select)</p>

          <div
            className="
              p-3 border rounded-lg 
              grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 
              gap-2
            "
          >
            {(Object.keys(pending) as Array<keyof ThemeColors>).map(k => {
              const val = pending[k];
              const isGrad = val?.startsWith("linear-gradient");
              return (
                <motion.div
                  key={k}
                  onClick={() => {
                    setSelected(k);
                    if (k !== "rainbow") setHex(hslToHex(val));
                  }}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer h-10 flex items-center justify-center text-[10px] sm:text-xs rounded-md border transition-all ${
                    selected === k ? "ring-2 ring-primary" : ""
                  }`}
                  style={{
                    background: isGrad ? val : `hsl(${val})`,
                    color:
                      k === "foreground"
                        ? `hsl(${pending.background})`
                        : `hsl(${pending.foreground})`,
                  }}
                >
                  {k === "rainbow"? "Gradient": k === "accent"? "Hover": colorLabels[k]}
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sticky bottom-0 bg-background pt-2 pb-1">
            <Button
              variant="outline"
              onClick={reset}
              className="flex-1 flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button
              onClick={save}
              className="flex-1 flex items-center justify-center"
            >
              Save Theme
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

};
