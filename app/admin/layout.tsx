"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Users,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  X
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const auth = localStorage.getItem("aura_auth")
      if (!auth) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${auth}`
          }
        })

        if (!response.ok) {
          throw new Error('Não autorizado')
        }

        const userData = await response.json()
        if (userData.tipo !== 'admin') {
          router.push("/login")
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Erro na autenticação:', error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("aura_auth")
    router.push("/login")
  }

  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard
    },
    {
      href: "/admin/usuarios",
      label: "Usuários",
      icon: Users
    },
    {
      href: "/admin/carteiras",
      label: "Carteiras",
      icon: CreditCard
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="w-48">
            <img src="/logo aura 2.png" alt="Logo AURA Admin" className="w-full h-auto" />
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Header para mobile */}
      <header className="md:hidden bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="w-32">
            <img src="/logo aura 2.png" alt="Logo AURA Admin" className="w-full h-auto" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <nav className="border-t border-gray-200 bg-white">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </Button>
          </nav>
        )}
      </header>

      {/* Conteúdo principal */}
      <main className="md:pl-64 pt-[65px] md:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
