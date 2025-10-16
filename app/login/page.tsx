"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"

export default function LoginPage() {
  const formatCPF = useCallback((cpf: string) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return cpf;
  }, []);
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const auth = localStorage.getItem("aura_auth")
      if (!auth) return;

      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${auth}`
          }
        })

        if (!response.ok) {
          localStorage.removeItem("aura_auth")
          return
        }

        const userData = await response.json()
        if (userData.tipo === 'admin') {
          router.push("/admin")
        } else {
          router.push("/meu-cartao")
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        localStorage.removeItem("aura_auth")
      }
    }

    checkAuth()
  }, [router])

  const [formData, setFormData] = useState({
    cpf: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      // Armazena o token de autenticação
      localStorage.setItem("aura_auth", data.token)
      
      // Verifica o tipo de usuário para redirecionar
      const userResponse = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      })

      if (!userResponse.ok) {
        throw new Error('Erro ao obter dados do usuário')
      }

      const userData = await userResponse.json()
      
      // Redireciona com base no tipo de usuário
      if (userData.tipo === 'admin') {
        router.push("/admin")
      } else {
        router.push("/meu-cartao")
      }
    } catch (error) {
      console.error('Erro no login:', error)
      // Aqui você pode adicionar um toast ou alerta para o usuário
      alert('Erro ao fazer login. Verifique suas credenciais.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar para o site
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-32 h-32 flex items-center justify-center mx-auto mb-4">
              <img src="/logo aura.png" alt="Logo AURA" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Área do Associado</h1>
            <p className="text-foreground/60">Entre com suas credenciais</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-foreground mb-2">
                CPF
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input
                  type="text"
                  id="cpf"
                  required
                  value={formData.cpf}
                  onChange={(e) => {
                    const formattedCPF = formatCPF(e.target.value);
                    setFormData({ ...formData, cpf: formattedCPF });
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-input" />
                <span className="text-foreground/70">Lembrar-me</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
              Entrar
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-foreground/60">
              Ainda não é associado?{" "}
              <Link href="/#associe-se" className="text-primary hover:underline font-medium">
                Associe-se agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
