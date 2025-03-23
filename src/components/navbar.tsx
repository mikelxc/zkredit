"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Separate useEffect for pathname-dependent logic
  useEffect(() => {
    // Check if we have a pending section to scroll to after navigation
    if (pathname === "/") {
      const pendingSection = sessionStorage.getItem("pendingScroll");
      if (pendingSection) {
        sessionStorage.removeItem("pendingScroll");
        setTimeout(() => {
          scrollToSection(pendingSection);
        }, 100); // Small delay to ensure the page has fully loaded
      }
    }
  }, [pathname]); // This effect depends on pathname changes

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check which section is currently in view
      const sections = ["problem", "solution", "validators", "how-it-works"];
      let currentSection = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (sectionId?: string) => {
    if (pathname === "/") {
      // If already on home page, scroll to section or top
      if (sectionId) {
        scrollToSection(sectionId);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } else {
      // If not on home page, navigate to home and prepare to scroll
      if (sectionId) {
        sessionStorage.setItem("pendingScroll", sectionId);
      }
      router.push("/");
    }
  };

  const handleNavClick = (sectionId: string) => {
    if (pathname === "/") {
      scrollToSection(sectionId);
    } else {
      sessionStorage.setItem("pendingScroll", sectionId);
      router.push("/");
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled
          ? "border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-lg shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => handleLogoClick()}
        >
          <Shield
            className={cn(
              "h-8 w-8 text-violet-500 transition-transform duration-300",
              isScrolled ? "scale-90" : "scale-100"
            )}
          />
          <span
            className={cn(
              "text-xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent transition-all duration-300",
              isScrolled ? "text-lg" : "text-xl"
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
              isMobileMenuOpen && "rotate-45 translate-y-2"
            )}
          ></span>
          <span
            className={cn(
              "w-6 h-0.5 bg-white transition-all duration-300",
              isMobileMenuOpen && "opacity-0"
            )}
          ></span>
          <span
            className={cn(
              "w-6 h-0.5 bg-white transition-all duration-300",
              isMobileMenuOpen && "-rotate-45 -translate-y-2"
            )}
          ></span>
        </button>

        {/* Mobile menu */}
        <div
          className={cn(
            "fixed inset-0 bg-zinc-950/95 flex flex-col items-center justify-center space-y-8 md:hidden transition-all duration-300",
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <button
            className="text-lg font-medium text-white hover:text-violet-400 transition-colors"
            onClick={() => handleNavClick("problem")}
          >
            Problem
          </button>
          <button
            className="text-lg font-medium text-white hover:text-violet-400 transition-colors"
            onClick={() => handleNavClick("solution")}
          >
            Solution
          </button>
          <button
            className="text-lg font-medium text-white hover:text-violet-400 transition-colors"
            onClick={() => handleNavClick("validators")}
          >
            Validator Types
          </button>
          <button
            className="text-lg font-medium text-white hover:text-violet-400 transition-colors"
            onClick={() => handleNavClick("how-it-works")}
          >
            How It Works
          </button>
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
          <button
            onClick={() => handleNavClick("problem")}
            className={`text-sm font-medium transition-colors ${
              activeSection === "problem"
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Problem
          </button>
          <button
            onClick={() => handleNavClick("solution")}
            className={`text-sm font-medium transition-colors ${
              activeSection === "solution"
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Solution
          </button>
          <button
            onClick={() => handleNavClick("validators")}
            className={`text-sm font-medium transition-colors ${
              activeSection === "validators"
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Validator Types
          </button>
          <button
            onClick={() => handleNavClick("how-it-works")}
            className={`text-sm font-medium transition-colors ${
              activeSection === "how-it-works"
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            How It Works
          </button>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/documentation"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
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
  );
}
