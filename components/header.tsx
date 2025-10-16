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

  const navItems = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre Nós" },
    { href: "#servicos", label: "O Que Fazemos" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#contato", label: "Contato" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo aura.png" alt="AURA Logo" width={280} height={84} className="h-16 md:h-20 w-auto" priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">
                Área do Associado
              </Button>
            </Link>
            <a href="#associe-se">
              <Button className="bg-primary hover:bg-primary/90 font-medium">Associe-se</Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full font-medium">
                  Área do Associado
                </Button>
              </Link>
              <a href="#associe-se" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 font-medium">Associe-se</Button>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
