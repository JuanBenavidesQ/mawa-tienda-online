import { FAQS } from '@/lib/contenido'
import { WHATSAPP_URL, WHATSAPP_VISIBLE } from '@/lib/site'
import { IconoWhatsApp } from './Iconos'

export default function Faq() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mawa-verde-500">Preguntas frecuentes</p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-mawa-verde-900 mt-2">Antes de venir</h2>

      <div className="mt-8 divide-y divide-mawa-verde-900/10 border-y border-mawa-verde-900/10">
        {FAQS.map((f) => (
          <details key={f.pregunta} className="group py-4">
            <summary className="flex items-center justify-between gap-4 cursor-pointer text-lg font-semibold text-mawa-ink">
              {f.pregunta}
              <span className="faq-icon shrink-0 w-8 h-8 rounded-full bg-mawa-crema text-mawa-verde-700 flex items-center justify-center text-xl transition-transform">
                +
              </span>
            </summary>
            <p className="mt-3 pr-12 text-mawa-gris leading-relaxed">{f.respuesta}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-3xl bg-mawa-crema p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-mawa-verde-900">¿Otra duda?</h3>
          <p className="text-mawa-gris mt-1">Escríbenos por WhatsApp y te respondemos con gusto.</p>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-[#1ebe5b] text-white font-semibold rounded-full px-6 py-3 transition-colors"
        >
          <IconoWhatsApp />
          {WHATSAPP_VISIBLE}
        </a>
      </div>
    </section>
  )
}
