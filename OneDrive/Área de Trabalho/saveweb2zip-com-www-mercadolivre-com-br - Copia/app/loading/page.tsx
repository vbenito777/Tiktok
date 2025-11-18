'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoadingPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/seguro')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: "Proxima Nova", -apple-system, Roboto, Arial, sans-serif;
          background-color: #fff;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        
        .loading-container {
          text-align: center;
        }
        
        .loading-text {
          font-size: 20px;
          color: rgba(0,0,0,.9);
          margin-bottom: 24px;
          font-weight: 400;
        }
        
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e6e6e6;
          border-top: 4px solid #3483fa;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="loading-container">
        <p className="loading-text">Preparando tudo para sua compra</p>
        <div className="spinner"></div>
      </div>
    </>
  )
}

