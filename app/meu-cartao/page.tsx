"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Share2, Loader2, Copy, Check } from "lucide-react"
import { MemberCard } from "@/components/member-card"
import { DependentCard } from "@/components/dependent-card"
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

export default function MeuCartaoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [copied, setCopied] = useState(false)

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
        console.error('Erro ao carregar dados:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCardData()
  }, [router])

  const handleDownload = async () => {
    if (!cardData) return
    setIsDownloading(true)
    try {
      await downloadCardAsPDF('download-card-front', 'download-card-back', `carteira-${cardData.nome.replace(/\s/g, '-')}`)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = () => {
    if (!cardData) return
    shareCard('download-card-front', 'download-card-back', `carteira-${cardData.nome.replace(/\s/g, '-')}`)
  }

  const handleCopy = () => {
    if (!cardData) return
    navigator.clipboard.writeText(cardData.registro)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A90D9]" />
        <p className="mt-4 text-gray-500">Carregando sua carteira...</p>
      </div>
    )
  }

  // Error
  if (!cardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <p className="text-gray-500 mb-4">Erro ao carregar carteira</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <h1 className="text-xl font-bold text-center text-gray-900 mb-6">
        Sua Carteira
      </h1>

      {/* Greeting */}
      <p className="text-center text-gray-600 mb-6">
        Olá, <span className="font-semibold">{cardData.nome.split(' ')[0]}</span>!<br />
        aqui está sua carteira virtual!
      </p>

      {/* Card Display */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-[320px]">
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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center mb-8 px-4">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 max-w-[150px] bg-[#4A90D9] hover:bg-[#3A7BC8] text-white rounded-full h-11"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isDownloading ? 'Gerando...' : 'Baixar PDF'}
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 max-w-[150px] border-[#4A90D9] text-[#4A90D9] hover:bg-[#4A90D9]/10 rounded-full h-11"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </div>

      {/* Info Cards */}
      <div className="space-y-3 px-2">
        {/* Código */}
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Código</p>
            <p className="font-bold text-gray-900">{cardData.registro}</p>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Copy className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Validade */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-0.5">Validade</p>
          <p className="font-bold text-gray-900">{cardData.validade}</p>
        </div>

        {/* Tipo */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-0.5">Tipo</p>
          <p className="font-bold text-gray-900 uppercase">{cardData.tipo}</p>
        </div>
      </div>

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
          {/* Back of card would go here */}
        </div>
      </div>
    </div>
  )
}
