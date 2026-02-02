"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, Lock, Loader2 } from "lucide-react"

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setIsLoading(true)
    setError(null)

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
        throw new Error(data.error || 'CPF ou senha incorretos')
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
    } catch (err) {
      console.error('Erro no login:', err)
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Link voltar - touch target otimizado */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground mb-6 sm:mb-8 transition-colors min-h-[48px] -ml-2 px-2 active:bg-black/5 rounded-lg"
        >
          <ArrowLeft size={20} />
          <span className="text-base">Voltar para o site</span>
        </Link>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
          {/* Header - menor em mobile */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <img src="/logo aura.png" alt="Logo AURA" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Área do Associado</h1>
            <p className="text-sm sm:text-base text-foreground/60">Entre com suas credenciais</p>
          </div>

          {/* Erro de login */}
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm sm:text-base text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Campo CPF - inputmode numeric para teclado numérico */}
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-foreground mb-2">
                CPF
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input
                  type="text"
                  inputMode="numeric"
                  id="cpf"
                  required
                  autoComplete="username"
                  value={formData.cpf}
                  onChange={(e) => {
                    const formattedCPF = formatCPF(e.target.value);
                    setFormData({ ...formData, cpf: formattedCPF });
                    setError(null);
                  }}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-3 min-h-[48px] rounded-xl sm:rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>

            {/* Campo Senha */}
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
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setError(null);
                  }}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-3 min-h-[48px] rounded-xl sm:rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Opções - touch targets maiores */}
            <div className="flex items-center justify-between text-sm py-1">
              <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-input accent-primary"
                />
                <span className="text-foreground/70">Lembrar-me</span>
              </label>
              <a
                href="#"
                className="text-primary hover:underline min-h-[44px] flex items-center px-2 -mr-2 active:bg-primary/10 rounded-lg"
              >
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão Entrar - grande e na thumb zone */}
            <Button
              type="submit"
              size="lg"
              className="w-full min-h-[52px] sm:min-h-[48px] text-base sm:text-lg font-semibold bg-primary hover:bg-primary/90 active:scale-[0.98] transition-transform rounded-xl sm:rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Link associar - touch target otimizado */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm sm:text-base text-foreground/60">
              Ainda não é associado?{" "}
              <Link
                href="/#associe-se"
                className="text-primary hover:underline font-medium inline-flex items-center min-h-[44px] px-1"
              >
                Associe-se agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
