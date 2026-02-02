"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Share2, LogOut, User, HeadphonesIcon, Loader2 } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
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
          birthDate: '',
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

  const handleDownloadDependentCard = async (index: number, nome: string) => {
    setIsDownloading(true)
    try {
      await downloadCardAsPDF(`download-dep-card-front-${index}`, `download-dep-card-back-${index}`, `carteira-${nome.replace(/\s/g, '-')}`)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShareCard = (frontId: string, backId: string, fileName: string) => {
    shareCard(frontId, backId, fileName)
  }

  // Loading state - Mobile optimized
  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm sm:text-base text-foreground/60">Carregando sua carteira...</p>
        </div>
      </div>
    )
  }

  // Error state - Mobile optimized
  if (!cardData) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm sm:text-base text-foreground/60">Erro ao carregar dados da carteira</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 min-h-[48px]"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50 pb-24 sm:pb-6">
      {/* Container with responsive padding */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header - Compact on mobile */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
              Olá, {cardData.nome.split(' ')[0]}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Bem-vindo(a) à sua área exclusiva</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-11 w-11 sm:h-12 sm:w-12 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 hover:border-emerald-400 hover:bg-white transition-all shadow-sm flex-shrink-0"
              >
                <User className="h-5 w-5 text-emerald-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-sm">
              <DropdownMenuItem onClick={() => setShowEditProfile(true)} className="cursor-pointer min-h-[44px]">
                <User className="mr-3 h-4 w-4" />
                Editar Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSupport(true)} className="cursor-pointer min-h-[44px]">
                <HeadphonesIcon className="mr-3 h-4 w-4" />
                Falar com Suporte
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer min-h-[44px]">
                <LogOut className="mr-3 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Card Section */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl overflow-hidden">
            <div className="p-4 sm:p-5 md:p-6">
              {/* Card header */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🎫</span>
                  Sua Carteira
                </h2>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-700">Ativa</span>
                </div>
              </div>

              {/* Tabs with optimized touch targets */}
              <Tabs defaultValue="frente" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4 bg-slate-100/80 p-1 h-11 sm:h-10">
                  <TabsTrigger
                    value="frente"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm sm:text-base min-h-[40px] sm:min-h-[36px]"
                  >
                    Frente
                  </TabsTrigger>
                  <TabsTrigger
                    value="verso"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm sm:text-base min-h-[40px] sm:min-h-[36px]"
                  >
                    Verso
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="frente" className="mt-0">
                  <div className="rounded-xl overflow-hidden shadow-lg">
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
                </TabsContent>
                <TabsContent value="verso" className="mt-0">
                  <div className="rounded-xl overflow-hidden shadow-lg">
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
                </TabsContent>
              </Tabs>

              {/* Hidden area for PDF generation */}
              <div
                id="pdf-generation-container"
                style={{
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  zIndex: -10,
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
              </div>

              {/* Desktop action buttons */}
              <div className="hidden sm:grid grid-cols-2 gap-3 mt-4">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all min-h-[48px]"
                  size="lg"
                  onClick={handleDownloadCard}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {isDownloading ? 'Gerando PDF...' : 'Baixar PDF'}
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/50 hover:bg-white border-2 border-emerald-200 hover:border-emerald-400 text-emerald-700 shadow-sm hover:shadow-md transition-all min-h-[48px]"
                  size="lg"
                  onClick={() => handleShareCard('download-card-front', 'download-card-back', `carteira-${cardData.nome.replace(/\s/g, '-')}`)}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </Card>

          {/* Dependent Cards Section */}
          {cardData.dependentes && cardData.dependentes.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl overflow-hidden">
              <div className="p-4 sm:p-5 md:p-6">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <span className="text-xl sm:text-2xl">👨‍👩‍👧‍👦</span>
                  Carteiras de Dependentes
                </h2>
                <div className="space-y-6">
                  {cardData.dependentes.map((dependente, index) => (
                    <div key={index} className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
                      <h3 className="text-sm sm:text-base font-medium mb-3">{dependente.nome}</h3>
                      <Tabs defaultValue={`dep-frente-${index}`} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-3 h-10">
                          <TabsTrigger value={`dep-frente-${index}`} className="min-h-[36px]">Frente</TabsTrigger>
                          <TabsTrigger value={`dep-verso-${index}`} className="min-h-[36px]">Verso</TabsTrigger>
                        </TabsList>
                        <TabsContent value={`dep-frente-${index}`}>
                          <div className="rounded-xl overflow-hidden shadow-lg">
                            <DependentCard
                              nome={dependente.nome}
                              cpf={dependente.cpf}
                              registro={dependente.registro}
                              titularNome={cardData.nome}
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value={`dep-verso-${index}`}>
                          <div className="rounded-xl overflow-hidden shadow-lg">
                            <DependentCardBack
                              nome={dependente.nome}
                              cpf={dependente.cpf}
                              titularNome={cardData.nome}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      {/* Hidden for PDF download */}
                      <div
                        style={{
                          position: 'fixed',
                          left: 0,
                          top: 0,
                          zIndex: -10,
                          opacity: 0,
                          pointerEvents: 'none',
                        }}
                      >
                        <div id={`download-dep-card-front-${index}`} style={{ width: '400px' }}>
                          <DependentCard
                            nome={dependente.nome}
                            cpf={dependente.cpf}
                            registro={dependente.registro}
                            titularNome={cardData.nome}
                          />
                        </div>
                        <div id={`download-dep-card-back-${index}`} style={{ width: '400px' }}>
                          <DependentCardBack
                            nome={dependente.nome}
                            cpf={dependente.cpf}
                            titularNome={cardData.nome}
                          />
                        </div>
                      </div>

                      {/* Dependent action buttons - hidden on mobile */}
                      <div className="hidden sm:grid grid-cols-2 gap-3 mt-3">
                        <Button
                          variant="outline"
                          className="bg-white hover:bg-slate-50 text-foreground border-slate-200 min-h-[44px]"
                          onClick={() => handleDownloadDependentCard(index, dependente.nome)}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="mr-2 h-4 w-4" />
                          )}
                          Baixar PDF
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-white hover:bg-slate-50 text-foreground border-slate-200 min-h-[44px]"
                          onClick={() => handleShareCard(`download-dep-card-front-${index}`, `download-dep-card-back-${index}`, `carteira-${dependente.nome.replace(/\s/g, '-')}`)}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Compartilhar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
          <DialogContent className="sm:max-w-[500px] mx-4">
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
              <DialogDescription>Atualize suas informações pessoais</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="min-h-[48px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="min-h-[48px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="min-h-[48px]"
                />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditProfile(false)} className="min-h-[48px]">
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile} className="min-h-[48px]">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Support Dialog */}
        <Dialog open={showSupport} onOpenChange={setShowSupport}>
          <DialogContent className="sm:max-w-[500px] mx-4">
            <DialogHeader>
              <DialogTitle>Falar com Suporte</DialogTitle>
              <DialogDescription>Entre em contato conosco</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <a href="mailto:suporte@aura.org" className="block">
                <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer min-h-[72px] flex items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <HeadphonesIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-sm text-foreground/60">suporte@aura.org</p>
                    </div>
                  </div>
                </Card>
              </a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="block">
                <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer min-h-[72px] flex items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <HeadphonesIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">WhatsApp</h4>
                      <p className="text-sm text-foreground/60">(11) 99999-9999</p>
                    </div>
                  </div>
                </Card>
              </a>
            </div>
            <Button onClick={() => setShowSupport(false)} className="w-full min-h-[48px]">Fechar</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 safe-area-inset-bottom">
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          <Button
            className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white min-h-[52px] text-base font-semibold active:scale-[0.98] transition-transform"
            onClick={handleDownloadCard}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Download className="mr-2 h-5 w-5" />
            )}
            {isDownloading ? 'Gerando...' : 'Baixar PDF'}
          </Button>
          <Button
            variant="outline"
            className="border-2 border-emerald-300 text-emerald-700 min-h-[52px] text-base font-semibold active:scale-[0.98] transition-transform"
            onClick={() => handleShareCard('download-card-front', 'download-card-back', `carteira-${cardData.nome.replace(/\s/g, '-')}`)}
          >
            <Share2 className="mr-2 h-5 w-5" />
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  )
}
