'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './styles.module.css'

export default function EnderecoPage() {
  const router = useRouter()
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('123')
  const [complemento, setComplemento] = useState('Apto 45')
  const [bairro, setBairro] = useState('Centro')
  const [cidade, setCidade] = useState('São Paulo')
  const [uf, setUf] = useState('SP')

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length <= 5) {
      setCep(value)
    } else {
      setCep(value.substring(0, 5) + '-' + value.substring(5, 8))
    }
  }

  const saveAddressAndContinue = () => {
    if (!rua || !numero || !bairro || !cidade || !uf) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const address = {
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('deliveryAddress', JSON.stringify(address))
    }

    router.push('/finalizar')
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
          width: 100%;
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
        
        .main-content {
          flex: 1;
          padding: 16px;
          padding-bottom: 120px;
        }
        
        .location-section {
          background-color: #fff;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 16px;
        }
        
        .location-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        
        .location-icon {
          width: 20px;
          height: 20px;
          position: relative;
          flex-shrink: 0;
        }
        
        .location-icon::before {
          content: '';
          display: block;
          width: 16px;
          height: 16px;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2300a650"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>');
          background-size: contain;
          background-repeat: no-repeat;
        }
        
        .location-title {
          font-size: 16px;
          font-weight: 600;
          color: rgba(0,0,0,.9);
        }
        
        .form-section {
          background-color: #fff;
          border-radius: 6px;
          padding: 16px;
        }
        
        .form-field {
          margin-bottom: 16px;
        }
        
        .form-field.cep {
          margin-bottom: 20px;
        }
        
        .form-field.cep input {
          background-color: #f5f5f5;
        }
        
        .form-field label {
          display: block;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
          margin-bottom: 8px;
        }
        
        .form-field input,
        .form-field select {
          width: 100%;
          padding: 12px;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          font-size: 16px;
          font-family: inherit;
          color: rgba(0,0,0,.9);
          background-color: #fff;
        }
        
        .form-field input:focus,
        .form-field select:focus {
          outline: none;
          border-color: #3483fa;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
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
        
        .continue-button {
          width: 100%;
          padding: 14px;
          background-color: #3483fa;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .continue-button:hover {
          background-color: #2968c8;
        }
        
        .continue-button:active {
          background-color: #1f4fa0;
        }
        
        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .main-content {
            padding: 12px;
          }
          
          .location-section,
          .form-section {
            padding: 12px;
          }
        }
      `}</style>
      <header className="nav-header">
        <div className="nav-bounds">
          <button className="back-button" onClick={() => router.back()}>
            <div className="back-arrow"></div>
          </button>
          <h1 className="header-title">Endereço de Entrega</h1>
        </div>
      </header>
      
      <main className="main-content">
        <div className="location-section">
          <div className="location-header">
            <div className="location-icon"></div>
            <h2 className="location-title">Onde deseja receber?</h2>
          </div>
        </div>
        
        <div className="form-section">
          <form id="address-form">
            <div className="form-field cep">
              <label htmlFor="cep">CEP</label>
              <input 
                type="text" 
                id="cep" 
                name="cep" 
                placeholder="00000-000" 
                maxLength={9}
                value={cep}
                onChange={handleCepChange}
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="rua">Rua</label>
              <input 
                type="text" 
                id="rua" 
                name="rua" 
                placeholder="Nome da rua"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
              />
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="numero">Número</label>
                <input 
                  type="text" 
                  id="numero" 
                  name="numero" 
                  placeholder="123" 
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="complemento">Complemento</label>
                <input 
                  type="text" 
                  id="complemento" 
                  name="complemento" 
                  placeholder="Apto 45" 
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-field">
              <label htmlFor="bairro">Bairro</label>
              <input 
                type="text" 
                id="bairro" 
                name="bairro" 
                placeholder="Nome do bairro" 
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="cidade">Cidade</label>
                <input 
                  type="text" 
                  id="cidade" 
                  name="cidade" 
                  placeholder="Nome da cidade" 
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="uf">UF</label>
                <select 
                  id="uf" 
                  name="uf"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <footer className="footer">
        <button className="continue-button" onClick={saveAddressAndContinue}>Continuar</button>
      </footer>
    </>
  )
}

