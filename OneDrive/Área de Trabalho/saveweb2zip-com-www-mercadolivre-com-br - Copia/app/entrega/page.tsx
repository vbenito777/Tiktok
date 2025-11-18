'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EntregaPage() {
  const router = useRouter()
  const [selectedDelivery, setSelectedDelivery] = useState('rapido')

  const selectDelivery = (id: string) => {
    setSelectedDelivery(id)
  }

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
          flex-direction: column;
        }
        
        .nav-header {
          background-color: #fff;
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          border-bottom: 1px solid #e6e6e6;
        }
        
        .nav-header .nav-bounds {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .back-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .back-arrow {
          width: 16px;
          height: 16px;
          border-left: 1.5px solid rgba(0,0,0,.7);
          border-bottom: 1.5px solid rgba(0,0,0,.7);
          transform: rotate(45deg);
        }
        
        .header-title {
          font-size: 16px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
          flex: 1;
        }
        
        .info-banner {
          background-color: #fff59d;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          border-radius: 4px;
        }
        
        .info-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: rgba(0,0,0,.15);
          color: rgba(0,0,0,.7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }
        
        .info-text {
          font-size: 13px;
          color: rgba(0,0,0,.6);
          line-height: 1.4;
        }
        
        .main-content {
          flex: 1;
          padding: 16px;
          padding-bottom: 120px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
        
        .shipping-section {
          background-color: #fff;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }
        
        .section-title {
          font-size: 15px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
        }
        
        .full-badge {
          background-color: #00a650;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 5px;
          border-radius: 3px;
          text-transform: uppercase;
        }
        
        .delivery-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .delivery-option {
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: border-color 0.2s;
          background-color: #fff;
        }
        
        .delivery-option:hover {
          border-color: #3483fa;
        }
        
        .delivery-option.selected {
          border-color: #3483fa;
          border-width: 2px;
        }
        
        .radio-button {
          width: 20px;
          height: 20px;
          border: 2px solid #e6e6e6;
          border-radius: 50%;
          position: relative;
          flex-shrink: 0;
        }
        
        .delivery-option.selected .radio-button {
          border-color: #3483fa;
        }
        
        .radio-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background-color: #3483fa;
          border-radius: 50%;
          display: none;
        }
        
        .delivery-option.selected .radio-button::after {
          display: block;
        }
        
        .delivery-option-content {
          flex: 1;
        }
        
        .delivery-option-title {
          font-size: 16px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
          margin-bottom: 4px;
        }
        
        .delivery-option.selected .delivery-option-title {
          color: rgba(0,0,0,.9);
          font-weight: 600;
        }
        
        .delivery-fast {
          font-weight: 600;
          color: rgba(0,0,0,.9);
        }
        
        .delivery-day {
          color: #00a650;
          font-weight: 600;
        }
        
        .delivery-option.selected .delivery-day {
          color: #00a650;
          font-weight: 600;
        }
        
        .delivery-option-subtitle {
          font-size: 14px;
          color: #3483fa;
          margin-top: 4px;
          font-weight: 400;
        }
        
        .delivery-price {
          font-size: 16px;
          font-weight: 400;
          color: #00a650;
          flex-shrink: 0;
        }
        
        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #fff;
          border-top: 1px solid #e6e6e6;
          padding: 16px;
          box-shadow: 0 -2px 8px rgba(0,0,0,.1);
        }
        
        .shipping-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .shipping-label {
          font-size: 16px;
          color: rgba(0,0,0,.9);
        }
        
        .shipping-value {
          font-size: 16px;
          font-weight: 400;
          color: #00a650;
        }
        
        .continue-button {
          width: 100%;
          background-color: #3483fa;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 16px;
          font-size: 16px;
          font-weight: 400;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .continue-button:hover {
          background-color: #2968c8;
        }
        
        .continue-button:active {
          background-color: #1f4e96;
        }
      `}</style>
      <header className="nav-header">
        <div className="nav-bounds">
          <button className="back-button" onClick={() => router.back()}>
            <div className="back-arrow"></div>
          </button>
          <h1 className="header-title">Escolha quando sua compra chegará</h1>
        </div>
      </header>
      
      <div className="info-banner">
        <div className="info-icon">i</div>
        <p className="info-text">Informe seu endereço na próxima etapa</p>
      </div>
      
      <main className="main-content">
        <div className="shipping-section">
          <div className="section-header">
            <h2 className="section-title">Envio 1</h2>
            <span className="full-badge">FULL</span>
          </div>
          
          <div className="delivery-options">
            <div 
              className={`delivery-option ${selectedDelivery === 'rapido' ? 'selected' : ''}`}
              onClick={() => selectDelivery('rapido')}
            >
              <div className="radio-button"></div>
              <div className="delivery-option-content">
                <div className="delivery-option-title">
                  <span className="delivery-fast">Rápido</span> <span className="delivery-day">Amanhã</span>
                </div>
              </div>
              <div className="delivery-price">Grátis</div>
            </div>
            
            <div 
              className={`delivery-option ${selectedDelivery === 'quinta' ? 'selected' : ''}`}
              onClick={() => selectDelivery('quinta')}
            >
              <div className="radio-button"></div>
              <div className="delivery-option-content">
                <div className="delivery-option-title">Quinta-feira</div>
              </div>
              <div className="delivery-price">Grátis</div>
            </div>
            
            <div 
              className={`delivery-option ${selectedDelivery === 'escolher' ? 'selected' : ''}`}
              onClick={() => selectDelivery('escolher')}
            >
              <div className="radio-button"></div>
              <div className="delivery-option-content">
                <div className="delivery-option-title">Seu dia de entregas</div>
                <div className="delivery-option-subtitle">Escolher dia</div>
              </div>
              <div className="delivery-price">Grátis</div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <div className="shipping-summary">
          <span className="shipping-label">Frete</span>
          <span className="shipping-value">Grátis</span>
        </div>
        <button className="continue-button" onClick={() => router.push('/endereco')}>Continuar</button>
      </footer>
    </>
  )
}

