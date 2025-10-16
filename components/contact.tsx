"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("[v0] Form submitted:", formData)
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  return (
    <section id="contato" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Entre em Contato</h2>
          <p className="text-xl text-foreground/70 text-pretty leading-relaxed">
            Estamos aqui para responder suas dúvidas e ajudar você a fazer parte da nossa comunidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Fale Conosco</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Como podemos ajudar você?"
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 group">
                Enviar Mensagem
                <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </form>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Informações de Contato</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">E-mail</div>
                  <a href="mailto:contato@aura.org" className="text-foreground/70 hover:text-primary transition-colors">
                    contato@aura.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="text-secondary" size={24} />
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">Telefone</div>
                  <a href="tel:+5511999999999" className="text-foreground/70 hover:text-primary transition-colors">
                    (11) 99999-9999
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-accent-foreground" size={24} />
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">Endereço</div>
                  <p className="text-foreground/70">
                    Rua Exemplo, 123
                    <br />
                    Centro - São Paulo, SP
                    <br />
                    CEP 01000-000
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
              <h4 className="font-semibold text-foreground mb-2">Horário de Atendimento</h4>
              <p className="text-foreground/70">
                Segunda a Sexta: 9h às 18h
                <br />
                Sábado: 9h às 13h
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
