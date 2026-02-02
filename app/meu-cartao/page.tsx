"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Share2, LogOut, User, HeadphonesIcon, Loader2, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export default function MemberCardPage() {
  const router = useRouter()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [showFront, setShowFront] = useState(true)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    const auth = localStorage.getItem("aura_auth")
    if (!auth) {
      router.push("/login")
      return
    }

    const fetchCardData = async () => {
      try {
        const response = await fetch('/api/carteira', {
          headers: {
            'Authorization': `Bearer ${auth}`
          }
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar dados da carteira')
        }

        const data = await response.json()
        setCardData(data)
        setProfileData({
          name: data.nome || '',
          email: '',
          phone: '',
        })
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
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

  const handleSaveProfile = () => {
    setShowEditProfile(false)
  }

  const handleDownloadCard = async () => {
    setIsDownloading(true)
    try {
      await downloadCardAsPDF('download-card-front', 'download-card-back', `carteira-${cardData?.nome.replace(/\s/g, '-')}`)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShareCard = (frontId: string, backId: string, fileName: string) => {
    shareCard(frontId, backId, fileName)
  }

  // Loading state - Full screen centered
  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-600 to-blue-700 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <p className="text-white/90 text-lg font-medium">Carregando sua carteira...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (!cardData) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-slate-100 to-slate-200 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ops! Algo deu errado</h2>
          <p className="text-slate-600 mb-6">Não conseguimos carregar sua carteira. Tente novamente.</p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full min-h-[52px] text-base font-semibold"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-600 via-emerald-500 to-blue-600 flex flex-col">
      {/* Header - Minimal and elegant */}
      <header className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-sm">Olá,</p>
          <h1 className="text-white text-xl sm:text-2xl font-bold truncate">
            {cardData.nome.split(' ')[0]} 👋
          </h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-12 w-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-xl">
            <DropdownMenuItem onClick={() => setShowEditProfile(true)} className="cursor-pointer min-h-[48px] text-base">
              <User className="mr-3 h-5 w-5" />
              Editar Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowSupport(true)} className="cursor-pointer min-h-[48px] text-base">
              <HeadphonesIcon className="mr-3 h-5 w-5" />
              Suporte
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer min-h-[48px] text-base">
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Status Badge - Centered */}
      <div className="flex justify-center py-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium">Carteira Ativa</span>
        </div>
      </div>

      {/* Main Card Area - Full width on mobile */}
      <main className="flex-1 flex flex-col px-0 sm:px-6 lg:px-8 pb-32 sm:pb-8">
        <div className="max-w-lg mx-auto w-full">
          {/* Card Container with glass effect */}
          <div className="bg-white/10 backdrop-blur-sm rounded-t-3xl sm:rounded-3xl pt-4 pb-6 px-4 sm:mt-4">
            {/* Flip Toggle */}
            <button
              onClick={() => setShowFront(!showFront)}
              className="w-full flex items-center justify-center gap-2 text-white/90 text-sm font-medium py-3 mb-3 hover:text-white transition-colors active:scale-[0.98]"
            >
              <span>Toque para ver o {showFront ? 'verso' : 'frente'}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFront ? '' : 'rotate-180'}`} />
            </button>

            {/* Card Display - Edge to edge on mobile */}
            <div
              className="relative cursor-pointer transition-transform duration-300 active:scale-[0.98]"
              onClick={() => setShowFront(!showFront)}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
                {showFront ? (
                  cardData.tipo === 'dependente' ? (
                    <DependentCard
                      nome={cardData.nome}
                      cpf={cardData.cpf}
                      registro={cardData.registro}
                      titularNome={cardData.titularNome || ''}
                    />
                  ) : (
                    <MemberCard
                      nome={cardData.nome}
                      cpf={cardData.cpf}
                      registro={cardData.registro}
                    />
                  )
                ) : (
                  cardData.tipo === 'dependente' ? (
                    <DependentCardBack
                      nome={cardData.nome}
                      cpf={cardData.cpf}
                      titularNome={cardData.titularNome || ''}
                    />
                  ) : (
                    <MemberCardBack
                      nome={cardData.nome}
                      cpf={cardData.cpf}
                    />
                  )
                )}
              </div>

              {/* Card indicator dots */}
              <div className="flex justify-center gap-2 mt-4">
                <div className={`w-2 h-2 rounded-full transition-colors ${showFront ? 'bg-white' : 'bg-white/40'}`} />
                <div className={`w-2 h-2 rounded-full transition-colors ${!showFront ? 'bg-white' : 'bg-white/40'}`} />
              </div>
            </div>
          </div>

          {/* Dependents Section */}
          {cardData.dependentes && cardData.dependentes.length > 0 && (
            <div className="mt-6 px-4">
              <h2 className="text-white/90 text-lg font-semibold mb-4 flex items-center gap-2">
                👨‍👩‍👧‍👦 Dependentes
                <span className="text-sm font-normal text-white/60">({cardData.dependentes.length})</span>
              </h2>
              <div className="space-y-4">
                {cardData.dependentes.map((dep, index) => (
                  <details key={index} className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                      <span className="text-white font-medium">{dep.nome}</span>
                      <ChevronDown className="h-5 w-5 text-white/70 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-4">
                      <div className="rounded-xl overflow-hidden shadow-lg">
                        <DependentCard
                          nome={dep.nome}
                          cpf={dep.cpf}
                          registro={dep.registro}
                          titularNome={cardData.nome}
                        />
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Hidden containers for PDF generation */}
      <div
        id="pdf-generation-container"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div id="download-card-front" style={{ width: '400px' }}>
          {cardData.tipo === 'dependente' ? (
            <DependentCard
              nome={cardData.nome}
              cpf={cardData.cpf}
              registro={cardData.registro}
              titularNome={cardData.titularNome || ''}
            />
          ) : (
            <MemberCard
              nome={cardData.nome}
              cpf={cardData.cpf}
              registro={cardData.registro}
            />
          )}
        </div>
        <div id="download-card-back" style={{ width: '400px' }}>
          {cardData.tipo === 'dependente' ? (
            <DependentCardBack
              nome={cardData.nome}
              cpf={cardData.cpf}
              titularNome={cardData.titularNome || ''}
            />
          ) : (
            <MemberCardBack
              nome={cardData.nome}
              cpf={cardData.cpf}
            />
          )}
        </div>

        {/* Dependent cards for PDF */}
        {cardData.dependentes?.map((dep, index) => (
          <div key={index}>
            <div id={`download-dep-card-front-${index}`} style={{ width: '400px' }}>
              <DependentCard
                nome={dep.nome}
                cpf={dep.cpf}
                registro={dep.registro}
                titularNome={cardData.nome}
              />
            </div>
            <div id={`download-dep-card-back-${index}`} style={{ width: '400px' }}>
              <DependentCardBack
                nome={dep.nome}
                cpf={dep.cpf}
                titularNome={cardData.nome}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Action Bar - Glass morphism */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-white/20 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto p-4 flex gap-3">
          <Button
            className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white min-h-[56px] text-base font-semibold rounded-xl shadow-lg active:scale-[0.98] transition-transform"
            onClick={handleDownloadCard}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Baixar PDF
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 min-h-[56px] text-base font-semibold rounded-xl active:scale-[0.98] transition-transform"
            onClick={() => handleShareCard('download-card-front', 'download-card-back', `carteira-${cardData.nome.replace(/\s/g, '-')}`)}
          >
            <Share2 className="mr-2 h-5 w-5" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="sm:max-w-[400px] mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Editar Perfil</DialogTitle>
            <DialogDescription>Atualize suas informações</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="min-h-[52px] rounded-xl text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="min-h-[52px] rounded-xl text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                inputMode="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="min-h-[52px] rounded-xl text-base"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowEditProfile(false)} className="flex-1 min-h-[52px] rounded-xl">
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile} className="flex-1 min-h-[52px] rounded-xl">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Dialog */}
      <Dialog open={showSupport} onOpenChange={setShowSupport}>
        <DialogContent className="sm:max-w-[400px] mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Precisa de Ajuda?</DialogTitle>
            <DialogDescription>Entre em contato conosco</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <a
              href="mailto:suporte@aura.org"
              className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors min-h-[72px]"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <HeadphonesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Email</p>
                <p className="text-sm text-slate-600">suporte@aura.org</p>
              </div>
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors min-h-[72px]"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">WhatsApp</p>
                <p className="text-sm text-slate-600">(11) 99999-9999</p>
              </div>
            </a>
          </div>
          <Button onClick={() => setShowSupport(false)} className="w-full min-h-[52px] rounded-xl">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
