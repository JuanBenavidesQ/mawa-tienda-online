import Image from 'next/image'
import Link from 'next/link'
import { LUGAR } from '@/lib/contenido'
import { WHATSAPP_URL, WHATSAPP_VISIBLE } from '@/lib/site'
import { IconoInstagram, IconoPin, IconoReloj, IconoWhatsApp } from './Iconos'

export default function Footer() {
  return (
    <footer className="bg-mawa-verde-950 text-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Image src="/brand/logo-mawa-blanco.png" alt="Mawá" width={80} height={116} className="h-24 w-auto" />
          <p className="mt-4 text-sm max-w-xs">
            Centro campestre en el corazón de la montaña nariñense. Piscinas, toboganes, puentes tibetanos, restaurante y hotel.
          </p>
        </div>
        <div className="text-sm space-y-3">
          <p className="flex items-start gap-2"><IconoPin className="w-4 h-4 mt-1 shrink-0 text-mawa-verde-400" /><span>{LUGAR.direccionLarga}</span></p>
          <p className="flex items-start gap-2"><IconoReloj className="w-4 h-4 mt-1 shrink-0 text-mawa-verde-400" /><span>{LUGAR.horario}</span></p>
          <a href={LUGAR.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block underline hover:text-white">Ver en Google Maps</a>
        </div>
        <div className="text-sm space-y-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
            <IconoWhatsApp className="w-4 h-4 text-mawa-verde-400" /> {WHATSAPP_VISIBLE}
          </a>
          <a href={LUGAR.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
            <IconoInstagram className="w-4 h-4 text-mawa-verde-400" /> {LUGAR.instagramUsuario}
          </a>
          <a href={LUGAR.sitio} target="_blank" rel="noopener noreferrer" className="block hover:text-white">www.mawa.com.co</a>
          <Link href="/mi-codigo" className="block hover:text-white">¿Perdiste tu código? Recupéralo aquí</Link>
          <Link href="/politica-datos" className="block hover:text-white">Política de tratamiento de datos</Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-white/60 flex flex-col sm:flex-row justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Mawá · {LUGAR.empresa} · NIT {LUGAR.nit}</span>
          <span>Pagos procesados por Bold</span>
        </div>
      </div>
    </footer>
  )
}
