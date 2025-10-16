import { Heart, Target, Eye } from "lucide-react"

export function About() {
  return (
    <section id="sobre" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Sobre a AURA</h2>
          <p className="text-xl text-foreground/70 text-pretty leading-relaxed">
            Somos uma associação comprometida com o desenvolvimento humano e comunitário, trabalhando para criar
            oportunidades e transformar realidades através da união e solidariedade.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
              <Heart className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Nossa Missão</h3>
            <p className="text-foreground/70 leading-relaxed">
              Promover o bem-estar e desenvolvimento integral dos nossos associados através de ações solidárias,
              educação e apoio mútuo, construindo uma comunidade mais justa e acolhedora.
            </p>
          </div>

          <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
              <Eye className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Nossa Visão</h3>
            <p className="text-foreground/70 leading-relaxed">
              Ser referência em associativismo, reconhecida pela excelência no atendimento e pelo impacto positivo na
              vida dos associados e da comunidade.
            </p>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/20 rounded-2xl p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-amber-400 rounded-2xl flex items-center justify-center mb-6">
              <Target className="text-accent-foreground" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Nossos Valores</h3>
            <p className="text-foreground/70 leading-relaxed">
              Solidariedade, transparência, respeito, inclusão e compromisso com o desenvolvimento sustentável e a
              transformação social positiva.
            </p>
          </div>
        </div>

        <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-foreground mb-6 text-center">Nossa História</h3>
          <p className="text-lg text-foreground/70 leading-relaxed text-pretty mb-4">
            Fundada há mais de 15 anos, a AURA nasceu do sonho de um grupo de pessoas que acreditava no poder da união e
            da solidariedade. Desde então, temos crescido constantemente, expandindo nossos serviços e alcançando cada
            vez mais pessoas.
          </p>
          <p className="text-lg text-foreground/70 leading-relaxed text-pretty">
            Hoje, somos uma comunidade vibrante de mais de 500 associados, unidos pelo desejo de construir um futuro
            melhor para todos. Cada conquista é resultado do trabalho coletivo e do compromisso de cada membro com
            nossos valores e missão.
          </p>
        </div>
      </div>
    </section>
  )
}
