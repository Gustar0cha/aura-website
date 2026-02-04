"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Gift, Settings } from "lucide-react"

const tabs = [
    { href: "/meu-cartao", label: "Home", icon: Home },
    { href: "/meu-cartao/beneficios", label: "Benefícios", icon: Gift },
    { href: "/meu-cartao/configuracoes", label: "Configurações", icon: Settings },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
            <div className="max-w-lg mx-auto flex justify-around items-center h-16">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href ||
                        (tab.href !== "/meu-cartao" && pathname.startsWith(tab.href))
                    const Icon = tab.icon

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[56px] transition-colors ${isActive
                                    ? "text-[#4A90D9]"
                                    : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <Icon className={`h-6 w-6 ${isActive ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
                            <span className={`text-xs mt-1 ${isActive ? "font-semibold" : "font-normal"}`}>
                                {tab.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
