"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Shield, HelpCircle, MessageCircle, ChevronRight, LogOut, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserData {
    nome: string
    cpf: string
    tipo: string
}

const menuItems = [
    {
        section: "MINHA CONTA",
        items: [
            { icon: User, label: "Meu perfil", sublabel: "Editar informações Pessoais", href: "#" },
            { icon: Shield, label: "Privacidade", sublabel: "Controles e segurança", href: "#" },
        ]
    },
    {
        section: "SUPORTE",
        items: [
            { icon: HelpCircle, label: "Central de ajuda", sublabel: "FAQ e tutoriais", href: "#" },
            { icon: MessageCircle, label: "Contato", sublabel: "Falar com suporte", href: "#" },
        ]
    }
]

export default function ConfiguracoesPage() {
    const router = useRouter()
    const [userData, setUserData] = useState<UserData | null>(null)
    const [showProfile, setShowProfile] = useState(false)
    const [profileForm, setProfileForm] = useState({ nome: "", email: "", telefone: "" })

    useEffect(() => {
        const auth = localStorage.getItem("aura_auth")
        if (!auth) {
            router.push("/login")
            return
        }

        const fetchData = async () => {
            try {
                const response = await fetch('/api/carteira', {
                    headers: { 'Authorization': `Bearer ${auth}` }
                })
                if (response.ok) {
                    const data = await response.json()
                    setUserData({ nome: data.nome, cpf: data.cpf, tipo: data.tipo })
                    setProfileForm({ nome: data.nome, email: "", telefone: "" })
                }
            } catch (error) {
                console.error('Erro:', error)
            }
        }

        fetchData()
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("aura_auth")
        router.push("/login")
    }

    const handleMenuItem = (label: string) => {
        if (label === "Meu perfil") {
            setShowProfile(true)
        }
    }

    return (
        <div className="px-4 py-6">
            {/* Header */}
            <h1 className="text-xl font-bold text-center text-gray-900 mb-6">
                Configurações
            </h1>

            {/* Profile Card */}
            {userData && (
                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold">
                        {userData.nome.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-gray-900">{userData.nome.split(' ')[0]} {userData.nome.split(' ').slice(-1)}</h2>
                            <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="h-3 w-3" /> Verificado
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 capitalize">{userData.tipo}</p>
                    </div>
                </div>
            )}

            {/* Menu Sections */}
            <div className="space-y-6">
                {menuItems.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        <p className="text-xs text-gray-400 font-semibold mb-3 tracking-wide">
                            {section.section}
                        </p>
                        <div className="space-y-1">
                            {section.items.map((item, itemIndex) => {
                                const Icon = item.icon
                                return (
                                    <button
                                        key={itemIndex}
                                        onClick={() => handleMenuItem(item.label)}
                                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Icon className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.sublabel}</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout Button */}
            <div className="mt-8">
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair da conta
                </Button>
            </div>

            {/* Profile Dialog */}
            <Dialog open={showProfile} onOpenChange={setShowProfile}>
                <DialogContent className="sm:max-w-[400px] mx-4 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Meu Perfil</DialogTitle>
                        <DialogDescription>Edite suas informações pessoais</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nome</Label>
                            <Input
                                value={profileForm.nome}
                                onChange={(e) => setProfileForm({ ...profileForm, nome: e.target.value })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Telefone</Label>
                            <Input
                                inputMode="tel"
                                value={profileForm.telefone}
                                onChange={(e) => setProfileForm({ ...profileForm, telefone: e.target.value })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setShowProfile(false)} className="flex-1 h-12 rounded-xl">
                            Cancelar
                        </Button>
                        <Button onClick={() => setShowProfile(false)} className="flex-1 h-12 rounded-xl bg-[#4A90D9] hover:bg-[#3A7BC8]">
                            Salvar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
