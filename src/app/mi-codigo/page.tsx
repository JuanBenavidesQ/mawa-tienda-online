import type { Metadata } from 'next'
import Header from '@/components/tienda/Header'
import Footer from '@/components/tienda/Footer'
import FormularioMiCodigo from './FormularioMiCodigo'

export const metadata: Metadata = {
  title: 'Recuperar mi código',
  description: 'Si perdiste el código de tu entrada a Mawá, te lo reenviamos por WhatsApp al celular con el que compraste.',
  alternates: { canonical: '/mi-codigo' },
}

export default function MiCodigoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header solido />
      <main className="flex-1 flex items-start justify-center p-4 py-10 sm:py-16">
        <div className="bg-white rounded-3xl shadow-xl shadow-mawa-verde-900/10 p-6 sm:p-8 max-w-md w-full">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mawa-verde-500">Tienda web</p>
          <h1 className="font-display text-3xl font-bold text-mawa-verde-900 mt-2">¿Perdiste tu código?</h1>
          <p className="text-mawa-gris mt-3">
            Escribe el celular con el que hiciste la compra y te reenviamos por WhatsApp los códigos que
            aún no has usado.
          </p>
          <FormularioMiCodigo />
        </div>
      </main>
      <Footer />
    </div>
  )
}
