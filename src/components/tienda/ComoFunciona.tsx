import { PASOS } from '@/lib/contenido'

export default function ComoFunciona() {
  return (
    <section className="bg-mawa-verde-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mawa-verde-400">Cómo funciona</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">Tres pasos y listo</h2>
        <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {PASOS.map((paso, i) => (
            <li key={paso.titulo} className="relative">
              <span className="font-display text-5xl font-bold text-mawa-gradient">{i + 1}</span>
              <h3 className="mt-3 text-xl font-bold">{paso.titulo}</h3>
              <p className="mt-2 text-white/80">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
