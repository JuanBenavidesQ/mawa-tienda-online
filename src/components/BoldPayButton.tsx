'use client'

import { useEffect, useRef, useId, useState } from 'react'

type BoldPayButtonProps = {
  apiKey: string
  amount: number
  orderId: string
  description: string
  currency?: string
  integrityHash?: string
  customerData?: {
    email?: string
    fullName?: string
    phone?: string
    dialCode?: string
  }
  redirectionUrl?: string
  onReady?: () => void
}

export default function BoldPayButton({
  apiKey,
  amount,
  orderId,
  description,
  currency = 'COP',
  integrityHash,
  customerData,
  redirectionUrl,
  onReady,
}: BoldPayButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniqueId = useId()
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Generar el HTML del botón Bold
  const getBoldButtonHTML = () => {
    const customerDataAttr = customerData
      ? `data-customer-data='${JSON.stringify({
          email: customerData.email || '',
          fullName: customerData.fullName || '',
          phone: customerData.phone || '',
          dialCode: customerData.dialCode || '+57',
        })}'`
      : ''

    const integrityAttr = integrityHash
      ? `data-integrity-signature="${integrityHash}"`
      : ''

    const redirectAttr = redirectionUrl
      ? `data-redirection-url="${redirectionUrl}"`
      : ''

    return `
      <script
        data-bold-button
        data-api-key="${apiKey}"
        data-order-id="${orderId}"
        data-currency="${currency}"
        data-amount="${amount}"
        data-description="${description}"
        data-render-mode="embedded"
        ${integrityAttr}
        ${redirectAttr}
        ${customerDataAttr}
      ></script>
    `
  }

  useEffect(() => {
    if (!containerRef.current || !apiKey || !amount || !orderId) return

    console.log('BoldPayButton mounting with:', {
      apiKey: apiKey.substring(0, 8) + '...',
      amount,
      orderId,
      integrityHash: integrityHash ? integrityHash.substring(0, 16) + '...' : 'MISSING',
    })

    setError(null)

    // Insertar el HTML del botón
    containerRef.current.innerHTML = getBoldButtonHTML()

    // Remover script anterior de Bold si existe
    const existingScript = document.querySelector('script[src*="boldPaymentButton.js"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Cargar el script de Bold DESPUÉS de que el botón esté en el DOM
    const boldScript = document.createElement('script')
    boldScript.src = 'https://checkout.bold.co/library/boldPaymentButton.js'
    boldScript.onload = () => {
      console.log('Bold library loaded')
      setScriptLoaded(true)

      // Verificar si el botón se renderizó
      setTimeout(() => {
        const btn = containerRef.current?.querySelector('button, bold-payment-button')
        if (btn) {
          console.log('Bold button rendered successfully')
          onReady?.()
        } else {
          console.log('Bold button not found, container:', containerRef.current?.innerHTML)
        }
      }, 2000)
    }
    boldScript.onerror = () => {
      setError('Error cargando pasarela de pago')
    }
    document.body.appendChild(boldScript)

    // Timeout para mostrar error
    const timeout = setTimeout(() => {
      if (!containerRef.current?.querySelector('button, bold-payment-button')) {
        setError('El botón de pago no pudo cargar. Intenta recargar la página.')
      }
    }, 15000)

    return () => {
      clearTimeout(timeout)
    }
  }, [apiKey, amount, orderId, description, currency, integrityHash, redirectionUrl])

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      id={`bold-button-${uniqueId}`}
      className="bold-button-container flex justify-center min-h-[60px]"
    />
  )
}
