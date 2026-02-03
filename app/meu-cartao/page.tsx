"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Share2, Home, Gift, Settings, ChevronRight, Copy, Check, User, Shield, HelpCircle, MessageCircle, LogOut, Key, Loader2, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MemberCard, MemberCardBack } from "@/components/member-card"
import { DependentCard, DependentCardBack } from "@/components/dependent-card"
import { downloadCardAsPDF, shareCard } from "@/lib/card-utils"

interface CardData {
  nome: string
  cpf: string
  registro: string
  validade: string
  tipo: 'titular' | 'dependente'
  titularNome?: string
  dependentes: Array<{
    nome: string
    cpf: string
    registro: string
    validade: string
  }>
}

type TabType = 'home' | 'beneficios' | 'configuracoes'

export default function MemberCardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [showFront, setShowFront] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("aura_auth")
    if (!auth) {
      router.push("/login")
      return
    }

    const fetchCardData = async () => {
      try {
        const response = await fetch('/api/carteira', {
          headers: { 'Authorization': `Bearer ${auth}` }
        })
        if (!response.ok) throw new Error('Erro ao carregar dados')
        const data = await response.json()
        setCardData(data)
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCardData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("aura_auth")
    router.push("/login")
  }

  const handleDownloadCard = async () => {
    setIsDownloading(true)
    try {
      await downloadCardAsPDF('download-card-front', 'download-card-back', `carteira-${cardData?.nome.replace(/\s/g, '-')}`)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShareCard = () => {
    shareCard('download-card-front', 'download-card-back', `carteira-${cardData?.nome.replace(/\s/g, '-')}`)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(cardData?.registro || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleChangePassword = async () => {
    setPasswordError('')

    if (passwordData.new !== passwordData.confirm) {
      setPasswordError('As senhas não coincidem')
      return
    }

    if (passwordData.new.length < 4) {
      setPasswordError('A nova senha deve ter pelo menos 4 caracteres')
      return
    }

    setIsChangingPassword(true)
    try {
      const auth = localStorage.getItem('aura_auth')
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao alterar senha')
      }

      setPasswordSuccess(true)
      setPasswordData({ current: '', new: '', confirm: '' })
      setTimeout(() => {
        setShowChangePassword(false)
        setPasswordSuccess(false)
      }, 2000)
    } catch (error: any) {
      setPasswordError(error.message || 'Erro ao alterar senha')
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // Error
  if (!cardData) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center p-6">
        <p className="text-gray-600 mb-4">Erro ao carregar dados</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    )
  }

  // Tab content components
  const HomeContent = () => (
    <div className="space-y-6">
      {/* Desktop Header - hidden on mobile */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sua Carteira</h1>
        <p className="text-gray-500">Gerencie sua carteira virtual de associado AURA</p>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden text-center">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">Sua Carteira</h1>
        <p className="text-gray-900 font-medium">Olá, {cardData.nome.split(' ')[0]}!</p>
        <p className="text-gray-500 text-sm">aqui está sua carteira virtual!</p>
      </div>

      {/* Desktop: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Card Column */}
        <div>
          {/* Desktop Greeting */}
          <div className="hidden md:block mb-4">
            <p className="text-gray-600">Olá, <span className="font-semibold text-gray-900">{cardData.nome.split(' ')[0]}</span>! 👋</p>
            <p className="text-sm text-gray-400">Clique no cartão para ver o verso</p>
          </div>

          {/* Card */}
          <div
            className="cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setShowFront(!showFront)}
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              {showFront ? (
                cardData.tipo === 'dependente' ? (
                  <DependentCard nome={cardData.nome} cpf={cardData.cpf} registro={cardData.registro} titularNome={cardData.titularNome || ''} />
                ) : (
                  <MemberCard nome={cardData.nome} cpf={cardData.cpf} registro={cardData.registro} />
                )
              ) : (
                cardData.tipo === 'dependente' ? (
                  <DependentCardBack nome={cardData.nome} cpf={cardData.cpf} titularNome={cardData.titularNome || ''} />
                ) : (
                  <MemberCardBack nome={cardData.nome} cpf={cardData.cpf} />
                )
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Gerando...' : 'Baixar PDF'}
            </Button>
            <Button
              onClick={handleShareCard}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 font-medium"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Info Column */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 hidden lg:block">Informações da Carteira</h3>

          <div className="space-y-5">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Código</p>
              <p className="text-gray-900 font-semibold text-lg flex items-center gap-3">
                {cardData.registro}
                <button
                  onClick={copyCode}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copiar código"
                >
                  {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-gray-400" />}
                </button>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Validade</p>
                <p className="text-gray-900 font-semibold">{cardData.validade}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Tipo</p>
                <p className="text-gray-900 font-semibold uppercase">{cardData.tipo}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-medium">Status: Ativa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const BeneficiosContent = () => (
    <div className="space-y-6">
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Benefícios</h1>
        <p className="text-gray-500">Confira os benefícios exclusivos para associados AURA</p>
      </div>

      <h1 className="md:hidden text-lg font-semibold text-center text-gray-900">Benefícios</h1>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-2xl p-5 flex items-center justify-between hover:bg-gray-800 transition-colors cursor-pointer">
          <div>
            <span className="text-white font-semibold text-lg">CUPOM DE DESCONTO</span>
            <p className="text-emerald-400 text-2xl font-bold">10% OFF</p>
          </div>
          <div className="text-right">
            <span className="text-emerald-400 font-bold text-xl">ifood</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 flex items-center justify-between hover:bg-gray-800 transition-colors cursor-pointer">
          <div>
            <span className="text-white font-semibold text-lg">DESCONTO</span>
            <p className="text-green-400 text-2xl font-bold">R$ 10,00</p>
          </div>
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🌿</span>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
        <p className="text-gray-400 text-sm uppercase tracking-wider mb-6 text-center lg:text-left">Nossos Parceiros</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {['DALL·E 2', 'stability.ai', 'OpenAI', 'CapCut', 'Google AI'].map((partner, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="text-3xl">🤖</span>
              <span className="font-semibold text-sm text-gray-700 text-center">{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const ConfiguracoesContent = () => (
    <div className="space-y-6">
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-500">Gerencie sua conta e preferências</p>
      </div>

      <h1 className="md:hidden text-lg font-semibold text-center text-gray-900">Configurações</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                {cardData.nome.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{cardData.nome}</h3>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium mt-2">
                <Check className="h-3 w-3" /> Verificado
              </span>
              <p className="text-gray-500 text-sm mt-2">Associado AURA</p>
            </div>
          </div>
        </div>

        {/* Settings Menus */}
        <div className="lg:col-span-2 space-y-6">
          {/* Minha Conta */}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 px-1">Minha Conta</p>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
              <button
                onClick={() => setShowEditProfile(true)}
                className="w-full flex items-center justify-between p-4 lg:p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-medium">Meu perfil</p>
                    <p className="text-gray-400 text-sm">Editar informações Pessoais</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>

              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full flex items-center justify-between p-4 lg:p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Key className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-medium">Alterar Senha</p>
                    <p className="text-gray-400 text-sm">Segurança da conta</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Suporte */}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 px-1">Suporte</p>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
              <button className="w-full flex items-center justify-between p-4 lg:p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-medium">Central de ajuda</p>
                    <p className="text-gray-400 text-sm">FAQ e tutoriais</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>

              <button className="w-full flex items-center justify-between p-4 lg:p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-medium">Contato</p>
                    <p className="text-gray-400 text-sm">Falar com suporte</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-3 mb-6">
          <img src="/logo aura.png" alt="AURA" className="h-10 w-auto" />
          <span className="font-bold text-xl text-gray-900">AURA</span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'home'
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Minha Carteira</span>
          </button>

          <button
            onClick={() => setActiveTab('beneficios')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'beneficios'
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Gift className="h-5 w-5" />
            <span className="font-medium">Benefícios</span>
          </button>

          <button
            onClick={() => setActiveTab('configuracoes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'configuracoes'
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Configurações</span>
          </button>
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {cardData.nome.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{cardData.nome.split(' ')[0]}</p>
              <p className="text-xs text-gray-500">Associado</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile: with bottom padding for tab bar */}
        {/* Desktop: with comfortable padding */}
        <div className="p-4 pb-24 md:p-8 lg:p-10 max-w-6xl mx-auto">
          {activeTab === 'home' && <HomeContent />}
          {activeTab === 'beneficios' && <BeneficiosContent />}
          {activeTab === 'configuracoes' && <ConfiguracoesContent />}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar - hidden on desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'home' ? 'text-gray-900' : 'text-gray-400'
              }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('beneficios')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'beneficios' ? 'text-gray-900' : 'text-gray-400'
              }`}
          >
            <Gift className="h-6 w-6" />
            <span className="text-xs mt-1">Benefícios</span>
          </button>

          <button
            onClick={() => setActiveTab('configuracoes')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'configuracoes' ? 'text-gray-900' : 'text-gray-400'
              }`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Configurações</span>
          </button>
        </div>
      </nav>

      {/* Hidden PDF containers */}
      <div style={{ position: 'fixed', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        <div id="download-card-front" style={{ width: '400px' }}>
          {cardData.tipo === 'dependente' ? (
            <DependentCard nome={cardData.nome} cpf={cardData.cpf} registro={cardData.registro} titularNome={cardData.titularNome || ''} />
          ) : (
            <MemberCard nome={cardData.nome} cpf={cardData.cpf} registro={cardData.registro} />
          )}
        </div>
        <div id="download-card-back" style={{ width: '400px' }}>
          {cardData.tipo === 'dependente' ? (
            <DependentCardBack nome={cardData.nome} cpf={cardData.cpf} titularNome={cardData.titularNome || ''} />
          ) : (
            <MemberCardBack nome={cardData.nome} cpf={cardData.cpf} />
          )}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Atualize suas informações pessoais</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input defaultValue={cardData.nome} className="h-12 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="seu@email.com" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input inputMode="tel" placeholder="(00) 00000-0000" className="h-12 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowEditProfile(false)} className="flex-1 h-12 rounded-xl">
              Cancelar
            </Button>
            <Button onClick={() => setShowEditProfile(false)} className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600">
              Salvar alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={(open) => {
        setShowChangePassword(open)
        if (!open) {
          setPasswordData({ current: '', new: '', confirm: '' })
          setPasswordError('')
          setPasswordSuccess(false)
        }
      }}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>Digite sua senha atual e a nova senha</DialogDescription>
          </DialogHeader>

          {passwordSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900">Senha alterada!</p>
              <p className="text-gray-500 text-sm mt-1">Sua senha foi atualizada com sucesso</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Senha atual</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                      className="h-12 rounded-xl pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nova senha</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                      className="h-12 rounded-xl pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Confirmar nova senha</Label>
                  <Input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    className="h-12 rounded-xl"
                    placeholder="••••••••"
                  />
                </div>

                {passwordError && (
                  <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 h-12 rounded-xl"
                  disabled={isChangingPassword}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleChangePassword}
                  className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600"
                  disabled={isChangingPassword || !passwordData.current || !passwordData.new || !passwordData.confirm}
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Alterando...
                    </>
                  ) : (
                    'Alterar senha'
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
