'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar para seguro após 2 segundos (simulando loading)
    const timer = setTimeout(() => {
      router.push('/seguro')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <>
      <Script src="https://sdk.mercadopago.com/js/v2" strategy="beforeInteractive" />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        background: '#fff'
      }}>
        <p style={{
          fontSize: '20px',
          color: 'rgba(0,0,0,.9)',
          marginBottom: '24px',
          fontWeight: 400
        }}>
          Preparando tudo para sua compra
        </p>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e6e6e6',
          borderTop: '4px solid #3483fa',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  )
}

