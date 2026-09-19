'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { GA_MEASUREMENT_ID, META_PIXEL_ID, trackPageView } from '@/lib/analytics'

/**
 * Meta Pixel y GA4 en dos partes: las colas `fbq`/`gtag` se definen de
 * inmediato con un script en línea diminuto, y las librerías pesadas
 * (fbevents.js + gtag/js, ~370 KB) se cargan en reposo tras el evento load
 * (`lazyOnload`) para no competir con la foto del hero (LCP móvil). Un evento
 * disparado antes de que carguen (InitiateCheckout, Purchase) queda en cola y
 * se envía al cargar: no se pierde.
 *
 * Reporta PageView a Meta en cada cambio de ruta del App Router (GA4 lo hace
 * solo con "medición mejorada"). Si un ID está vacío, ese proveedor no se carga.
 */
export default function Analytics() {
  const pathname = usePathname()
  const primeraRuta = useRef(true)

  useEffect(() => {
    // La primera PageView la dispara el snippet de Meta al cargar; aquí solo
    // las navegaciones internas posteriores (p. ej. volver de /exito a /).
    if (primeraRuta.current) {
      primeraRuta.current = false
      return
    }
    trackPageView()
  }, [pathname])

  return (
    <>
      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,n){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window);fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
          <Script src="https://connect.facebook.net/en_US/fbevents.js" strategy="lazyOnload" />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              alt=""
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="lazyOnload"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}
    </>
  )
}
