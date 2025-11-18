'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState({
    transactionId: '-',
    amount: 'R$ 0,00',
    method: '-',
    status: 'Aprovado'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPayment = localStorage.getItem('lastPayment')
      
      if (storedPayment) {
        try {
          const payment = JSON.parse(storedPayment)
          
          const methodNames: Record<string, string> = {
            'PIX': 'PIX',
            'CREDIT_CARD': 'Cartão de Crédito',
            'credit_card': 'Cartão de Crédito',
            'pix': 'PIX'
          }
          
          const statusNames: Record<string, string> = {
            'approved': 'Aprovado',
            'APPROVED': 'Aprovado',
            'pending': 'Pendente',
            'PENDING': 'Pendente'
          }
          
          setPaymentData({
            transactionId: payment.transaction_id || '-',
            amount: payment.amount 
              ? new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(payment.amount)
              : 'R$ 0,00',
            method: methodNames[payment.payment_method] || payment.payment_method || '-',
            status: statusNames[payment.status] || payment.status || 'Aprovado'
          })
        } catch (e) {
          console.error('Erro ao carregar dados do pagamento:', e)
        }
      } else {
        // Tentar obter da URL
        const transactionId = searchParams.get('transaction_id') || searchParams.get('id')
        const amount = searchParams.get('amount')
        const method = searchParams.get('method')
        const status = searchParams.get('status')
        
        if (transactionId || amount || method || status) {
          setPaymentData({
            transactionId: transactionId || '-',
            amount: amount 
              ? new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(parseFloat(amount))
              : 'R$ 0,00',
            method: method || '-',
            status: status || 'Aprovado'
          })
        }
      }
    }
  }, [searchParams])

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
          background-color: #f5f5f5;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .success-container {
          background-color: #fff;
          border-radius: 8px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,.1);
        }
        
        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background-color: #00a650;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .success-icon::before {
          content: '✓';
          color: #fff;
          font-size: 48px;
          font-weight: bold;
        }
        
        .success-title {
          font-size: 24px;
          font-weight: 600;
          color: rgba(0,0,0,.9);
          margin-bottom: 12px;
        }
        
        .success-message {
          font-size: 16px;
          color: rgba(0,0,0,.7);
          margin-bottom: 32px;
          line-height: 1.5;
        }
        
        .success-details {
          background-color: #f5f5f5;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 32px;
          text-align: left;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }
        
        .detail-item:last-child {
          margin-bottom: 0;
        }
        
        .detail-label {
          color: rgba(0,0,0,.6);
        }
        
        .detail-value {
          color: rgba(0,0,0,.9);
          font-weight: 500;
        }
        
        .button-group {
          display: flex;
          gap: 12px;
          flex-direction: column;
        }
        
        .btn {
          padding: 14px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-primary {
          background-color: #3483fa;
          color: #fff;
        }
        
        .btn-primary:hover {
          background-color: #2968c8;
        }
        
        .btn-secondary {
          background-color: #fff;
          color: #3483fa;
          border: 1px solid #3483fa;
        }
        
        .btn-secondary:hover {
          background-color: #f5f5f5;
        }
      `}</style>
      <div className="success-container">
        <div className="success-icon"></div>
        
        <h1 className="success-title">Pagamento Aprovado!</h1>
        
        <p className="success-message">
          Seu pagamento foi processado com sucesso. Você receberá um e-mail de confirmação em breve.
        </p>
        
        <div className="success-details">
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value">{paymentData.status}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Valor:</span>
            <span className="detail-value">{paymentData.amount}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Método:</span>
            <span className="detail-value">{paymentData.method}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">ID da Transação:</span>
            <span className="detail-value" style={{fontSize: '12px', wordBreak: 'break-all'}}>{paymentData.transactionId}</span>
          </div>
        </div>
        
        <div className="button-group">
          <a href="/" className="btn btn-primary">Continuar Comprando</a>
          <button className="btn btn-secondary" onClick={() => window.print()}>Imprimir Comprovante</button>
        </div>
      </div>
    </>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  )
}

