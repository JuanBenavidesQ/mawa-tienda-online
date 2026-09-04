import Image from 'next/image'
import { EXPERIENCIAS } from '@/lib/contenido'

export default function Experiencias() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mawa-verde-500">Qué te espera</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-mawa-verde-900 mt-2">
          Un día completo en la montaña
        </h2>
        <p className="mt-4 text-lg text-mawa-gris">
          Mawá es un centro campestre entre Ipiales y Pasto: agua, aventura, buena mesa y naturaleza en un mismo lugar.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {EXPERIENCIAS.map((e) => (
          <article key={e.titulo} className="group relative rounded-3xl overflow-hidden shadow-lg aspect-[4/3] sm:aspect-[3/2]">
            <Image
              src={`/fotos/${e.foto}-1600.webp`}
              alt={e.alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mawa-verde-950/90 via-mawa-verde-950/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="font-display text-2xl font-semibold">{e.titulo}</h3>
              <p className="mt-2 text-sm sm:text-base text-white/90 max-w-md">{e.texto}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
