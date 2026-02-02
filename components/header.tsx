"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navItems = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre Nós" },
    { href: "#servicos", label: "O Que Fazemos" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#contato", label: "Contato" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo - smaller on mobile */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo aura.png"
              alt="AURA Logo"
              width={280}
              height={84}
              className="h-12 sm:h-16 md:h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium min-h-[44px]">
                Área do Associado
              </Button>
            </Link>
            <a href="#associe-se">
              <Button className="bg-primary hover:bg-primary/90 font-medium min-h-[44px]">
                Associe-se
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button - optimized touch target */}
          <button
            className="md:hidden flex items-center justify-center w-12 h-12 -mr-2 rounded-lg active:bg-black/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu - with animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <nav className="flex flex-col gap-1 pt-4 pb-4 border-t mt-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-primary active:bg-primary/10 transition-colors font-medium py-3 px-2 rounded-lg min-h-[48px] flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 mt-2 border-t">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full font-medium min-h-[52px] text-base">
                  Área do Associado
                </Button>
              </Link>
              <a href="#associe-se" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 font-medium min-h-[52px] text-base">
                  Associe-se
                </Button>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
