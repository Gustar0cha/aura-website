import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-foreground to-foreground/95 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-4">
              <Image
                src="/logo-aura.png"
                alt="AURA Logo"
                width={300}
                height={120}
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/70 leading-relaxed">
              Transformando vidas através do apoio mútuo e desenvolvimento comunitário.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <a href="#inicio" className="text-white/70 hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-white/70 hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-white/70 hover:text-white transition-colors">
                  O Que Fazemos
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="text-white/70 hover:text-white transition-colors">
                  Depoimentos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Associados</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                  Área do Associado
                </Link>
              </li>
              <li>
                <a href="#associe-se" className="text-white/70 hover:text-white transition-colors">
                  Torne-se Associado
                </a>
              </li>
              <li>
                <a href="#contato" className="text-white/70 hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Redes Sociais</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:contato@aura.org"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} AURA - Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
