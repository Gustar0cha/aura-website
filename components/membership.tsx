import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"

export function Membership() {
  const benefits = [
    "Acesso a todos os cursos e workshops",
    "Descontos exclusivos em estabelecimentos parceiros",
    "Participação em eventos comunitários",
    "Apoio social e assistência quando necessário",
    "Networking com outros associados",
    "Carteirinha digital de associado",
    "Orientação profissional e de carreira",
    "Programas de saúde e bem-estar",
  ]

  return (
    <section
      id="associe-se"
      className="py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Faça Parte da AURA</h2>
            <p className="text-xl text-foreground/70 text-pretty leading-relaxed">
              Junte-se a centenas de pessoas que já transformaram suas vidas através da nossa comunidade.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12 bg-gradient-to-br from-primary to-secondary text-white">
                <h3 className="text-3xl font-bold mb-6">Benefícios de Ser Associado</h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={16} />
                      </div>
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <div className="text-5xl font-bold text-foreground mb-2">R$ 49,90</div>
                  <div className="text-foreground/60">por mês</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-foreground/70">
                    <Check className="text-primary" size={20} />
                    <span>Sem taxa de adesão</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/70">
                    <Check className="text-primary" size={20} />
                    <span>Cancele quando quiser</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/70">
                    <Check className="text-primary" size={20} />
                    <span>Suporte dedicado</span>
                  </div>
                </div>

                <a href="#contato">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg group">
                    Quero Me Associar
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </a>

                <p className="text-sm text-foreground/60 text-center mt-6">
                  Tem dúvidas?{" "}
                  <a href="#contato" className="text-primary hover:underline">
                    Entre em contato
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
