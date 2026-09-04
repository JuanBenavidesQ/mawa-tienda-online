import Header from '@/components/tienda/Header'
import Hero from '@/components/tienda/Hero'
import Experiencias from '@/components/tienda/Experiencias'
import Comprar from '@/components/tienda/Comprar'
import ComoFunciona from '@/components/tienda/ComoFunciona'
import Faq from '@/components/tienda/Faq'
import Galeria from '@/components/tienda/Galeria'
import Footer from '@/components/tienda/Footer'
import WhatsAppFlotante from '@/components/tienda/WhatsAppFlotante'

export default function TiendaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Comprar />
        <Experiencias />
        <ComoFunciona />
        <Faq />
        <Galeria />
      </main>
      <Footer />
      <WhatsAppFlotante />
    </div>
  )
}
