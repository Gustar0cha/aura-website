'use client'

import * as htmlToImage from 'html-to-image'

// Detecta se está em mobile
function isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Download direto de imagem (mobile-friendly)
async function downloadImage(dataUrl: string, fileName: string) {
    const link = document.createElement('a')
    link.download = fileName
    link.href = dataUrl
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

        // MOBILE: Download direto das imagens
        if (isMobile()) {
            // Tenta usar Web Share API se disponível
            if (navigator.share && navigator.canShare) {
                try {
                    const frontBlob = await (await fetch(frontImgData)).blob()
                    const backBlob = await (await fetch(backImgData)).blob()

                    const frontFile = new File([frontBlob], `${fileName}-frente.png`, { type: 'image/png' })
                    const backFile = new File([backBlob], `${fileName}-verso.png`, { type: 'image/png' })

                    if (navigator.canShare({ files: [frontFile, backFile] })) {
                        await navigator.share({
                            files: [frontFile, backFile],
                            title: 'Carteira AURA',
                            text: 'Minha carteira de associado AURA (frente e verso)',
                        })
                        document.body.style.cursor = originalCursor
                        return
                    }
                } catch (shareError) {
                    console.log('Share API falhou, usando download direto')
                }
            }

            // Fallback: Download direto das imagens
            await downloadImage(frontImgData, `${fileName}-frente.png`)
            await new Promise(resolve => setTimeout(resolve, 500))
            await downloadImage(backImgData, `${fileName}-verso.png`)

            alert('✅ Imagens salvas! Verifique sua pasta de Downloads.')
            document.body.style.cursor = originalCursor
            return
        }

        // DESKTOP: Abre janela de impressão/PDF
        const printWindow = window.open('', '_blank', 'width=800,height=600')

        if (!printWindow) {
            // Fallback para download direto se popup bloqueado
            await downloadImage(frontImgData, `${fileName}-frente.png`)
            await downloadImage(backImgData, `${fileName}-verso.png`)
            alert('Pop-up bloqueado. Imagens salvas como PNG.')
            document.body.style.cursor = originalCursor
            return
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${fileName}</title>
                <style>
                    @page { size: A4 landscape; margin: 0; }
                    body { margin: 0; padding: 0; background: #f0f0f0; font-family: Arial, sans-serif; }
                    .page {
                        width: 100vw; height: 100vh;
                        display: flex; flex-direction: column;
                        align-items: center; justify-content: center;
                        page-break-after: always; background: white;
                    }
                    .page:last-child { page-break-after: auto; }
                    .card-label { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px; text-transform: uppercase; }
                    img { max-width: 90%; max-height: 80vh; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 12px; }
                    @media print { body { background: white; } img { box-shadow: none; border: 1px solid #ddd; } }
                </style>
            </head>
            <body>
                <div class="page">
                    <div class="card-label">Frente da Carteira</div>
                    <img src="${frontImgData}" alt="Frente" />
                </div>
                <div class="page">
                    <div class="card-label">Verso da Carteira</div>
                    <img src="${backImgData}" alt="Verso" />
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() { window.print(); }, 500);
                    }
                </script>
            </body>
            </html>
        `)
        printWindow.document.close()

    } catch (error) {
        console.error('Erro ao gerar carteira:', error)
        alert('Erro ao gerar carteira. Tente novamente.')
    }

    document.body.style.cursor = originalCursor
}

export async function shareCard(elementId: string, fileName: string) {
    const element = document.getElementById(elementId)
    if (!element) {
        console.error('Elemento não encontrado')
        return
    }

    try {
        const dataUrl = await htmlToImage.toPng(element, {
            quality: 1,
            pixelRatio: 3,
        })

        // Converte data URL para blob
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const file = new File([blob], `${fileName}.png`, { type: 'image/png' })

        if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Minha Carteira AURA',
                    text: 'Confira minha carteira de associado AURA',
                })
            } catch (error) {
                console.error('Erro ao compartilhar:', error)
            }
        } else {
            // Fallback para WhatsApp Web
            window.open(`https://wa.me/?text=Confira minha carteira AURA`, '_blank')
        }
    } catch (error) {
        console.error('Erro ao compartilhar:', error)
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
