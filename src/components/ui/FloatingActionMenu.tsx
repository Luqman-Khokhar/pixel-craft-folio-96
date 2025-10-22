import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, X, Palette, FileDown } from "lucide-react"

export const FloatingActionMenu = ({ setIsThemeCustomizerOpen, setShowBee }) => {
  const [isOpen, setIsOpen] = useState(false)

  const buttons = [
    {
      id: "cv",
      tooltip: "CV Download",
      color: "bg-green-700 hover:bg-green-900",
      tooltipClass: "bg-green-800 text-white px-3 py-1 rounded",
      icon: <FileDown className="h-5 w-5" />,
      onClick: () =>
        window.open(
          "/CV/Muhammad_Luqman_CV_(18Oct2025).pdf.pdf",
          "_blank"
        ),
      bottom: 36,
    },
    {
      id: "theme",
      tooltip: "Customize Theme Colors",
      color: "bg-blue-700 hover:bg-blue-900",
      tooltipClass: "bg-blue-800 text-white px-3 py-1 rounded",
      icon: <Palette className="h-5 w-5" />,
      onClick: () => setIsThemeCustomizerOpen(true),
      bottom: 20,
    },
    {
      id: "bee",
      tooltip: "3D Bee Model",
      color: "bg-yellow-400 hover:bg-yellow-600 text-black",
      tooltipClass: "bg-yellow-800 text-white px-3 py-1 rounded",
      icon: "🐝",
      onClick: () => setShowBee((prev) => !prev),
      bottom: 6,
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen &&
          buttons.map((btn, i) => (
            <motion.div
              key={btn.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: i * 0.05 }}
            >
              <Button
                tooltip={btn.tooltip}
                tooltipSide="left"
                tooltipClassName={btn.tooltipClass}
                size="icon"
                onClick={btn.onClick}
                className={`${btn.color} text-white rounded-full shadow-lg p-2 transition-all duration-300 flex items-center justify-center`}
              >
                {btn.icon}
              </Button>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Toggle Button (+ / X) */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Button
          size="icon"
          className={`${
            isOpen
              ? "bg-red-600 hover:bg-red-700"
              : "bg-primary hover:bg-primary/90"
          } text-white rounded-full shadow-lg p-3 flex items-center justify-center transition-all duration-300`}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
}
