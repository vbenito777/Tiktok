'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SeguroPage() {
  const router = useRouter()
  const [selectedInsurance, setSelectedInsurance] = useState('12')

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
          background-color: #ffe600;
          height: 100px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          box-shadow: 0 1px 0 0 rgba(0,0,0,.1);
        }
        
        .nav-header .nav-bounds {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .nav-logo {
          background-image: url('/images/pt_logo_large_plus@2x.webp');
          background-repeat: no-repeat;
          background-size: contain;
          height: 34px;
          width: 134px;
          text-indent: -9999px;
          display: block;
        }
        
        .nav-header-user {
          display: flex;
          align-items: center;
          gap: 20px;
          font-size: 14px;
          color: rgba(0,0,0,.9);
        }
        
        .main-content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }
        
        .insurance-container {
          background-color: #fff;
          border-radius: 8px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.2);
        }
        
        .insurance-title {
          font-size: 28px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
          margin-bottom: 32px;
        }
        
        .insurance-options {
          margin-bottom: 24px;
        }
        
        .insurance-option {
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          padding: 20px;
          padding-right: 120px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: border-color 0.2s;
          position: relative;
          display: block;
          width: 100%;
          box-sizing: border-box;
        }
        
        .insurance-option:hover {
          border-color: #3483fa;
        }
        
        .insurance-option input[type="radio"] {
          margin-right: 12px;
          width: 18px;
          height: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }
        
        .insurance-option-label {
          display: flex;
          align-items: flex-start;
          cursor: pointer;
          width: 100%;
        }
        
        .insurance-option-content {
          flex: 1;
          min-width: 0;
        }
        
        .insurance-option-title {
          font-size: 16px;
          font-weight: 600;
          color: rgba(0,0,0,.9);
          margin-bottom: 8px;
          line-height: 1.4;
        }
        
        .insurance-option-price {
          font-size: 20px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
          margin-bottom: 4px;
        }
        
        .insurance-option-installment {
          font-size: 14px;
          color: rgba(0,0,0,.55);
        }
        
        .recommended-badge {
          background-color: #3483fa;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          position: absolute;
          top: 20px;
          right: 20px;
          white-space: nowrap;
        }
        
        .info-link {
          color: #3483fa;
          font-size: 14px;
          text-decoration: none;
          margin-bottom: 16px;
          display: inline-block;
        }
        
        .info-link:hover {
          text-decoration: underline;
        }
        
        .legal-text {
          font-size: 12px;
          color: rgba(0,0,0,.55);
          margin-bottom: 32px;
          line-height: 1.5;
        }
        
        .legal-text a {
          color: #3483fa;
          text-decoration: none;
        }
        
        .legal-text a:hover {
          text-decoration: underline;
        }
        
        .action-buttons {
          display: flex;
          gap: 16px;
        }
        
        .btn {
          flex: 1;
          padding: 14px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background-color 0.2s;
        }
        
        .btn-secondary {
          background-color: #e6e6e6;
          color: rgba(0,0,0,.9);
        }
        
        .btn-secondary:hover {
          background-color: #d4d4d4;
        }
        
        .btn-primary {
          background-color: #3483fa;
          color: #fff;
        }
        
        .btn-primary:hover {
          background-color: #2968c8;
        }
        
        .nav-footer {
          background-color: #fff;
          border-top: 1px solid #e6e6e6;
          padding: 16px 20px;
          margin-top: auto;
        }
        
        .nav-footer .nav-bounds {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .nav-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 8px;
        }
        
        .nav-footer-links a {
          color: rgba(0,0,0,.9);
          text-decoration: none;
          font-size: 13px;
        }
        
        .nav-footer-links a:hover {
          text-decoration: underline;
        }
        
        .nav-footer-copyright {
          font-size: 12px;
          color: rgba(0,0,0,.55);
          margin-top: 8px;
        }
        
        .accessibility-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          background-image: url('/images/accessibility.png');
          background-size: contain;
          margin-right: 4px;
          vertical-align: middle;
        }
      `}</style>
      <header className="nav-header">
        <div className="nav-bounds">
          <a href="/" className="nav-logo">Mercado Livre</a>
          <div className="nav-header-user">
            <span>Contato</span>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="insurance-container">
          <h1 className="insurance-title">Adicione um seguro</h1>
          
          <div className="insurance-options">
            <label 
              className="insurance-option" 
              htmlFor="insurance-12"
              onClick={() => setSelectedInsurance('12')}
            >
              <div className="insurance-option-label">
                <input 
                  type="radio" 
                  id="insurance-12" 
                  name="insurance" 
                  value="12" 
                  checked={selectedInsurance === '12'}
                  onChange={() => setSelectedInsurance('12')}
                />
                <div className="insurance-option-content">
                  <div className="insurance-option-title">12 meses de Garantia estendida</div>
                  <div className="insurance-option-price">R$ 42</div>
                  <div className="insurance-option-installment">Pague parcelado</div>
                </div>
              </div>
              <span className="recommended-badge">RECOMENDADO</span>
            </label>
            
            <label 
              className="insurance-option" 
              htmlFor="insurance-18"
              onClick={() => setSelectedInsurance('18')}
            >
              <div className="insurance-option-label">
                <input 
                  type="radio" 
                  id="insurance-18" 
                  name="insurance" 
                  value="18"
                  checked={selectedInsurance === '18'}
                  onChange={() => setSelectedInsurance('18')}
                />
                <div className="insurance-option-content">
                  <div className="insurance-option-title">18 meses de Garantia estendida</div>
                  <div className="insurance-option-price">R$ 66</div>
                  <div className="insurance-option-installment">Pague parcelado</div>
                </div>
              </div>
            </label>
          </div>
          
          <a href="#" className="info-link">Saiba como funciona</a>
          
          <p className="legal-text">
            Ao adicionar, você aceita as <a href="#">Condições gerais</a> e os <a href="#">Termos de cobrança do Prêmio do seguro</a>.
          </p>
          
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={() => router.push('/')}>Agora não</button>
            <button className="btn btn-primary" onClick={() => router.push('/entrega')}>Adicionar</button>
          </div>
        </div>
      </main>
      
      <footer className="nav-footer">
        <div className="nav-bounds">
          <div className="nav-footer-links">
            <a href="#">Trabalhe conosco</a>
            <a href="#">Termos e condições</a>
            <a href="#">Promoções</a>
            <a href="#">Como cuidamos da sua privacidade</a>
            <a href="#"><span className="accessibility-icon"></span>Acessibilidade</a>
            <a href="#">Contato</a>
            <a href="#">Informações sobre seguros</a>
            <a href="#">Programa de Afiliados</a>
            <a href="#">Lista de presentes</a>
          </div>
          <div className="nav-footer-copyright">
            Copyright © 1999-2025 Ebazar.com.br LTDA.<br />
            CNPJ n.º 03.007.331/0001-41 / Av. das Nações Unidas, nº 3.003, Bonfim, Osasco/SP - CEP 06233-903 - empresa do grupo Mercado Livre.
          </div>
        </div>
      </footer>
    </>
  )
}

