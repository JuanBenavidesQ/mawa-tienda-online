import Link from 'next/link'

export const metadata = {
  title: 'Política de Tratamiento de Datos | Mawa',
  description: 'Política de tratamiento y protección de datos personales de MAXIMIZA S.A.S. (Mawá)',
}

export default function PoliticaDatosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-800 text-white py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/LogoMawaVerde.jpg" alt="Mawa" className="h-10 w-auto rounded" />
            <span className="font-bold text-xl">MAWÁ</span>
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Encabezado del documento */}
          <div className="text-center mb-8 pb-6 border-b">
            <p className="text-gray-600 font-medium">MAXIMIZA S.A.S.</p>
            <p className="text-gray-500">NIT 900.490.382-4</p>
            <p className="text-gray-500">Nombre comercial: Mawá</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              POLÍTICA DE TRATAMIENTO Y PROTECCIÓN DE DATOS PERSONALES
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              En cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto Reglamentario 1377 de 2013 y demás normas concordantes
            </p>
            <p className="text-sm text-emerald-600 mt-4">www.mawa.com.co</p>
            <p className="text-sm text-gray-500">Fecha de entrada en vigencia: febrero de 2026</p>
            <p className="text-sm text-gray-500">Versión 1.0</p>
          </div>

          <div className="prose prose-emerald max-w-none text-gray-700 space-y-6">
            {/* Sección 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                1. IDENTIFICACIÓN DEL RESPONSABLE DEL TRATAMIENTO
              </h2>
              <p>
                MAXIMIZA S.A.S., sociedad comercial identificada con NIT 900.490.382-4, que opera bajo el nombre comercial Mawá, es la persona jurídica responsable del tratamiento de los datos personales recolectados a través de sus canales físicos y digitales.
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full border border-gray-200 text-sm">
                  <tbody>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Razón social</td><td className="px-4 py-2">MAXIMIZA S.A.S.</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">NIT</td><td className="px-4 py-2">900.490.382-4</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Nombre comercial</td><td className="px-4 py-2">Mawá</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Domicilio</td><td className="px-4 py-2">Km. 37,5 Vía Ipiales - Pasto</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Ciudad / Departamento</td><td className="px-4 py-2">Iles, Nariño</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Teléfono</td><td className="px-4 py-2">3163996541</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Correo electrónico de contacto</td><td className="px-4 py-2">eventos@mawa.com.co</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Correo para PQR de datos</td><td className="px-4 py-2">contacto@mawa.com.co</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Sitio web</td><td className="px-4 py-2">www.mawa.com.co</td></tr>
                    <tr><td className="px-4 py-2 font-medium bg-gray-50">Actividad económica</td><td className="px-4 py-2">Servicios de hotel, restaurante y actividades de recreación</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sección 2 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2. MARCO LEGAL
              </h2>
              <p>La presente política se rige por la normatividad colombiana vigente en materia de protección de datos personales, principalmente:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Artículo 15 de la Constitución Política de Colombia (derecho al habeas data).</li>
                <li>Ley Estatutaria 1581 de 2012 (Régimen General de Protección de Datos Personales).</li>
                <li>Decreto Reglamentario 1377 de 2013 (compilado en el Decreto Único 1074 de 2015).</li>
                <li>Decreto 886 de 2014 (Registro Nacional de Bases de Datos).</li>
                <li>Decreto 090 de 2018 (modificación del ámbito de aplicación del RNBD).</li>
                <li>Sentencias de la Corte Constitucional y circulares de la Superintendencia de Industria y Comercio (SIC) aplicables.</li>
                <li>Guía sobre Protección de Datos Personales en Sistemas de Videovigilancia, expedida por la SIC.</li>
              </ul>
            </section>

            {/* Sección 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3. DEFINICIONES
              </h2>
              <p>Para efectos de la presente política, se adoptan las siguientes definiciones conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Dato personal:</strong> Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.</li>
                <li><strong>Dato público:</strong> Dato que la ley o la Constitución han determinado como público y cuya recopilación no requiere autorización del titular (por ejemplo, nombre, profesión, estado civil).</li>
                <li><strong>Dato semiprivado:</strong> Dato que no tiene naturaleza íntima, reservada ni pública, y cuyo conocimiento interesa no solo al titular sino a cierto sector o grupo (por ejemplo, información financiera y crediticia).</li>
                <li><strong>Dato privado:</strong> Dato que por su naturaleza íntima o reservada solo es relevante para el titular (por ejemplo, dirección de residencia, teléfono personal).</li>
                <li><strong>Dato sensible:</strong> Dato que afecta la intimidad del titular o cuyo uso indebido puede generar discriminación (por ejemplo, origen racial, convicciones religiosas, datos de salud, orientacion sexual, datos biométricos).</li>
                <li><strong>Titular:</strong> Persona natural cuyos datos personales sean objeto de tratamiento.</li>
                <li><strong>Responsable del tratamiento:</strong> Persona natural o jurídica que decide sobre la base de datos y/o el tratamiento de los datos. Para efectos de esta política, MAXIMIZA S.A.S.</li>
                <li><strong>Encargado del tratamiento:</strong> Persona natural o jurídica que realiza el tratamiento de datos personales por cuenta del responsable.</li>
                <li><strong>Tratamiento:</strong> Cualquier operación o conjunto de operaciones sobre datos personales, tales como la recolección, almacenamiento, uso, circulación o supresión.</li>
                <li><strong>Autorización:</strong> Consentimiento previo, expreso e informado del titular para llevar a cabo el tratamiento de sus datos personales.</li>
                <li><strong>Aviso de privacidad:</strong> Comunicación verbal o escrita dirigida al titular para informarle sobre la existencia de las políticas de tratamiento que le serán aplicables y la forma de acceder a ellas.</li>
                <li><strong>Base de datos:</strong> Conjunto organizado de datos personales que sea objeto de tratamiento.</li>
                <li><strong>Transferencia:</strong> Envío de datos personales por el responsable a un tercero (otro responsable) dentro o fuera de Colombia.</li>
                <li><strong>Transmisión:</strong> Comunicación de datos personales por el responsable al encargado, dentro o fuera de Colombia, para que este realice el tratamiento por cuenta del responsable.</li>
              </ul>
            </section>

            {/* Sección 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                4. PRINCIPIOS RECTORES DEL TRATAMIENTO
              </h2>
              <p>MAXIMIZA S.A.S. aplicará los siguientes principios en el tratamiento de datos personales, conforme al artículo 4 de la Ley 1581 de 2012:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Principio de legalidad:</strong> El tratamiento es una actividad reglada que debe sujetarse a la ley y demás disposiciones que la desarrollen.</li>
                <li><strong>Principio de finalidad:</strong> El tratamiento debe obedecer a una finalidad legítima, la cual debe ser informada al titular.</li>
                <li><strong>Principio de libertad:</strong> El tratamiento solo puede ejercerse con el consentimiento previo, expreso e informado del titular.</li>
                <li><strong>Principio de veracidad o calidad:</strong> La información sujeta a tratamiento debe ser veraz, completa, exacta, actualizada y comprobable.</li>
                <li><strong>Principio de transparencia:</strong> En el tratamiento debe garantizarse el derecho del titular a obtener información acerca de la existencia de datos que le conciernan.</li>
                <li><strong>Principio de acceso y circulación restringida:</strong> El tratamiento solo podrá hacerse por las personas autorizadas por el titular y/o por las previstas en la ley.</li>
                <li><strong>Principio de seguridad:</strong> La información sujeta a tratamiento se deberá manejar con las medidas técnicas, humanas y administrativas necesarias para otorgar seguridad a los registros.</li>
                <li><strong>Principio de confidencialidad:</strong> Todas las personas que intervengan en el tratamiento de datos personales están obligadas a garantizar la reserva de la información.</li>
              </ul>
            </section>

            {/* Sección 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5. TRATAMIENTO Y FINALIDADES
              </h2>
              <p>MAXIMIZA S.A.S., a través de su establecimiento comercial Mawá (www.mawa.com.co), recolecta y trata datos personales para las siguientes finalidades, según el tipo de titular:</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">5.1. Clientes y usuarios</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Gestionar reservas de alojamiento en el hotel, mesas en el restaurante y actividades de recreación.</li>
                <li>Procesar compras de servicios realizadas a través del sitio web www.mawa.com.co o de forma presencial.</li>
                <li>Realizar el proceso de facturación, cobro y envío de comprobantes electrónicos.</li>
                <li>Enviar confirmaciones, recordatorios y comunicaciones relacionadas con los servicios contratados.</li>
                <li>Enviar información comercial, promociones, ofertas y novedades de los servicios de Mawá, previa autorización específica del titular.</li>
                <li>Realizar encuestas de satisfacción y estudios de mercado.</li>
                <li>Atender peticiones, consultas, quejas y reclamos.</li>
                <li>Cumplir obligaciones legales y regulatorias (tributarias, contables, de seguridad, migratorias, entre otras).</li>
                <li>Garantizar la seguridad de los huéspedes y usuarios dentro de las instalaciones del establecimiento, incluyendo el monitoreo a través del sistema de circuito cerrado de televisión (CCTV).</li>
                <li>Gestionar programas de fidelización, en caso de que se implementen.</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">5.2. Proveedores y aliados comerciales</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Gestionar la relación contractual y comercial.</li>
                <li>Realizar pagos y cumplir obligaciones tributarias.</li>
                <li>Evaluar la calidad de los productos y servicios suministrados.</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">5.3. Empleados y colaboradores</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ejecutar el contrato laboral o de prestación de servicios.</li>
                <li>Cumplir obligaciones legales en materia laboral, de seguridad social y salud ocupacional.</li>
                <li>Gestionar procesos de selección, capacitación y evaluación del desempeño.</li>
              </ul>
            </section>

            {/* Sección 6 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                6. DATOS PERSONALES QUE SE RECOLECTAN
              </h2>
              <p>Dependiendo de la relación con el titular, MAXIMIZA S.A.S. podrá recolectar los siguientes tipos de datos personales:</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.1. Datos de identificación</h3>
              <p>Nombres y apellidos, tipo y número de documento de identidad, fecha de nacimiento, nacionalidad, sexo, estado civil, firma.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.2. Datos de contacto</h3>
              <p>Dirección de residencia o domicilio, correo electrónico, número(s) de teléfono fijo y/o celular.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.3. Datos de transacciones comerciales</h3>
              <p>Historial de reservas y compras, preferencias de servicio, método de pago utilizado (sin almacenar datos completos de tarjeta de crédito, los cuales son gestionados exclusivamente por la pasarela de pago certificada).</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.4. Datos de navegación web</h3>
              <p>Dirección IP, tipo de navegador, cookies, datos de sesión y comportamiento de navegación en el sitio www.mawa.com.co, conforme a la política de cookies publicada en el sitio.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.5. Datos sensibles (cuando aplique)</h3>
              <p>MAXIMIZA S.A.S. podrá recolectar datos sensibles únicamente cuando sea estrictamente necesario para la prestación de sus servicios y con autorización expresa del titular. Estos pueden incluir:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Restricciones alimentarias o alergias (para servicios de restaurante).</li>
                <li>Condiciones médicas relevantes para la participación en actividades de recreación.</li>
                <li>Datos biométricos: imágenes faciales y corporales captadas por el sistema de videovigilancia (CCTV) del establecimiento.</li>
              </ul>
              <p className="mt-2">En ningún caso se condicionará la prestación de servicios a que el titular suministre datos sensibles. Se informará al titular, de manera expresa y previa, que no esta obligado a autorizar el tratamiento de estos datos y se le explicará cuales datos sensibles serán tratados y con que finalidad.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.6. Datos de menores de edad</h3>
              <p>MAXIMIZA S.A.S. podrá tratar datos de menores de edad únicamente con la autorización previa del representante legal, respetando el interés superior del menor y su derecho a ser escuchado. El tratamiento se limitará a lo estrictamente necesario para la prestación de los servicios contratados (por ejemplo, actividades de recreación).</p>
            </section>

            {/* Sección 7 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                7. AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES
              </h2>
              <p>MAXIMIZA S.A.S. obtendrá la autorización previa, expresa e informada del titular para el tratamiento de sus datos personales. Esta autorización podrá ser otorgada a través de:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Aceptación electrónica mediante checkbox en el sitio web www.mawa.com.co al momento de registro, reserva o compra.</li>
                <li>Formato físico de autorización firmado por el titular en las instalaciones del establecimiento.</li>
                <li>Manifestación verbal registrada y documentada por medios verificables.</li>
                <li>Conducta inequívoca del titular que permita concluir razonablemente que otorgó la autorización, conforme al artículo 7 del Decreto 1377 de 2013.</li>
              </ul>
              <p className="mt-2">MAXIMIZA S.A.S. conservará prueba de la autorización otorgada por el titular (fecha, hora, medio de obtención y texto aceptado) y la pondrá a disposición del titular cuando este la solicite.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">7.1. Autorización para comunicaciones comerciales</h3>
              <p>El envío de información comercial, promociones u ofertas requerirá una autorización específica y separada del titular. Esta autorización podrá ser revocada en cualquier momento a través de los canales dispuestos para tal fin.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">7.2. Casos en que no se requiere autorización</h3>
              <p>De conformidad con el artículo 10 de la Ley 1581 de 2012, no se requerirá autorización del titular en los siguientes casos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Información requerida por una entidad pública o administrativa en ejercicio de sus funciones legales o por orden judicial.</li>
                <li>Datos de naturaleza pública.</li>
                <li>Casos de urgencia médica o sanitaria.</li>
                <li>Tratamiento de información autorizado por la ley para fines históricos, estadísticos o científicos.</li>
                <li>Datos relacionados con el Registro Civil de las personas.</li>
              </ul>
            </section>

            {/* Sección 8 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                8. DERECHOS DE LOS TITULARES
              </h2>
              <p>De conformidad con el artículo 8 de la Ley 1581 de 2012, los titulares de los datos personales tienen los siguientes derechos:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Conocer, actualizar y rectificar sus datos personales frente a MAXIMIZA S.A.S. Este derecho se podrá ejercer frente a datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo tratamiento este expresamente prohibido o no haya sido autorizado.</li>
                <li>Solicitar prueba de la autorización otorgada para el tratamiento de sus datos personales.</li>
                <li>Ser informado por MAXIMIZA S.A.S., previa solicitud, respecto del uso que le ha dado a sus datos personales.</li>
                <li>Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a lo dispuesto en la Ley 1581 de 2012 y las demás normas que la modifiquen, adicionen o complementen.</li>
                <li>Revocar la autorización y/o solicitar la supresión del dato cuando en el tratamiento no se respeten los principios, derechos y garantías constitucionales y legales.</li>
                <li>Acceder en forma gratuita a sus datos personales que hayan sido objeto de tratamiento.</li>
              </ul>
            </section>

            {/* Sección 9 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                9. PROCEDIMIENTO PARA EJERCER LOS DERECHOS
              </h2>
              <p>Los titulares podrán ejercer sus derechos de consulta, reclamo, actualización, rectificación, revocatoria y supresión de datos a través de los siguientes canales:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Correo electrónico: contacto@mawa.com.co</li>
                <li>Correo físico: Calle 24B No 6 - 95</li>
                <li>Presencialmente en las instalaciones de Mawá.</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">9.1. Consultas</h3>
              <p>El titular o sus causahabientes podrán consultar la información personal que repose en las bases de datos de MAXIMIZA S.A.S. La consulta será atendida en un término máximo de diez (10) días hábiles contados a partir de la fecha de recibo de la misma. Cuando no fuere posible atender la consulta dentro de dicho término, se informará al interesado, expresándole los motivos de la demora y señalando la fecha en que se atenderá, la cual no podrá superar los cinco (5) días hábiles siguientes al vencimiento del primer término.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">9.2. Reclamos</h3>
              <p>El titular o sus causahabientes que consideren que la información contenida en una base de datos debe ser objeto de corrección, actualización o supresión, o cuando adviertan el presunto incumplimiento de cualquiera de los deberes contenidos en la Ley 1581 de 2012, podrán presentar un reclamo que contenga como mínimo:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Identificación del titular (nombre completo y número de documento).</li>
                <li>Descripción de los hechos que dan lugar al reclamo.</li>
                <li>Dirección física o electrónica para recibir respuesta.</li>
                <li>Documentos que desee hacer valer como prueba.</li>
              </ul>
              <p className="mt-2">Si el reclamo resulta incompleto, se requerirá al interesado dentro de los cinco (5) días hábiles siguientes a la recepción para que subsane las fallas. Si transcurridos dos (2) meses desde la fecha del requerimiento el solicitante no presenta la información requerida, se entenderá que ha desistido del reclamo.</p>
              <p className="mt-2">El término máximo para atender el reclamo será de quince (15) días hábiles contados a partir del día siguiente a la fecha de su recibo. Cuando no fuere posible atenderlo dentro de dicho término, se informará al interesado los motivos de la demora y la fecha en que se atenderá, la cual no podrá superar los ocho (8) días hábiles siguientes al vencimiento del primer término.</p>
            </section>

            {/* Sección 10 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                10. DEBERES DE MAXIMIZA S.A.S. COMO RESPONSABLE DEL TRATAMIENTO
              </h2>
              <p>En su calidad de responsable del tratamiento, MAXIMIZA S.A.S. se compromete a:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Garantizar al titular, en todo tiempo, el pleno y efectivo ejercicio del derecho de habeas data.</li>
                <li>Solicitar y conservar copia de la autorización otorgada por el titular.</li>
                <li>Informar debidamente al titular sobre la finalidad de la recolección y los derechos que le asisten.</li>
                <li>Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.</li>
                <li>Actualizar la información cuando sea necesario.</li>
                <li>Rectificar la información cuando sea incorrecta y comunicar lo pertinente al encargado del tratamiento.</li>
                <li>Tramitar las consultas y reclamos formulados en los términos de ley.</li>
                <li>Informar a la SIC cuando se presenten violaciones a los códigos de seguridad y existan riesgos en la administración de la información de los titulares.</li>
                <li>Cumplir las instrucciones y requerimientos que imparta la Superintendencia de Industria y Comercio.</li>
              </ul>
            </section>

            {/* Sección 11 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                11. MEDIDAS DE SEGURIDAD
              </h2>
              <p>MAXIMIZA S.A.S. adoptará las medidas técnicas, humanas y administrativas necesarias para garantizar la seguridad de los datos personales, evitando su adulteración, pérdida, consulta, uso o acceso no autorizado. Entre las medidas implementadas se encuentran:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Cifrado SSL/TLS (protocolo HTTPS) en el sitio web www.mawa.com.co para proteger la transmisión de datos.</li>
                <li>Uso de pasarelas de pago certificadas bajo estándares PCI-DSS para el procesamiento de transacciones con tarjeta de crédito o débito. MAXIMIZA S.A.S. no almacena datos completos de tarjetas de pago en sus servidores.</li>
                <li>Control de acceso basado en roles para limitar el acceso a los datos personales al personal estrictamente autorizado.</li>
                <li>Almacenamiento seguro de bases de datos con mecanismos de cifrado y copias de respaldo periódicas.</li>
                <li>Acuerdos de confidencialidad con empleados y contratistas que tengan acceso a datos personales.</li>
                <li>Capacitación periódica al personal en materia de protección de datos personales.</li>
                <li>Plan de respuesta ante incidentes de seguridad de la información.</li>
                <li>Revisión y actualización periódica de las medidas de seguridad implementadas.</li>
              </ul>
            </section>

            {/* Sección 12 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                12. TRANSFERENCIA Y TRANSMISIÓN DE DATOS A TERCEROS
              </h2>
              <p>MAXIMIZA S.A.S. podrá transmitir datos personales a terceros encargados del tratamiento que le presten servicios necesarios para el desarrollo de su objeto social, tales como:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Pasarelas de pago y entidades financieras para el procesamiento de transacciones.</li>
                <li>Plataformas de correo electrónico y comunicaciones para el envío de confirmaciones y comunicaciones.</li>
                <li>Proveedores de servicios de hosting y almacenamiento en la nube.</li>
                <li>Proveedores de herramientas de gestión de clientes (CRM) y analítica.</li>
                <li>Entidades gubernamentales que lo requieran en ejercicio de sus funciones legales.</li>
              </ul>
              <p className="mt-2">En todos los casos, MAXIMIZA S.A.S. suscribirá contratos de transmisión de datos personales con los encargados, exigiendo el cumplimiento de la presente política y de la Ley 1581 de 2012. Se prohibe la transferencia de datos personales a países que no proporcionen niveles adecuados de protección, salvo las excepciones previstas en el artículo 26 de la Ley 1581 de 2012, incluyendo la autorización expresa del titular.</p>
            </section>

            {/* Sección 13 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                13. POLÍTICA DE COOKIES
              </h2>
              <p>El sitio web www.mawa.com.co utiliza cookies y tecnologías similares para mejorar la experiencia del usuario, analizar el tráfico web y personalizar el contenido. Al navegar en el sitio, el usuario podrá aceptar o rechazar el uso de cookies no esenciales mediante el banner de cookies desplegado en su primera visita.</p>
              <p className="mt-2">Los tipos de cookies utilizados incluyen:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento básico del sitio web (sesión, carrito de compras, seguridad).</li>
                <li><strong>Cookies analíticas:</strong> permiten analizar el comportamiento de los usuarios en el sitio para mejorar su funcionalidad.</li>
                <li><strong>Cookies de marketing:</strong> utilizadas para mostrar contenido relevante y medir la efectividad de las campañas publicitarias.</li>
              </ul>
              <p className="mt-2">El usuario podrá gestionar sus preferencias de cookies en cualquier momento a través de la configuración de su navegador o del enlace de configuración de cookies disponible en el sitio web.</p>
            </section>

            {/* Sección 14 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                14. SISTEMA DE VIDEOVIGILANCIA (CIRCUITO CERRADO DE TELEVISIÓN)
              </h2>
              <p>MAXIMIZA S.A.S. opera un sistema de videovigilancia mediante circuito cerrado de televisión (CCTV) en las instalaciones de Mawá con el propósito de garantizar la seguridad de las personas, los bienes y las instalaciones del establecimiento. Las imágenes captadas a través de este sistema constituyen datos personales de naturaleza biométrica y, en consecuencia, su tratamiento se rige por la Ley 1581 de 2012, el Decreto 1377 de 2013 y la Guía sobre Protección de Datos Personales en Sistemas de Videovigilancia expedida por la Superintendencia de Industria y Comercio.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.1. Finalidad del sistema de videovigilancia</h3>
              <p>El sistema de CCTV tiene como finalidad exclusiva:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Garantizar la seguridad de los huéspedes, comensales, visitantes, empleados y demás personas que ingresen a las instalaciones de Mawá.</li>
                <li>Proteger los bienes muebles e inmuebles del establecimiento.</li>
                <li>Prevenir, disuadir y, en su caso, aportar elementos probatorios en investigaciones relacionadas con conductas delictivas o contrarias a las normas internas del establecimiento.</li>
                <li>Ejercer control de acceso a las áreas del hotel y zonas restringidas.</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.2. Áreas monitoreadas</h3>
              <p>Las cámaras de videovigilancia se encuentran ubicadas en las áreas comunes y de acceso público del establecimiento, tales como:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Accesos principales y secundarios (entradas, salidas, recepción).</li>
                <li>Pasillos y áreas de circulación común.</li>
                <li>Zonas de parqueadero.</li>
                <li>Áreas del restaurante y zonas sociales.</li>
                <li>Perímetro exterior de las instalaciones.</li>
                <li>Zonas de recreación y esparcimiento.</li>
              </ul>
              <p className="mt-2">En ningún caso se instalaran cámaras de videovigilancia en áreas que afecten la intimidad de las personas, tales como habitaciones del hotel, baños, vestuarios o cualquier otro espacio de carácter íntimo o privado.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.3. Señalización e información al titular</h3>
              <p>MAXIMIZA S.A.S. situará avisos informativos visibles en los accesos y áreas monitoreadas que informen a las personas sobre la existencia del sistema de videovigilancia. Dichos avisos contendrán, como mínimo:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Un símbolo o pictograma que indique claramente que la zona se encuentra videovigilada.</li>
                <li>La identidad del responsable del tratamiento (MAXIMIZA S.A.S.).</li>
                <li>La finalidad del tratamiento (seguridad).</li>
                <li>La referencia a la política de tratamiento de datos personales y los medios para consultarla.</li>
              </ul>
              <p className="mt-2">La permanencia voluntaria del titular en las zonas videovigiladas, debidamente señalizadas, se entenderá como autorización para el tratamiento de sus imágenes conforme a la finalidad de seguridad informada, de acuerdo con las directrices de la Superintendencia de Industria y Comercio.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.4. Almacenamiento y plazo de conservación</h3>
              <p>Las imágenes captadas por el sistema de CCTV serán almacenadas en sistemas de grabación con acceso restringido por un plazo máximo de treinta (30) días calendario, salvo que las imágenes sean requeridas como soporte o prueba en una investigación, reclamación, proceso judicial, administrativo o disciplinario, caso en el cual serán conservadas hasta la resolución definitiva del asunto. Cumplido el plazo de conservación sin que se haya presentado alguna de estas circunstancias, las grabaciones serán eliminadas de forma segura mediante sobreescritura automática del sistema.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.5. Acceso a las grabaciones</h3>
              <p>El acceso a las imágenes del sistema de videovigilancia estará restringido únicamente a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>El personal de seguridad y administración de MAXIMIZA S.A.S. debidamente autorizado.</li>
                <li>Las autoridades judiciales, administrativas o de policia que las requieran en ejercicio de sus funciones legales.</li>
                <li>El titular de los datos, cuando solicite el acceso a las imágenes que lo involucren, conforme al procedimiento establecido en la presente política.</li>
              </ul>
              <p className="mt-2">Las imágenes captadas por el sistema de videovigilancia no serán difundidas, publicadas ni compartidas con terceros no autorizados. Todo el personal con acceso a las grabaciones estará sujeto a acuerdos de confidencialidad y a las obligaciones previstas en la presente política.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.6. Seguridad del sistema</h3>
              <p>MAXIMIZA S.A.S. implementará medidas técnicas y administrativas para proteger las grabaciones del sistema de CCTV contra acceso no autorizado, manipulacion, pérdida o destrucción, incluyendo:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ubicación segura de los equipos de grabación en áreas de acceso restringido.</li>
                <li>Protección con contraseña de los sistemas de grabación y visualización.</li>
                <li>Registro de accesos a las grabaciones (log de auditoria).</li>
                <li>Mantenimiento preventivo periódico del sistema.</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.7. Servicios de seguridad privada (terceros)</h3>
              <p>En caso de que MAXIMIZA S.A.S. contrate servicios de seguridad privada o de monitoreo a través de terceros, se celebraran los correspondientes contratos de transmisión de datos personales, exigiendo al encargado el cumplimiento de la Ley 1581 de 2012 y de la presente política de tratamiento de datos personales.</p>
            </section>

            {/* Sección 15 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                15. VIGENCIA DE LAS BASES DE DATOS Y RETENCIÓN DE DATOS
              </h2>
              <p>Los datos personales serán tratados por MAXIMIZA S.A.S. durante el tiempo que sea razonablemente necesario para cumplir con las finalidades que justificaron su recolección, conforme a las disposiciones legales aplicables. En particular:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Los datos de clientes se conservarán durante la vigencia de la relación comercial y por el plazo adicional que exija la legislacion tributaria y comercial colombiana (actualmente un mínimo de diez años para documentos contables y tributarios).</li>
                <li>Los datos de empleados se conservarán durante la vigencia de la relación laboral y por el plazo de prescripción de las obligaciones laborales conforme a la ley.</li>
                <li>Los datos para fines de mercadeo se conservarán hasta que el titular revoque su autorización.</li>
                <li>Las imágenes del sistema de videovigilancia se conservarán por un máximo de treinta (30) días calendario, conforme a lo establecido en la sección 14 de la presente política.</li>
              </ul>
              <p className="mt-2">Una vez cumplida la finalidad del tratamiento y vencido el plazo legal de retención, los datos serán suprimidos de las bases de datos de MAXIMIZA S.A.S.</p>
            </section>

            {/* Sección 16 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                16. MODIFICACIONES A LA POLÍTICA
              </h2>
              <p>MAXIMIZA S.A.S. se reserva el derecho de modificar la presente política en cualquier momento. Cualquier cambio sustancial será comunicado oportunamente a los titulares mediante publicación en el sitio web www.mawa.com.co y, cuando sea necesario, a través de los medios de contacto suministrados por los titulares.</p>
              <p className="mt-2">La versión vigente de esta política estará siempre disponible para consulta en el sitio web www.mawa.com.co.</p>
            </section>

            {/* Sección 17 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                17. VIGENCIA
              </h2>
              <p>La presente política de tratamiento de datos personales fue aprobada y entra en vigencia a partir de su publicación en el sitio web www.mawa.com.co en el mes de febrero de 2026.</p>
            </section>

            {/* Firma */}
            <div className="mt-8 pt-6 border-t text-center">
              <p className="font-semibold text-gray-800">MAXIMIZA S.A.S.</p>
              <p className="text-gray-600">NIT 900.490.382-4</p>
            </div>
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
          <p>&copy; 2026 Mawá. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
