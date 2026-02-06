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
            <span className="font-bold text-xl">MAWA</span>
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
            <p className="text-gray-500">Nombre comercial: Mawa</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              POLITICA DE TRATAMIENTO Y PROTECCION DE DATOS PERSONALES
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              En cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto Reglamentario 1377 de 2013 y demas normas concordantes
            </p>
            <p className="text-sm text-emerald-600 mt-4">www.mawa.com.co</p>
            <p className="text-sm text-gray-500">Fecha de entrada en vigencia: febrero de 2026</p>
            <p className="text-sm text-gray-500">Version 1.0</p>
          </div>

          <div className="prose prose-emerald max-w-none text-gray-700 space-y-6">
            {/* Sección 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                1. IDENTIFICACION DEL RESPONSABLE DEL TRATAMIENTO
              </h2>
              <p>
                MAXIMIZA S.A.S., sociedad comercial identificada con NIT 900.490.382-4, que opera bajo el nombre comercial Mawa, es la persona juridica responsable del tratamiento de los datos personales recolectados a traves de sus canales fisicos y digitales.
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full border border-gray-200 text-sm">
                  <tbody>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Razon social</td><td className="px-4 py-2">MAXIMIZA S.A.S.</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">NIT</td><td className="px-4 py-2">900.490.382-4</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Nombre comercial</td><td className="px-4 py-2">Mawa</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Domicilio</td><td className="px-4 py-2">Km. 37,5 Via Ipiales - Pasto</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Ciudad / Departamento</td><td className="px-4 py-2">Iles, Narino</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Telefono</td><td className="px-4 py-2">3163996541</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Correo electronico de contacto</td><td className="px-4 py-2">eventos@mawa.com.co</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Correo para PQR de datos</td><td className="px-4 py-2">contacto@mawa.com.co</td></tr>
                    <tr className="border-b"><td className="px-4 py-2 font-medium bg-gray-50">Sitio web</td><td className="px-4 py-2">www.mawa.com.co</td></tr>
                    <tr><td className="px-4 py-2 font-medium bg-gray-50">Actividad economica</td><td className="px-4 py-2">Servicios de hotel, restaurante y actividades de recreacion</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sección 2 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2. MARCO LEGAL
              </h2>
              <p>La presente politica se rige por la normatividad colombiana vigente en materia de proteccion de datos personales, principalmente:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Articulo 15 de la Constitucion Politica de Colombia (derecho al habeas data).</li>
                <li>Ley Estatutaria 1581 de 2012 (Regimen General de Proteccion de Datos Personales).</li>
                <li>Decreto Reglamentario 1377 de 2013 (compilado en el Decreto Unico 1074 de 2015).</li>
                <li>Decreto 886 de 2014 (Registro Nacional de Bases de Datos).</li>
                <li>Decreto 090 de 2018 (modificacion del ambito de aplicacion del RNBD).</li>
                <li>Sentencias de la Corte Constitucional y circulares de la Superintendencia de Industria y Comercio (SIC) aplicables.</li>
                <li>Guia sobre Proteccion de Datos Personales en Sistemas de Videovigilancia, expedida por la SIC.</li>
              </ul>
            </section>

            {/* Sección 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3. DEFINICIONES
              </h2>
              <p>Para efectos de la presente politica, se adoptan las siguientes definiciones conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Dato personal:</strong> Cualquier informacion vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.</li>
                <li><strong>Dato publico:</strong> Dato que la ley o la Constitucion han determinado como publico y cuya recopilacion no requiere autorizacion del titular (por ejemplo, nombre, profesion, estado civil).</li>
                <li><strong>Dato semiprivado:</strong> Dato que no tiene naturaleza intima, reservada ni publica, y cuyo conocimiento interesa no solo al titular sino a cierto sector o grupo (por ejemplo, informacion financiera y crediticia).</li>
                <li><strong>Dato privado:</strong> Dato que por su naturaleza intima o reservada solo es relevante para el titular (por ejemplo, direccion de residencia, telefono personal).</li>
                <li><strong>Dato sensible:</strong> Dato que afecta la intimidad del titular o cuyo uso indebido puede generar discriminacion (por ejemplo, origen racial, convicciones religiosas, datos de salud, orientacion sexual, datos biometricos).</li>
                <li><strong>Titular:</strong> Persona natural cuyos datos personales sean objeto de tratamiento.</li>
                <li><strong>Responsable del tratamiento:</strong> Persona natural o juridica que decide sobre la base de datos y/o el tratamiento de los datos. Para efectos de esta politica, MAXIMIZA S.A.S.</li>
                <li><strong>Encargado del tratamiento:</strong> Persona natural o juridica que realiza el tratamiento de datos personales por cuenta del responsable.</li>
                <li><strong>Tratamiento:</strong> Cualquier operacion o conjunto de operaciones sobre datos personales, tales como la recoleccion, almacenamiento, uso, circulacion o supresion.</li>
                <li><strong>Autorizacion:</strong> Consentimiento previo, expreso e informado del titular para llevar a cabo el tratamiento de sus datos personales.</li>
                <li><strong>Aviso de privacidad:</strong> Comunicacion verbal o escrita dirigida al titular para informarle sobre la existencia de las politicas de tratamiento que le seran aplicables y la forma de acceder a ellas.</li>
                <li><strong>Base de datos:</strong> Conjunto organizado de datos personales que sea objeto de tratamiento.</li>
                <li><strong>Transferencia:</strong> Envio de datos personales por el responsable a un tercero (otro responsable) dentro o fuera de Colombia.</li>
                <li><strong>Transmision:</strong> Comunicacion de datos personales por el responsable al encargado, dentro o fuera de Colombia, para que este realice el tratamiento por cuenta del responsable.</li>
              </ul>
            </section>

            {/* Sección 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                4. PRINCIPIOS RECTORES DEL TRATAMIENTO
              </h2>
              <p>MAXIMIZA S.A.S. aplicara los siguientes principios en el tratamiento de datos personales, conforme al articulo 4 de la Ley 1581 de 2012:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Principio de legalidad:</strong> El tratamiento es una actividad reglada que debe sujetarse a la ley y demas disposiciones que la desarrollen.</li>
                <li><strong>Principio de finalidad:</strong> El tratamiento debe obedecer a una finalidad legitima, la cual debe ser informada al titular.</li>
                <li><strong>Principio de libertad:</strong> El tratamiento solo puede ejercerse con el consentimiento previo, expreso e informado del titular.</li>
                <li><strong>Principio de veracidad o calidad:</strong> La informacion sujeta a tratamiento debe ser veraz, completa, exacta, actualizada y comprobable.</li>
                <li><strong>Principio de transparencia:</strong> En el tratamiento debe garantizarse el derecho del titular a obtener informacion acerca de la existencia de datos que le conciernan.</li>
                <li><strong>Principio de acceso y circulacion restringida:</strong> El tratamiento solo podra hacerse por las personas autorizadas por el titular y/o por las previstas en la ley.</li>
                <li><strong>Principio de seguridad:</strong> La informacion sujeta a tratamiento se debera manejar con las medidas tecnicas, humanas y administrativas necesarias para otorgar seguridad a los registros.</li>
                <li><strong>Principio de confidencialidad:</strong> Todas las personas que intervengan en el tratamiento de datos personales estan obligadas a garantizar la reserva de la informacion.</li>
              </ul>
            </section>

            {/* Sección 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5. TRATAMIENTO Y FINALIDADES
              </h2>
              <p>MAXIMIZA S.A.S., a traves de su establecimiento comercial Mawa (www.mawa.com.co), recolecta y trata datos personales para las siguientes finalidades, segun el tipo de titular:</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">5.1. Clientes y usuarios</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Gestionar reservas de alojamiento en el hotel, mesas en el restaurante y actividades de recreacion.</li>
                <li>Procesar compras de servicios realizadas a traves del sitio web www.mawa.com.co o de forma presencial.</li>
                <li>Realizar el proceso de facturacion, cobro y envio de comprobantes electronicos.</li>
                <li>Enviar confirmaciones, recordatorios y comunicaciones relacionadas con los servicios contratados.</li>
                <li>Enviar informacion comercial, promociones, ofertas y novedades de los servicios de Mawa, previa autorizacion especifica del titular.</li>
                <li>Realizar encuestas de satisfaccion y estudios de mercado.</li>
                <li>Atender peticiones, consultas, quejas y reclamos.</li>
                <li>Cumplir obligaciones legales y regulatorias (tributarias, contables, de seguridad, migratorias, entre otras).</li>
                <li>Garantizar la seguridad de los huespedes y usuarios dentro de las instalaciones del establecimiento, incluyendo el monitoreo a traves del sistema de circuito cerrado de television (CCTV).</li>
                <li>Gestionar programas de fidelizacion, en caso de que se implementen.</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">5.2. Proveedores y aliados comerciales</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Gestionar la relacion contractual y comercial.</li>
                <li>Realizar pagos y cumplir obligaciones tributarias.</li>
                <li>Evaluar la calidad de los productos y servicios suministrados.</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">5.3. Empleados y colaboradores</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ejecutar el contrato laboral o de prestacion de servicios.</li>
                <li>Cumplir obligaciones legales en materia laboral, de seguridad social y salud ocupacional.</li>
                <li>Gestionar procesos de seleccion, capacitacion y evaluacion del desempeno.</li>
              </ul>
            </section>

            {/* Sección 6 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                6. DATOS PERSONALES QUE SE RECOLECTAN
              </h2>
              <p>Dependiendo de la relacion con el titular, MAXIMIZA S.A.S. podra recolectar los siguientes tipos de datos personales:</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.1. Datos de identificacion</h3>
              <p>Nombres y apellidos, tipo y numero de documento de identidad, fecha de nacimiento, nacionalidad, sexo, estado civil, firma.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.2. Datos de contacto</h3>
              <p>Direccion de residencia o domicilio, correo electronico, numero(s) de telefono fijo y/o celular.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.3. Datos de transacciones comerciales</h3>
              <p>Historial de reservas y compras, preferencias de servicio, metodo de pago utilizado (sin almacenar datos completos de tarjeta de credito, los cuales son gestionados exclusivamente por la pasarela de pago certificada).</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.4. Datos de navegacion web</h3>
              <p>Direccion IP, tipo de navegador, cookies, datos de sesion y comportamiento de navegacion en el sitio www.mawa.com.co, conforme a la politica de cookies publicada en el sitio.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.5. Datos sensibles (cuando aplique)</h3>
              <p>MAXIMIZA S.A.S. podra recolectar datos sensibles unicamente cuando sea estrictamente necesario para la prestacion de sus servicios y con autorizacion expresa del titular. Estos pueden incluir:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Restricciones alimentarias o alergias (para servicios de restaurante).</li>
                <li>Condiciones medicas relevantes para la participacion en actividades de recreacion.</li>
                <li>Datos biometricos: imagenes faciales y corporales captadas por el sistema de videovigilancia (CCTV) del establecimiento.</li>
              </ul>
              <p className="mt-2">En ningun caso se condicionara la prestacion de servicios a que el titular suministre datos sensibles. Se informara al titular, de manera expresa y previa, que no esta obligado a autorizar el tratamiento de estos datos y se le explicara cuales datos sensibles seran tratados y con que finalidad.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">6.6. Datos de menores de edad</h3>
              <p>MAXIMIZA S.A.S. podra tratar datos de menores de edad unicamente con la autorizacion previa del representante legal, respetando el interes superior del menor y su derecho a ser escuchado. El tratamiento se limitara a lo estrictamente necesario para la prestacion de los servicios contratados (por ejemplo, actividades de recreacion).</p>
            </section>

            {/* Sección 7 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                7. AUTORIZACION PARA EL TRATAMIENTO DE DATOS PERSONALES
              </h2>
              <p>MAXIMIZA S.A.S. obtendra la autorizacion previa, expresa e informada del titular para el tratamiento de sus datos personales. Esta autorizacion podra ser otorgada a traves de:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Aceptacion electronica mediante checkbox en el sitio web www.mawa.com.co al momento de registro, reserva o compra.</li>
                <li>Formato fisico de autorizacion firmado por el titular en las instalaciones del establecimiento.</li>
                <li>Manifestacion verbal registrada y documentada por medios verificables.</li>
                <li>Conducta inequivoca del titular que permita concluir razonablemente que otorgo la autorizacion, conforme al articulo 7 del Decreto 1377 de 2013.</li>
              </ul>
              <p className="mt-2">MAXIMIZA S.A.S. conservara prueba de la autorizacion otorgada por el titular (fecha, hora, medio de obtencion y texto aceptado) y la pondra a disposicion del titular cuando este la solicite.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">7.1. Autorizacion para comunicaciones comerciales</h3>
              <p>El envio de informacion comercial, promociones u ofertas requerira una autorizacion especifica y separada del titular. Esta autorizacion podra ser revocada en cualquier momento a traves de los canales dispuestos para tal fin.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">7.2. Casos en que no se requiere autorizacion</h3>
              <p>De conformidad con el articulo 10 de la Ley 1581 de 2012, no se requerira autorizacion del titular en los siguientes casos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Informacion requerida por una entidad publica o administrativa en ejercicio de sus funciones legales o por orden judicial.</li>
                <li>Datos de naturaleza publica.</li>
                <li>Casos de urgencia medica o sanitaria.</li>
                <li>Tratamiento de informacion autorizado por la ley para fines historicos, estadisticos o cientificos.</li>
                <li>Datos relacionados con el Registro Civil de las personas.</li>
              </ul>
            </section>

            {/* Sección 8 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                8. DERECHOS DE LOS TITULARES
              </h2>
              <p>De conformidad con el articulo 8 de la Ley 1581 de 2012, los titulares de los datos personales tienen los siguientes derechos:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Conocer, actualizar y rectificar sus datos personales frente a MAXIMIZA S.A.S. Este derecho se podra ejercer frente a datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo tratamiento este expresamente prohibido o no haya sido autorizado.</li>
                <li>Solicitar prueba de la autorizacion otorgada para el tratamiento de sus datos personales.</li>
                <li>Ser informado por MAXIMIZA S.A.S., previa solicitud, respecto del uso que le ha dado a sus datos personales.</li>
                <li>Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a lo dispuesto en la Ley 1581 de 2012 y las demas normas que la modifiquen, adicionen o complementen.</li>
                <li>Revocar la autorizacion y/o solicitar la supresion del dato cuando en el tratamiento no se respeten los principios, derechos y garantias constitucionales y legales.</li>
                <li>Acceder en forma gratuita a sus datos personales que hayan sido objeto de tratamiento.</li>
              </ul>
            </section>

            {/* Sección 9 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                9. PROCEDIMIENTO PARA EJERCER LOS DERECHOS
              </h2>
              <p>Los titulares podran ejercer sus derechos de consulta, reclamo, actualizacion, rectificacion, revocatoria y supresion de datos a traves de los siguientes canales:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Correo electronico: contacto@mawa.com.co</li>
                <li>Correo fisico: Calle 24B No 6 - 95</li>
                <li>Presencialmente en las instalaciones de Mawa.</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">9.1. Consultas</h3>
              <p>El titular o sus causahabientes podran consultar la informacion personal que repose en las bases de datos de MAXIMIZA S.A.S. La consulta sera atendida en un termino maximo de diez (10) dias habiles contados a partir de la fecha de recibo de la misma. Cuando no fuere posible atender la consulta dentro de dicho termino, se informara al interesado, expresandole los motivos de la demora y senalando la fecha en que se atendera, la cual no podra superar los cinco (5) dias habiles siguientes al vencimiento del primer termino.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">9.2. Reclamos</h3>
              <p>El titular o sus causahabientes que consideren que la informacion contenida en una base de datos debe ser objeto de correccion, actualizacion o supresion, o cuando adviertan el presunto incumplimiento de cualquiera de los deberes contenidos en la Ley 1581 de 2012, podran presentar un reclamo que contenga como minimo:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Identificacion del titular (nombre completo y numero de documento).</li>
                <li>Descripcion de los hechos que dan lugar al reclamo.</li>
                <li>Direccion fisica o electronica para recibir respuesta.</li>
                <li>Documentos que desee hacer valer como prueba.</li>
              </ul>
              <p className="mt-2">Si el reclamo resulta incompleto, se requerira al interesado dentro de los cinco (5) dias habiles siguientes a la recepcion para que subsane las fallas. Si transcurridos dos (2) meses desde la fecha del requerimiento el solicitante no presenta la informacion requerida, se entendera que ha desistido del reclamo.</p>
              <p className="mt-2">El termino maximo para atender el reclamo sera de quince (15) dias habiles contados a partir del dia siguiente a la fecha de su recibo. Cuando no fuere posible atenderlo dentro de dicho termino, se informara al interesado los motivos de la demora y la fecha en que se atendera, la cual no podra superar los ocho (8) dias habiles siguientes al vencimiento del primer termino.</p>
            </section>

            {/* Sección 10 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                10. DEBERES DE MAXIMIZA S.A.S. COMO RESPONSABLE DEL TRATAMIENTO
              </h2>
              <p>En su calidad de responsable del tratamiento, MAXIMIZA S.A.S. se compromete a:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Garantizar al titular, en todo tiempo, el pleno y efectivo ejercicio del derecho de habeas data.</li>
                <li>Solicitar y conservar copia de la autorizacion otorgada por el titular.</li>
                <li>Informar debidamente al titular sobre la finalidad de la recoleccion y los derechos que le asisten.</li>
                <li>Conservar la informacion bajo las condiciones de seguridad necesarias para impedir su adulteracion, perdida, consulta, uso o acceso no autorizado o fraudulento.</li>
                <li>Actualizar la informacion cuando sea necesario.</li>
                <li>Rectificar la informacion cuando sea incorrecta y comunicar lo pertinente al encargado del tratamiento.</li>
                <li>Tramitar las consultas y reclamos formulados en los terminos de ley.</li>
                <li>Informar a la SIC cuando se presenten violaciones a los codigos de seguridad y existan riesgos en la administracion de la informacion de los titulares.</li>
                <li>Cumplir las instrucciones y requerimientos que imparta la Superintendencia de Industria y Comercio.</li>
              </ul>
            </section>

            {/* Sección 11 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                11. MEDIDAS DE SEGURIDAD
              </h2>
              <p>MAXIMIZA S.A.S. adoptara las medidas tecnicas, humanas y administrativas necesarias para garantizar la seguridad de los datos personales, evitando su adulteracion, perdida, consulta, uso o acceso no autorizado. Entre las medidas implementadas se encuentran:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Cifrado SSL/TLS (protocolo HTTPS) en el sitio web www.mawa.com.co para proteger la transmision de datos.</li>
                <li>Uso de pasarelas de pago certificadas bajo estandares PCI-DSS para el procesamiento de transacciones con tarjeta de credito o debito. MAXIMIZA S.A.S. no almacena datos completos de tarjetas de pago en sus servidores.</li>
                <li>Control de acceso basado en roles para limitar el acceso a los datos personales al personal estrictamente autorizado.</li>
                <li>Almacenamiento seguro de bases de datos con mecanismos de cifrado y copias de respaldo periodicas.</li>
                <li>Acuerdos de confidencialidad con empleados y contratistas que tengan acceso a datos personales.</li>
                <li>Capacitacion periodica al personal en materia de proteccion de datos personales.</li>
                <li>Plan de respuesta ante incidentes de seguridad de la informacion.</li>
                <li>Revision y actualizacion periodica de las medidas de seguridad implementadas.</li>
              </ul>
            </section>

            {/* Sección 12 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                12. TRANSFERENCIA Y TRANSMISION DE DATOS A TERCEROS
              </h2>
              <p>MAXIMIZA S.A.S. podra transmitir datos personales a terceros encargados del tratamiento que le presten servicios necesarios para el desarrollo de su objeto social, tales como:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Pasarelas de pago y entidades financieras para el procesamiento de transacciones.</li>
                <li>Plataformas de correo electronico y comunicaciones para el envio de confirmaciones y comunicaciones.</li>
                <li>Proveedores de servicios de hosting y almacenamiento en la nube.</li>
                <li>Proveedores de herramientas de gestion de clientes (CRM) y analitica.</li>
                <li>Entidades gubernamentales que lo requieran en ejercicio de sus funciones legales.</li>
              </ul>
              <p className="mt-2">En todos los casos, MAXIMIZA S.A.S. suscribira contratos de transmision de datos personales con los encargados, exigiendo el cumplimiento de la presente politica y de la Ley 1581 de 2012. Se prohibe la transferencia de datos personales a paises que no proporcionen niveles adecuados de proteccion, salvo las excepciones previstas en el articulo 26 de la Ley 1581 de 2012, incluyendo la autorizacion expresa del titular.</p>
            </section>

            {/* Sección 13 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                13. POLITICA DE COOKIES
              </h2>
              <p>El sitio web www.mawa.com.co utiliza cookies y tecnologias similares para mejorar la experiencia del usuario, analizar el trafico web y personalizar el contenido. Al navegar en el sitio, el usuario podra aceptar o rechazar el uso de cookies no esenciales mediante el banner de cookies desplegado en su primera visita.</p>
              <p className="mt-2">Los tipos de cookies utilizados incluyen:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento basico del sitio web (sesion, carrito de compras, seguridad).</li>
                <li><strong>Cookies analiticas:</strong> permiten analizar el comportamiento de los usuarios en el sitio para mejorar su funcionalidad.</li>
                <li><strong>Cookies de marketing:</strong> utilizadas para mostrar contenido relevante y medir la efectividad de las campanas publicitarias.</li>
              </ul>
              <p className="mt-2">El usuario podra gestionar sus preferencias de cookies en cualquier momento a traves de la configuracion de su navegador o del enlace de configuracion de cookies disponible en el sitio web.</p>
            </section>

            {/* Sección 14 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                14. SISTEMA DE VIDEOVIGILANCIA (CIRCUITO CERRADO DE TELEVISION)
              </h2>
              <p>MAXIMIZA S.A.S. opera un sistema de videovigilancia mediante circuito cerrado de television (CCTV) en las instalaciones de Mawa con el proposito de garantizar la seguridad de las personas, los bienes y las instalaciones del establecimiento. Las imagenes captadas a traves de este sistema constituyen datos personales de naturaleza biometrica y, en consecuencia, su tratamiento se rige por la Ley 1581 de 2012, el Decreto 1377 de 2013 y la Guia sobre Proteccion de Datos Personales en Sistemas de Videovigilancia expedida por la Superintendencia de Industria y Comercio.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.1. Finalidad del sistema de videovigilancia</h3>
              <p>El sistema de CCTV tiene como finalidad exclusiva:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Garantizar la seguridad de los huespedes, comensales, visitantes, empleados y demas personas que ingresen a las instalaciones de Mawa.</li>
                <li>Proteger los bienes muebles e inmuebles del establecimiento.</li>
                <li>Prevenir, disuadir y, en su caso, aportar elementos probatorios en investigaciones relacionadas con conductas delictivas o contrarias a las normas internas del establecimiento.</li>
                <li>Ejercer control de acceso a las areas del hotel y zonas restringidas.</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.2. Areas monitoreadas</h3>
              <p>Las camaras de videovigilancia se encuentran ubicadas en las areas comunes y de acceso publico del establecimiento, tales como:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Accesos principales y secundarios (entradas, salidas, recepcion).</li>
                <li>Pasillos y areas de circulacion comun.</li>
                <li>Zonas de parqueadero.</li>
                <li>Areas del restaurante y zonas sociales.</li>
                <li>Perimetro exterior de las instalaciones.</li>
                <li>Zonas de recreacion y esparcimiento.</li>
              </ul>
              <p className="mt-2">En ningun caso se instalaran camaras de videovigilancia en areas que afecten la intimidad de las personas, tales como habitaciones del hotel, banos, vestuarios o cualquier otro espacio de caracter intimo o privado.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.3. Senalizacion e informacion al titular</h3>
              <p>MAXIMIZA S.A.S. situara avisos informativos visibles en los accesos y areas monitoreadas que informen a las personas sobre la existencia del sistema de videovigilancia. Dichos avisos contendran, como minimo:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Un simbolo o pictograma que indique claramente que la zona se encuentra videovigilada.</li>
                <li>La identidad del responsable del tratamiento (MAXIMIZA S.A.S.).</li>
                <li>La finalidad del tratamiento (seguridad).</li>
                <li>La referencia a la politica de tratamiento de datos personales y los medios para consultarla.</li>
              </ul>
              <p className="mt-2">La permanencia voluntaria del titular en las zonas videovigiladas, debidamente senalizadas, se entendera como autorizacion para el tratamiento de sus imagenes conforme a la finalidad de seguridad informada, de acuerdo con las directrices de la Superintendencia de Industria y Comercio.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.4. Almacenamiento y plazo de conservacion</h3>
              <p>Las imagenes captadas por el sistema de CCTV seran almacenadas en sistemas de grabacion con acceso restringido por un plazo maximo de treinta (30) dias calendario, salvo que las imagenes sean requeridas como soporte o prueba en una investigacion, reclamacion, proceso judicial, administrativo o disciplinario, caso en el cual seran conservadas hasta la resolucion definitiva del asunto. Cumplido el plazo de conservacion sin que se haya presentado alguna de estas circunstancias, las grabaciones seran eliminadas de forma segura mediante sobreescritura automatica del sistema.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.5. Acceso a las grabaciones</h3>
              <p>El acceso a las imagenes del sistema de videovigilancia estara restringido unicamente a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>El personal de seguridad y administracion de MAXIMIZA S.A.S. debidamente autorizado.</li>
                <li>Las autoridades judiciales, administrativas o de policia que las requieran en ejercicio de sus funciones legales.</li>
                <li>El titular de los datos, cuando solicite el acceso a las imagenes que lo involucren, conforme al procedimiento establecido en la presente politica.</li>
              </ul>
              <p className="mt-2">Las imagenes captadas por el sistema de videovigilancia no seran difundidas, publicadas ni compartidas con terceros no autorizados. Todo el personal con acceso a las grabaciones estara sujeto a acuerdos de confidencialidad y a las obligaciones previstas en la presente politica.</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.6. Seguridad del sistema</h3>
              <p>MAXIMIZA S.A.S. implementara medidas tecnicas y administrativas para proteger las grabaciones del sistema de CCTV contra acceso no autorizado, manipulacion, perdida o destruccion, incluyendo:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ubicacion segura de los equipos de grabacion en areas de acceso restringido.</li>
                <li>Proteccion con contrasena de los sistemas de grabacion y visualizacion.</li>
                <li>Registro de accesos a las grabaciones (log de auditoria).</li>
                <li>Mantenimiento preventivo periodico del sistema.</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">14.7. Servicios de seguridad privada (terceros)</h3>
              <p>En caso de que MAXIMIZA S.A.S. contrate servicios de seguridad privada o de monitoreo a traves de terceros, se celebraran los correspondientes contratos de transmision de datos personales, exigiendo al encargado el cumplimiento de la Ley 1581 de 2012 y de la presente politica de tratamiento de datos personales.</p>
            </section>

            {/* Sección 15 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                15. VIGENCIA DE LAS BASES DE DATOS Y RETENCION DE DATOS
              </h2>
              <p>Los datos personales seran tratados por MAXIMIZA S.A.S. durante el tiempo que sea razonablemente necesario para cumplir con las finalidades que justificaron su recoleccion, conforme a las disposiciones legales aplicables. En particular:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Los datos de clientes se conservaran durante la vigencia de la relacion comercial y por el plazo adicional que exija la legislacion tributaria y comercial colombiana (actualmente un minimo de diez anos para documentos contables y tributarios).</li>
                <li>Los datos de empleados se conservaran durante la vigencia de la relacion laboral y por el plazo de prescripcion de las obligaciones laborales conforme a la ley.</li>
                <li>Los datos para fines de mercadeo se conservaran hasta que el titular revoque su autorizacion.</li>
                <li>Las imagenes del sistema de videovigilancia se conservaran por un maximo de treinta (30) dias calendario, conforme a lo establecido en la seccion 14 de la presente politica.</li>
              </ul>
              <p className="mt-2">Una vez cumplida la finalidad del tratamiento y vencido el plazo legal de retencion, los datos seran suprimidos de las bases de datos de MAXIMIZA S.A.S.</p>
            </section>

            {/* Sección 16 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                16. MODIFICACIONES A LA POLITICA
              </h2>
              <p>MAXIMIZA S.A.S. se reserva el derecho de modificar la presente politica en cualquier momento. Cualquier cambio sustancial sera comunicado oportunamente a los titulares mediante publicacion en el sitio web www.mawa.com.co y, cuando sea necesario, a traves de los medios de contacto suministrados por los titulares.</p>
              <p className="mt-2">La version vigente de esta politica estara siempre disponible para consulta en el sitio web www.mawa.com.co.</p>
            </section>

            {/* Sección 17 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                17. VIGENCIA
              </h2>
              <p>La presente politica de tratamiento de datos personales fue aprobada y entra en vigencia a partir de su publicacion en el sitio web www.mawa.com.co en el mes de febrero de 2026.</p>
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
          <p>&copy; 2026 Mawa. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
