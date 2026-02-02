'use client'

import * as htmlToImage from 'html-to-image'
import { jsPDF } from 'jspdf'

// Detecta se está em mobile
function isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export async function downloadCardAsPDF(frontId: string, backId: string, fileName: string) {
    const frontElement = document.getElementById(frontId)
    const backElement = document.getElementById(backId)

    if (!frontElement || !backElement) {
        alert('Erro: Elementos da carteira não encontrados')
        return
    }

    // Mostra loading
    const originalCursor = document.body.style.cursor
    document.body.style.cursor = 'wait'

    try {
        // Aguarda um pouco para garantir que os elementos estejam renderizados
        await new Promise(resolve => setTimeout(resolve, 300))

        // Captura as imagens em alta qualidade
        const frontImgData = await htmlToImage.toPng(frontElement, {
            quality: 1,
            pixelRatio: 3,
            backgroundColor: '#ffffff',
        })

        const backImgData = await htmlToImage.toPng(backElement, {
            quality: 1,
            pixelRatio: 3,
            backgroundColor: '#ffffff',
        })

        // Cria o PDF usando jsPDF
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        })

        // Dimensões do A4 landscape
        const pageWidth = 297
        const pageHeight = 210

        // Calcula dimensões proporcionais da carteira (85.6mm x 53.98mm - tamanho padrão cartão)
        const cardWidth = 170 // mm
        const cardHeight = cardWidth * (53.98 / 85.6) // mantém proporção

        // Centraliza na página
        const x = (pageWidth - cardWidth) / 2
        const y = (pageHeight - cardHeight) / 2

        // Adiciona título e imagem da frente
        pdf.setFontSize(16)
        pdf.setTextColor(51, 51, 51)
        pdf.text('FRENTE DA CARTEIRA', pageWidth / 2, 20, { align: 'center' })
        pdf.addImage(frontImgData, 'PNG', x, y - 10, cardWidth, cardHeight)

        // Nova página para o verso
        pdf.addPage()
        pdf.text('VERSO DA CARTEIRA', pageWidth / 2, 20, { align: 'center' })
        pdf.addImage(backImgData, 'PNG', x, y - 10, cardWidth, cardHeight)

        // Salva o PDF
        pdf.save(`${fileName}.pdf`)

        // Em mobile, feedback extra
        if (isMobile()) {
            setTimeout(() => {
                alert('✅ PDF salvo! Verifique sua pasta de Downloads.')
            }, 500)
        }

    } catch (error) {
        console.error('Erro ao gerar PDF:', error)
        alert('Erro ao gerar PDF. Tente novamente.')
    }

    document.body.style.cursor = originalCursor
}

export async function shareCard(frontId: string, backId: string, fileName: string) {
    const frontElement = document.getElementById(frontId)
    const backElement = document.getElementById(backId)

    if (!frontElement || !backElement) {
        alert('Erro: Elementos da carteira não encontrados')
        return
    }

    try {
        // Captura as imagens
        const frontImgData = await htmlToImage.toPng(frontElement, {
            quality: 1,
            pixelRatio: 3,
            backgroundColor: '#ffffff',
        })

        const backImgData = await htmlToImage.toPng(backElement, {
            quality: 1,
            pixelRatio: 3,
            backgroundColor: '#ffffff',
        })

        // Cria o PDF
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        })

        const pageWidth = 297
        const pageHeight = 210
        const cardWidth = 170
        const cardHeight = cardWidth * (53.98 / 85.6)
        const x = (pageWidth - cardWidth) / 2
        const y = (pageHeight - cardHeight) / 2

        pdf.setFontSize(16)
        pdf.setTextColor(51, 51, 51)
        pdf.text('FRENTE DA CARTEIRA', pageWidth / 2, 20, { align: 'center' })
        pdf.addImage(frontImgData, 'PNG', x, y - 10, cardWidth, cardHeight)

        pdf.addPage()
        pdf.text('VERSO DA CARTEIRA', pageWidth / 2, 20, { align: 'center' })
        pdf.addImage(backImgData, 'PNG', x, y - 10, cardWidth, cardHeight)

        // Converte PDF para blob
        const pdfBlob = pdf.output('blob')
        const pdfFile = new File([pdfBlob], `${fileName}.pdf`, { type: 'application/pdf' })

        // Tenta usar Web Share API
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
            try {
                await navigator.share({
                    files: [pdfFile],
                    title: 'Minha Carteira AURA',
                    text: 'Confira minha carteira de associado AURA',
                })
                return
            } catch (error) {
                console.log('Compartilhamento cancelado')
            }
        }

        // Fallback: baixa o PDF e abre WhatsApp
        pdf.save(`${fileName}.pdf`)
        setTimeout(() => {
            window.open(`https://wa.me/?text=Confira minha carteira AURA! Acabei de baixar o PDF.`, '_blank')
        }, 1000)

    } catch (error) {
        console.error('Erro ao compartilhar:', error)
        alert('Erro ao compartilhar. Tente novamente.')
    }
}

export function generateCardNumber(cpf: string, tipo: 'titular' | 'dependente'): string {
    const prefix = tipo === 'titular' ? 'TIT' : 'DEP'
    const cpfShort = cpf.replace(/\D/g, '').slice(-4)
    const random = Math.random().toString(36).substring(2, 4).toUpperCase()
    return `${prefix}-AURA-G-${cpfShort}${random}`
}

export function calculateExpiration(months: number = 12): string {
    const date = new Date()
    date.setMonth(date.getMonth() + months)
    return date.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })
}

export function formatCardData(userData: any) {
    return {
        nome: userData.nome || '',
        cpf: userData.cpf || '',
        registro: userData.registro || generateCardNumber(userData.cpf, userData.isDependente ? 'dependente' : 'titular'),
        validade: userData.dataValidade || calculateExpiration(),
        tipo: userData.isDependente ? 'dependente' : 'titular',
        titularNome: userData.titularNome || '',
    }
}
