import Image from 'next/image'
import { LUGAR } from '@/lib/contenido'
import { IconoEscudo, IconoFlecha, IconoPin, IconoReloj, IconoTicket } from './Iconos'

export default function Hero() {
  return (
    <section className="relative min-h-[680px] sm:min-h-[80vh] flex items-end text-white overflow-hidden bg-mawa-verde-950">
      <Image
        src="/fotos/hero-piscina-1280.webp"
        alt="Vista aérea de las piscinas y toboganes de Mawá entre la montaña"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_45%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-mawa-verde-950 via-mawa-verde-950/55 to-black/20" />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12 pt-32 sm:pb-20">
        <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-mawa-crema mb-4">
          <IconoPin className="w-4 h-4" />
          {LUGAR.direccionCorta}
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.05] max-w-3xl drop-shadow-lg">
          Compra tu entrada a Mawá y llega directo a la piscina
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-white/90 max-w-2xl">
          Piscinas y toboganes, puentes tibetanos y almuerzo incluido, en el corazón de la montaña nariñense.
          Comprando online tienes descuento y tu código llega por WhatsApp al instante.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
          <a
            href="#planes"
            className="inline-flex items-center justify-center gap-2 bg-mawa-gradient text-white font-bold text-lg rounded-full px-8 py-4 shadow-lg shadow-black/30 hover:brightness-110 transition"
          >
            Ver planes y comprar
            <IconoFlecha className="w-5 h-5" />
          </a>
          <span className="text-sm text-white/80 sm:ml-2">Desde $40.000 por persona</span>
        </div>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <li className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
            <IconoEscudo className="w-5 h-5 text-mawa-crema shrink-0" />
            <span>Pago seguro con Bold: tarjetas, PSE, Nequi</span>
          </li>
          <li className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
            <IconoTicket className="w-5 h-5 text-mawa-crema shrink-0" />
            <span>Código por WhatsApp, válido 30 días</span>
          </li>
          <li className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
            <IconoReloj className="w-5 h-5 text-mawa-crema shrink-0" />
            <span>Sábados, domingos y festivos, 9 a. m. a 5 p. m.</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
