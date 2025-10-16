import { Star, Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Associada há 5 anos",
      content:
        "A AURA transformou minha vida. Encontrei não apenas apoio, mas uma verdadeira família. Os cursos de capacitação me ajudaram a conquistar um emprego melhor.",
      rating: 5,
    },
    {
      name: "João Santos",
      role: "Associado há 3 anos",
      content:
        "Ser parte da AURA é ter a certeza de que não estou sozinho. O apoio da comunidade e os benefícios oferecidos fazem toda a diferença no meu dia a dia.",
      rating: 5,
    },
    {
      name: "Ana Costa",
      role: "Associada há 7 anos",
      content:
        "Participar dos eventos e atividades da AURA me trouxe novas amizades e oportunidades. É inspirador ver o impacto positivo que fazemos juntos na comunidade.",
      rating: 5,
    },
  ]

  return (
    <section id="depoimentos" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            O Que Dizem Nossos Associados
          </h2>
          <p className="text-xl text-foreground/70 text-pretty leading-relaxed">
            Histórias reais de pessoas que fazem parte da nossa comunidade e vivenciam diariamente o impacto positivo da
            AURA.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-muted/50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              <Quote className="absolute top-6 right-6 text-primary/20" size={48} />

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-accent fill-accent" size={20} />
                ))}
              </div>

              <p className="text-foreground/80 leading-relaxed mb-6 text-pretty relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-foreground/60">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
