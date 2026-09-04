import Image from 'next/image'
import { GALERIA, LUGAR } from '@/lib/contenido'
import { IconoInstagram } from './Iconos'

export default function Galeria() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mawa-verde-500">Galería</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-mawa-verde-900 mt-2">Así se ve Mawá</h2>
        </div>
        <a
          href={LUGAR.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-mawa-verde-700 font-semibold hover:text-mawa-verde-900"
        >
          <IconoInstagram />
          {LUGAR.instagramUsuario}
        </a>
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {GALERIA.map((g, i) => (
          <div
            key={g.foto}
            className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-[16/9] md:col-span-2' : 'aspect-[4/3]'}`}
          >
            <Image
              src={`/fotos/${g.foto}-${i === 0 ? 1280 : 800}.webp`}
              alt={g.alt}
              fill
              sizes={i === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 50vw'}
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
