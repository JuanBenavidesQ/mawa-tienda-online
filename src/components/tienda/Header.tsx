import Link from 'next/link'
import Image from 'next/image'
import { LUGAR } from '@/lib/contenido'
import { WHATSAPP_URL } from '@/lib/site'
import { IconoWhatsApp } from './Iconos'

type Props = { solido?: boolean }

/**
 * Barra superior. Sobre el hero va transparente (logo blanco); en páginas
 * interiores va sólida en verde oscuro.
 */
export default function Header({ solido = false }: Props) {
  return (
    <header
      className={`${solido ? 'bg-mawa-verde-900' : 'absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/50 to-transparent'} text-white`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Mawá, inicio">
          <Image src="/brand/logo-mawa-blanco.png" alt="Mawá" width={44} height={64} className="h-11 sm:h-14 w-auto" priority />
          <span className="hidden sm:block leading-tight">
            <span className="font-display text-xl font-semibold">Mawá</span>
            <span className="block text-xs text-white/80">{LUGAR.eslogan}</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-semibold">
          <Link href="/#faq" className="hidden sm:inline hover:text-mawa-crema transition-colors">Preguntas</Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
            className="inline-flex items-center gap-2 bg-whatsapp hover:bg-[#1ebe5b] text-white rounded-full p-2.5 sm:px-4 sm:py-2 transition-colors shadow"
          >
            <IconoWhatsApp className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <Link
            href="/#planes"
            className="inline-flex items-center gap-2 bg-mawa-gradient text-white rounded-full px-4 py-2 sm:px-5 shadow hover:brightness-110 transition"
          >
            Comprar entradas
          </Link>
        </nav>
      </div>
    </header>
  )
}
