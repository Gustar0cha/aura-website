import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Users, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance animate-fade-in-up">
            Juntos Construímos um{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Futuro Melhor
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed animate-fade-in-up delay-200">
            Uma associação dedicada a transformar vidas através do apoio mútuo, desenvolvimento comunitário e ações que
            fazem a diferença.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
            <a href="#associe-se">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 group">
                Torne-se um Associado
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </a>
            <a href="#sobre">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Conheça Nossa História
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in-up delay-500">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">500+</div>
              <div className="text-foreground/60">Associados Ativos</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-secondary" size={24} />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">1000+</div>
              <div className="text-foreground/60">Vidas Impactadas</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-accent-foreground" size={24} />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">15+</div>
              <div className="text-foreground/60">Anos de História</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
