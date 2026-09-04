'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { GA_MEASUREMENT_ID, META_PIXEL_ID, trackPageView } from '@/lib/analytics'

/**
 * Carga Meta Pixel y GA4 después de que la página es interactiva (no bloquea
 * el render) y reporta PageView a Meta en cada cambio de ruta del App Router
 * (GA4 lo hace solo con "medición mejorada"). Si un ID está vacío, ese
 * proveedor no se carga.
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
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
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
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}
    </>
  )
}
