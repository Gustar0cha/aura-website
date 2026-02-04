"use client"

import Image from "next/image"
import { Gift } from "lucide-react"

const cupons = [
    {
        id: 1,
        titulo: "CUPOM DE DESCONTO 10%",
        parceiro: "iFood",
        cor: "bg-red-500",
        logo: "🍔"
    },
    {
        id: 2,
        titulo: "DESCONTO EM 10,00 REAIS",
        parceiro: "Mercado",
        cor: "bg-green-500",
        logo: "🛒"
    },
]

const parceiros = [
    { nome: "DALL·E 2", logo: "🎨" },
    { nome: "stability.ai", logo: "🖼️" },
    { nome: "OpenAI", logo: "🤖" },
    { nome: "CapCut", logo: "✂️" },
    { nome: "Google AI", logo: "🔍" },
]

export default function BeneficiosPage() {
    return (
        <div className="px-4 py-6">
            {/* Header */}
            <h1 className="text-xl font-bold text-center text-gray-900 mb-6">
                Benefícios
            </h1>

            {/* Cupons Section */}
            <div className="space-y-3 mb-8">
                {cupons.map((cupom) => (
                    <div
                        key={cupom.id}
                        className="bg-[#4A90D9] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#3A7BC8] transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-white font-semibold">{cupom.titulo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white/80 text-sm">{cupom.parceiro}</span>
                            <span className="text-2xl">{cupom.logo}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Parceiros Section */}
            <div>
                <h2 className="text-center text-gray-500 text-sm mb-6">Nossos parceiros:</h2>
                <div className="space-y-4">
                    {parceiros.map((parceiro, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 py-2"
                        >
                            <span className="text-3xl">{parceiro.logo}</span>
                            <span className="text-lg font-semibold text-gray-800">{parceiro.nome}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
