import Link from 'next/link'

export const metadata = {
  title: 'Política de Tratamiento de Datos | Mawa',
  description: 'Política de tratamiento de datos personales de Mawa',
}

export default function PoliticaDatosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-800 text-white py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/LogoMawaVerde.jpg" alt="Mawa" className="h-10 w-auto rounded" />
            <span className="font-bold text-xl">MAWA</span>
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Política de Tratamiento de Datos Personales
          </h1>

          <div className="prose prose-emerald max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                1. Responsable del Tratamiento
              </h2>
              <p>
                <strong>MAWA</strong>, identificado con NIT [Número NIT], con domicilio en
                [Dirección], es el responsable del tratamiento de los datos personales
                recolectados a través de este sitio web.
              </p>
              <p>
                <strong>Contacto:</strong> info@mawa.com.co | WhatsApp: 316 399 6541
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2. Datos que Recolectamos
              </h2>
              <p>Al realizar una compra, recolectamos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre completo</li>
                <li>Número de celular</li>
                <li>Correo electrónico (opcional)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3. Finalidad del Tratamiento
              </h2>
              <p>Sus datos personales serán utilizados para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Procesar su compra y generar su código de entrada</li>
                <li>Enviarle su código de confirmación por WhatsApp o email</li>
                <li>Contactarlo en caso de novedades con su reserva</li>
                <li>
                  Si autoriza, enviarle información sobre promociones y ofertas especiales
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                4. Derechos del Titular
              </h2>
              <p>De acuerdo con la Ley 1581 de 2012, usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Conocer, actualizar y rectificar sus datos personales</li>
                <li>Solicitar prueba de la autorización otorgada</li>
                <li>Ser informado sobre el uso que se ha dado a sus datos</li>
                <li>Revocar la autorización y/o solicitar la supresión de sus datos</li>
                <li>Acceder gratuitamente a sus datos personales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5. Autorización de Marketing
              </h2>
              <p>
                La autorización para recibir promociones y ofertas es completamente
                voluntaria. Si la otorga, podremos enviarle información comercial por
                WhatsApp o correo electrónico. Puede revocar esta autorización en
                cualquier momento escribiendo a info@mawa.com.co
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                6. Seguridad de los Datos
              </h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger
                sus datos personales contra acceso no autorizado, pérdida o alteración.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                7. Vigencia
              </h2>
              <p>
                Sus datos serán conservados mientras exista una relación comercial con
                usted y durante el tiempo necesario para cumplir con obligaciones legales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                8. Contacto
              </h2>
              <p>
                Para ejercer sus derechos o realizar consultas sobre el tratamiento de
                sus datos, puede contactarnos:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email: info@mawa.com.co</li>
                <li>WhatsApp: 316 399 6541</li>
              </ul>
            </section>

            <p className="text-sm text-gray-500 mt-8 pt-4 border-t">
              Última actualización: Febrero 2026
            </p>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a la tienda
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2026 Mawa. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
