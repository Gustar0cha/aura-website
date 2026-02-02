import React from 'react'

interface MemberCardProps {
  nome: string
  cpf: string
  registro: string
  className?: string
}

export function MemberCard({ nome, cpf, registro, className = '' }: MemberCardProps) {
  return (
    <div className={`relative w-full max-w-[654px] aspect-[327/208] ${className}`}>
      {/* SVG Background da Carteira do Titular */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 327 208" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <mask id="mask0_319_38" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="327" height="208">
          <rect width="327" height="208" rx="16" fill="url(#paint0_linear_319_38)"/>
        </mask>
        <g mask="url(#mask0_319_38)">
          <rect x="-16" y="-9" width="373" height="234" fill="white"/>
          <path d="M356.473 148C356.473 232.5 266.034 301 154.473 301C42.9114 301 -46.0654 251 -46.0654 166.5C-131.96 -72.5 215.5 304.5 392 28C290.5 225 356.473 63.5004 356.473 148Z" fill="#B3EFB1"/>
          <path d="M378.894 206C378.894 290.5 288.456 359 176.894 359C65.3328 359 -25.1057 290.5 -25.1057 206C-111 -33 165 340.5 341.5 64C458.106 91.5 378.894 121.5 378.894 206Z" fill="#B3EFB1"/>
          <path d="M378.894 206C378.894 290.5 288.456 359 176.894 359C65.3328 359 -25.1057 290.5 -25.1057 206C-111 -33 165 340.5 341.5 64C458.106 91.5 378.894 121.5 378.894 206Z" fill="#B3EFB1"/>
          <path d="M364.253 186.5C364.253 271 273.815 339.5 162.253 339.5C50.6918 339.5 -46.0002 233.5 -46.0002 149C-131.894 -89.9999 192 352 368.5 75.5001C485.106 103 364.253 102 364.253 186.5Z" fill="#FFF0B2"/>
          <path d="M378.894 206C378.894 290.5 288.456 359 176.894 359C65.3328 359 -25.1057 290.5 -25.1057 206C-111 -33 165 340.5 341.5 64C458.106 91.5 378.894 121.5 378.894 206Z" fill="#7DAFDD"/>
        </g>
        <defs>
          <linearGradient id="paint0_linear_319_38" x1="0" y1="0" x2="327" y2="208" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DD9AC3"/>
            <stop offset="0.487531" stopColor="#FFF0B2"/>
            <stop offset="1" stopColor="#BFDEB1"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Conteúdo Dinâmico Sobreposto */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[#7DAFDD] text-lg md:text-xl font-bold mb-0.5">CARTEIRA DO ASSOCIADO</h2>
            <p className="text-[#333] text-[10px] md:text-xs leading-tight max-w-[200px]">
              ASSOCIAÇÃO DOS EMPREGADOS DA UNIDADE<br />
              DE CONCETRADO DE URÂNIO DE CAETITÉ
            </p>
          </div>
          <img 
            src="/logo aura.png" 
            alt="AURA Logo" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white text-sm md:text-base font-bold tracking-wider drop-shadow-md">
            REGISTRO Nº : {registro}
          </p>
        </div>
      </div>
    </div>
  )
}

// Verso da Carteira do Titular
export function MemberCardBack({ nome, cpf, className = '' }: Omit<MemberCardProps, 'registro'>) {
  const formatCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '')
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.XXX-XX')
  }

  return (
    <div className={`relative w-full max-w-[654px] aspect-[327/208] ${className}`}>
      {/* SVG Background (mesmo do frente) */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 327 208" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <mask id="mask0_back" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="327" height="208">
          <rect width="327" height="208" rx="16" fill="url(#paint0_linear_back)"/>
        </mask>
        <g mask="url(#mask0_back)">
          <rect x="-16" y="-9" width="373" height="234" fill="white"/>
          <path d="M356.473 148C356.473 232.5 266.034 301 154.473 301C42.9114 301 -46.0654 251 -46.0654 166.5C-131.96 -72.5 215.5 304.5 392 28C290.5 225 356.473 63.5004 356.473 148Z" fill="#B3EFB1"/>
          <path d="M378.894 206C378.894 290.5 288.456 359 176.894 359C65.3328 359 -25.1057 290.5 -25.1057 206C-111 -33 165 340.5 341.5 64C458.106 91.5 378.894 121.5 378.894 206Z" fill="#B3EFB1"/>
          <path d="M378.894 206C378.894 290.5 288.456 359 176.894 359C65.3328 359 -25.1057 290.5 -25.1057 206C-111 -33 165 340.5 341.5 64C458.106 91.5 378.894 121.5 378.894 206Z" fill="#B3EFB1"/>
          <path d="M364.253 186.5C364.253 271 273.815 339.5 162.253 339.5C50.6918 339.5 -46.0002 233.5 -46.0002 149C-131.894 -89.9999 192 352 368.5 75.5001C485.106 103 364.253 102 364.253 186.5Z" fill="#FFF0B2"/>
          <path d="M378.894 206C378.894 290.5 288.456 359 176.894 359C65.3328 359 -25.1057 290.5 -25.1057 206C-111 -33 165 340.5 341.5 64C458.106 91.5 378.894 121.5 378.894 206Z" fill="#7DAFDD"/>
        </g>
        <defs>
          <linearGradient id="paint0_linear_back" x1="0" y1="0" x2="327" y2="208" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DD9AC3"/>
            <stop offset="0.487531" stopColor="#FFF0B2"/>
            <stop offset="1" stopColor="#BFDEB1"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Conteúdo do Verso */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        {/* Header com Logo */}
        <div className="flex justify-end">
          <img 
            src="/logo aura.png" 
            alt="AURA Logo" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>

        {/* Informações Centrais */}
        <div className="flex-1 flex flex-col justify-center space-y-3 text-[#333]">
          <div>
            <p className="text-xs md:text-sm font-bold">TITULAR: {nome.toUpperCase()}</p>
            <p className="text-xs md:text-sm font-bold">CPF: {formatCPF(cpf)}</p>
          </div>
          
          <div className="text-[10px] md:text-xs leading-relaxed space-y-1 bg-white/60 p-3 rounded-lg">
            <p className="font-semibold">Este cartão é pessoal e intransferível.</p>
            <p>Em caso de roubo ou extravio, favor comunicar imediatamente a associação pertencente.</p>
            <p className="font-semibold text-green-700">O associado gozará dos benefícios de todos os parceiros vinculados à AURA.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs md:text-sm font-bold text-[#333] bg-[#B3EFB1] py-1 px-3 rounded-full inline-block">
            Carimbo da AURA
          </p>
        </div>
      </div>
    </div>
  )
}
