import { WHATSAPP_URL } from '@/lib/site'
import { IconoWhatsApp } from './Iconos'

export default function WhatsAppFlotante() {
  return (
    <a
      href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hola Mawá, tengo una pregunta sobre las entradas online')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-whatsapp text-white shadow-xl shadow-black/30 flex items-center justify-center hover:scale-105 transition-transform"
    >
      <IconoWhatsApp className="w-7 h-7" />
    </a>
  )
}
