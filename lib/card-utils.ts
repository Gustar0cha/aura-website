'use client'

import * as htmlToImage from 'html-to-image'

export async function downloadCardAsPDF(frontId: string, backId: string, fileName: string) {
    // 1. Abre a janela IMEDIATAMENTE para evitar bloqueio de pop-up
    const printWindow = window.open('', '_blank', 'width=800,height=600')

    if (!printWindow) {
        alert('Por favor, permita pop-ups para baixar o PDF')
        return
    }

    try {
        // Feedback na janela enquanto processa
        printWindow.document.write(`
            <html>
                <head><title>Gerando PDF...</title></head>
                <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f0f4f8;">
                    <div style="background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center;">
                        <h1 style="color: #1e293b; margin-bottom: 16px;">🎴 Gerando sua carteira...</h1>
                        <p style="color: #64748b;">Por favor aguarde um momento.</p>
                        <div style="margin-top: 24px; width: 200px; height: 4px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                            <div style="width: 30%; height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); animation: loading 1.5s ease-in-out infinite;"></div>
                        </div>
                    </div>
                    <style>
                        @keyframes loading {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(400%); }
                        }
                    </style>
                </body>
            </html>
        `)

        // Aguarda renderização
        await new Promise(resolve => setTimeout(resolve, 300))

        const frontElement = document.getElementById(frontId)
        const backElement = document.getElementById(backId)

        if (!frontElement || !backElement) {
            printWindow.close()
            alert('Erro: Elementos da carteira não encontrados (' + frontId + ', ' + backId + ')')
            return
        }

        // Mostra feedback no cursor principal
        const originalCursor = document.body.style.cursor
        document.body.style.cursor = 'wait'

        try {
            // Captura as imagens usando html-to-image (melhor suporte CSS moderno)
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

            // Monta o HTML final para impressão
            printWindow.document.open()
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${fileName}</title>
                    <style>
                        @page {
                            size: A4 landscape;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            background: #f0f0f0;
                            font-family: Arial, sans-serif;
                        }
                        .page {
                            width: 100vw;
                            height: 100vh;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            page-break-after: always;
                            background: white;
                        }
                        .page:last-child {
                            page-break-after: auto;
                        }
                        .card-label {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                            margin-bottom: 20px;
                            text-transform: uppercase;
                        }
                        img {
                            max-width: 90%;
                            max-height: 80vh;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                            border-radius: 12px;
                        }
                        @media print {
                            body { background: white; }
                            img { box-shadow: none; border: 1px solid #ddd; }
                        }
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
                            setTimeout(function() {
                                window.print();
                            }, 500);
                        }
                    </script>
                </body>
                </html>
            `)
            printWindow.document.close()

        } catch (captureError) {
            console.error('Erro ao capturar imagens:', captureError)
            printWindow.close()
            alert('Erro ao capturar carteira. Tente atualizar a página e tentar novamente.')
        }

        document.body.style.cursor = originalCursor

    } catch (error) {
        printWindow.close()
        console.error('Erro ao gerar PDF:', error)
        alert('Erro ao gerar PDF. Por favor, tente novamente.')
        document.body.style.cursor = 'default'
    }
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
