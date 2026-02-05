'use client'

import { useEffect, useRef, useId, useState } from 'react'

type BoldPayButtonProps = {
  apiKey: string
  amount: number
  orderId: string
  description: string
  currency?: string
  integrityHash?: string  // Hash SHA256 para verificar integridad
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

  useEffect(() => {
    if (!containerRef.current || !apiKey || !amount || !orderId) return

    // Log para debug
    console.log('BoldPayButton mounting with:', {
      apiKey: apiKey.substring(0, 8) + '...',
      amount,
      orderId,
      integrityHash: integrityHash ? integrityHash.substring(0, 16) + '...' : 'MISSING',
      redirectionUrl: redirectionUrl?.substring(0, 50) + '...',
    })

    // Limpiar contenedor
    containerRef.current.innerHTML = ''
    setError(null)

    // Crear script tag con atributos de Bold
    const buttonScript = document.createElement('script')
    buttonScript.setAttribute('data-bold-button', 'dark-L')
    buttonScript.setAttribute('data-api-key', apiKey)
    buttonScript.setAttribute('data-amount', amount.toString())
    buttonScript.setAttribute('data-order-id', orderId)
    buttonScript.setAttribute('data-currency', currency)
    buttonScript.setAttribute('data-description', description)

    // Hash de integridad (requerido cuando se especifica el monto)
    if (integrityHash) {
      buttonScript.setAttribute('data-integrity-signature', integrityHash)
    }

    if (customerData) {
      buttonScript.setAttribute('data-customer-data', JSON.stringify({
        email: customerData.email || '',
        fullName: customerData.fullName || '',
        phone: customerData.phone || '',
        dialCode: customerData.dialCode || '+57',
      }))
    }

    if (redirectionUrl) {
      buttonScript.setAttribute('data-redirection-url', redirectionUrl)
    }

    containerRef.current.appendChild(buttonScript)

    // Cargar el script de Bold en el HEAD después de agregar el botón al DOM
    // Primero remover script anterior si existe
    const existingBoldScript = document.querySelector('script[src*="boldPaymentButton.js"]')
    if (existingBoldScript) {
      existingBoldScript.remove()
    }

    const boldLibrary = document.createElement('script')
    boldLibrary.src = 'https://checkout.bold.co/library/boldPaymentButton.js'
    boldLibrary.async = false // Cargar síncronamente para React
    boldLibrary.onload = () => {
      console.log('Bold library loaded in HEAD, checking for button...')
      setTimeout(() => {
        const btn = containerRef.current?.querySelector('button')
        console.log('Bold button found:', !!btn)
        if (!btn) {
          console.log('Container HTML:', containerRef.current?.innerHTML)
        }
      }, 1000)
    }
    boldLibrary.onerror = () => {
      setError('Error cargando pasarela de pago')
    }
    // Agregar al HEAD como indica Bold para React
    document.head.appendChild(boldLibrary)

    // Notificar cuando esté listo
    const checkButton = setInterval(() => {
      const button = containerRef.current?.querySelector('button')
      if (button) {
        clearInterval(checkButton)
        onReady?.()
      }
    }, 100)

    // Timeout para mostrar error si no carga
    const timeout = setTimeout(() => {
      clearInterval(checkButton)
      if (!containerRef.current?.querySelector('button')) {
        setError('El botón de pago no pudo cargar. Intenta recargar la página.')
      }
    }, 10000) // 10 segundos

    // Cleanup
    return () => {
      clearInterval(checkButton)
      clearTimeout(timeout)
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [apiKey, amount, orderId, description, currency, integrityHash, customerData, redirectionUrl, onReady, uniqueId])

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
      className="bold-button-container flex justify-center"
    />
  )
}
