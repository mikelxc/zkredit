"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled ? "border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-lg shadow-md" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Shield
            className={cn(
              "h-8 w-8 text-violet-500 transition-transform duration-300",
              isScrolled ? "scale-90" : "scale-100",
            )}
          />
          <span
            className={cn(
              "text-xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent transition-all duration-300",
              isScrolled ? "text-lg" : "text-xl",
            )}
          >
            ZKredit.xyz
          </span>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col space-y-1.5 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span
            className={cn(
              "w-6 h-0.5 bg-white transition-all duration-300",
              isMobileMenuOpen && "rotate-45 translate-y-2",
            )}
          ></span>
          <span
            className={cn("w-6 h-0.5 bg-white transition-all duration-300", isMobileMenuOpen && "opacity-0")}
          ></span>
          <span
            className={cn(
              "w-6 h-0.5 bg-white transition-all duration-300",
              isMobileMenuOpen && "-rotate-45 -translate-y-2",
            )}
          ></span>
        </button>

        {/* Mobile menu */}
        <div
          className={cn(
            "fixed inset-0 bg-zinc-950/95 flex flex-col items-center justify-center space-y-8 md:hidden transition-all duration-300",
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          )}
        >
          <Link
            href="#problem"
            className="text-lg font-medium text-white hover:text-violet-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Problem
          </Link>
          <Link
            href="#solution"
            className="text-lg font-medium text-white hover:text-violet-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Solution
          </Link>
          <Link
            href="#how-it-works"
            className="text-lg font-medium text-white hover:text-violet-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="#innovations"
            className="text-lg font-medium text-white hover:text-violet-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Innovations
          </Link>
          <Link
            href="#tech"
            className="text-lg font-medium text-white hover:text-violet-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Technology
          </Link>
          <Link
            href="/documentation"
            className="text-lg font-medium text-white hover:text-violet-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Documentation
          </Link>
          <Link href="/demo" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#problem" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Problem
          </Link>
          <Link href="#solution" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Solution
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="#innovations" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Innovations
          </Link>
          <Link href="#tech" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Technology
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/documentation" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Documentation
          </Link>
          <Link href="/demo">
            <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 transition-all duration-300 hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

