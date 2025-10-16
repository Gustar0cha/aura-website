"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Share2, CreditCard, CheckCircle, LogOut, User, HeadphonesIcon } from "lucide-react"
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

export default function MemberCardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [memberData, setMemberData] = useState({
    name: "",
    id: "",
    validUntil: "",
    nextPayment: "",
    status: "",
  })
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

    setIsAuthenticated(true)

    // Carrega os dados do usuário
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${auth}`
          }
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar dados do usuário')
        }

        const userData = await response.json()
        setProfileData({
          name: userData.nome || '',
          email: userData.email || '',
          phone: userData.telefone || '',
          birthDate: '', // Adicionar campo na planilha se necessário
        })

        // Atualiza os dados do cartão
        setMemberData({
          name: userData.nome || '',
          id: `AURA-${userData.cpf}`,
          validUntil: '12/2024', // Adicionar na planilha
          nextPayment: '15/03/2024', // Adicionar na planilha
          status: 'Em dia', // Adicionar na planilha
        })
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        alert('Erro ao carregar seus dados. Por favor, tente novamente.')
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("aura_auth")
    router.push("/login")
  }

  const handleSaveProfile = () => {
    setShowEditProfile(false)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Olá, {memberData.name}!</h1>
            <p className="text-foreground/60">Bem-vindo(a) à sua área exclusiva de associado</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-transparent">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setShowEditProfile(true)}>
                <User className="mr-2 h-4 w-4" />
                Editar Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSupport(true)}>
                <HeadphonesIcon className="mr-2 h-4 w-4" />
                Falar com Suporte
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">AURA</h2>
                <p className="text-white/80 text-sm">Associação de Apoio</p>
              </div>
              <CreditCard className="w-10 h-10 text-white/80" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-white/70 text-sm mb-1">Nome do Associado</p>
                <p className="text-xl font-semibold">{memberData.name}</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Número do Associado</p>
                  <p className="text-lg font-semibold">{memberData.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm mb-1">Válido até</p>
                  <p className="text-lg font-semibold">{memberData.validUntil}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button variant="outline" className="bg-white hover:bg-slate-50 text-foreground border-slate-200" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Baixar Cartão
          </Button>
          <Button variant="outline" className="bg-white hover:bg-slate-50 text-foreground border-slate-200" size="lg">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Status da Anuidade</h3>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">{memberData.status}</span>
            </div>
            <p className="text-sm text-foreground/60">
              Próximo vencimento: <span className="font-medium text-foreground">{memberData.nextPayment}</span>
            </p>
          </Card>

          <Card className="bg-white p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Benefícios Exclusivos</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Apoio psicológico gratuito</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Grupos de ajuda mútua</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Eventos comunitários</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Atualize suas informações pessoais abaixo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={profileData.birthDate}
                onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditProfile(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSupport} onOpenChange={setShowSupport}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Falar com Suporte</DialogTitle>
            <DialogDescription>Entre em contato conosco através dos canais abaixo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
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
            <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <HeadphonesIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">WhatsApp</h4>
                  <p className="text-sm text-foreground/60">(11) 99999-9999</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <HeadphonesIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Telefone</h4>
                  <p className="text-sm text-foreground/60">(11) 3333-3333</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowSupport(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
