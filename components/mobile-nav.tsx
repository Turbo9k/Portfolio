"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Download, Github } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
    { href: "/projects", label: "All Projects" },
  ]

  return (
    <>
      <Button variant="ghost" size="sm" onClick={toggleMenu} className="md:hidden" aria-label="Toggle mobile menu">
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10 md:hidden"
          >
            <div className="px-4 sm:px-6 py-4 space-y-4 w-full overflow-x-hidden">
              {menuItems.map((item) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-white hover:text-blue-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4 border-t border-white/10 space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white/10 border-white/20 hover:bg-white/20"
                  asChild
                >
                  <Link href="/resume">
                    <Download className="w-4 h-4 mr-2" />
                    Resume
                  </Link>
                </Button>

                <Button variant="outline" size="sm" className="w-full border-white/20 hover:bg-white/10" asChild>
                  <Link href="https://github.com/Turbo9k">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
