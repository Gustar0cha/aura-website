import { GraduationCap, HeartHandshake, Users, Briefcase, Home, Stethoscope } from "lucide-react"

export function Services() {
  const services = [
    {
      icon: GraduationCap,
      title: "Educação e Capacitação",
      description: "Cursos, workshops e programas de desenvolvimento pessoal e profissional para nossos associados.",
      color: "from-primary to-primary/80",
    },
    {
      icon: HeartHandshake,
      title: "Apoio Social",
      description: "Assistência e suporte em momentos de necessidade, fortalecendo os laços comunitários.",
      color: "from-secondary to-secondary/80",
    },
    {
      icon: Users,
      title: "Eventos Comunitários",
      description: "Encontros, celebrações e atividades que promovem integração e bem-estar.",
      color: "from-accent to-amber-400",
    },
    {
      icon: Briefcase,
      title: "Oportunidades Profissionais",
      description: "Networking, orientação de carreira e conexões com o mercado de trabalho.",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Stethoscope,
      title: "Saúde e Bem-estar",
      description: "Programas de saúde preventiva, orientação e parcerias com profissionais da área.",
      color: "from-rose-500 to-rose-600",
    },
    {
      icon: Home,
      title: "Benefícios Exclusivos",
      description: "Descontos, parcerias e vantagens especiais para associados em diversos estabelecimentos.",
      color: "from-violet-500 to-violet-600",
    },
  ]

  return (
    <section id="servicos" className="py-24 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">O Que Fazemos</h2>
          <p className="text-xl text-foreground/70 text-pretty leading-relaxed">
            Oferecemos uma ampla gama de serviços e benefícios pensados para apoiar o desenvolvimento e bem-estar dos
            nossos associados.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <service.icon className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-foreground/70 mb-6">
            Quer saber mais sobre nossos serviços e como podemos ajudar você?
          </p>
          <a href="#contato">
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Entre em Contato
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}
