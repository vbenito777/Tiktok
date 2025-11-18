'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function FinalizarPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('PIX')
  const [deliveryAddress, setDeliveryAddress] = useState('Carregando endereço...')
  const [pixModalOpen, setPixModalOpen] = useState(false)
  const [cardModalOpen, setCardModalOpen] = useState(false)
  const [pixQRCode, setPixQRCode] = useState('')
  const [pixCode, setPixCode] = useState('')
  const [cardError, setCardError] = useState('')
  const [cardLoading, setCardLoading] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    cardExpirationDate: '',
    securityCode: '',
    cpf: '',
    installments: '1'
  })
  const mpRef = useRef<any>(null)

  const MERCADOPAGO_PUBLIC_KEY = 'APP_USR-cd7983a0-97cb-4ac0-a3e5-737865dad04d'
  const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:8001/api/payments' 
    : '/api/payments'

  useEffect(() => {
    // Carregar endereço do localStorage
    if (typeof window !== 'undefined') {
      const addressData = JSON.parse(localStorage.getItem('deliveryAddress') || '{}')
      if (addressData && Object.keys(addressData).length > 0) {
        let addressParts = []
        if (addressData.rua) {
          let ruaPart = addressData.rua
          if (addressData.numero) ruaPart += ', ' + addressData.numero
          if (addressData.complemento) ruaPart += ' - ' + addressData.complemento
          addressParts.push(ruaPart)
        }
        if (addressData.bairro) addressParts.push(addressData.bairro)
        if (addressData.cidade && addressData.uf) {
          addressParts.push(addressData.cidade + '/' + addressData.uf)
        } else if (addressData.cidade) {
          addressParts.push(addressData.cidade)
        }
        if (addressData.cep) addressParts.push('CEP ' + addressData.cep)
        setDeliveryAddress(addressParts.join(' - '))
      } else {
        setDeliveryAddress('Endereço não informado')
      }
    }
  }, [])

  useEffect(() => {
    // Inicializar Mercado Pago SDK
    if (typeof window !== 'undefined' && window.MercadoPago && !mpRef.current) {
      mpRef.current = new window.MercadoPago(MERCADOPAGO_PUBLIC_KEY, {
        locale: 'pt-BR'
      })
    }
  }, [])

  const formatPhone = (value: string) => {
    let v = value.replace(/\D/g, '')
    if (v.length > 11) v = v.substring(0, 11)
    if (v.length > 10) {
      v = v.substring(0, 2) + ')' + v.substring(2, 7) + '-' + v.substring(7)
    } else if (v.length > 6) {
      v = v.substring(0, 2) + ')' + v.substring(2, 6) + '-' + v.substring(6)
    } else if (v.length > 2) {
      v = '(' + v.substring(0, 2) + ')' + v.substring(2)
    } else if (v.length > 0) {
      v = '(' + v
    }
    return v
  }

  const formatCardNumber = (value: string) => {
    let v = value.replace(/\s/g, '')
    if (v.length > 16) v = v.substring(0, 16)
    return v.match(/.{1,4}/g)?.join(' ') || v
  }

  const formatExpiration = (value: string) => {
    let v = value.replace(/\D/g, '')
    if (v.length > 4) v = v.substring(0, 4)
    if (v.length > 2) {
      v = v.substring(0, 2) + '/' + v.substring(2)
    }
    return v
  }

  const formatCPF = (value: string) => {
    let v = value.replace(/\D/g, '')
    if (v.length > 11) v = v.substring(0, 11)
    if (v.length > 9) {
      v = v.substring(0, 3) + '.' + v.substring(3, 6) + '.' + v.substring(6, 9) + '-' + v.substring(9)
    } else if (v.length > 6) {
      v = v.substring(0, 3) + '.' + v.substring(3, 6) + '.' + v.substring(6)
    } else if (v.length > 3) {
      v = v.substring(0, 3) + '.' + v.substring(3)
    }
    return v
  }

  const handleFinalizePurchase = async () => {
    if (!nome || !email || !telefone) {
      alert('Por favor, preencha todos os campos de dados pessoais')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um e-mail válido')
      return
    }

    if (selectedPayment === 'PIX') {
      await processPixPayment()
    } else if (selectedPayment === 'Cartão de Crédito') {
      setCardModalOpen(true)
    }
  }

  const processPixPayment = async () => {
    try {
      setPixModalOpen(true)
      
      const orderData = {
        amount: 149.90,
        description: 'Fritadeira Elétrica Air Fryer WAP Mega Family',
        payment_method: 'PIX',
        payer_email: email,
        payer_name: nome,
        payer_phone: telefone
      }

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erro ao criar pagamento PIX')
      }

      const paymentData = await response.json()

      if (paymentData.qr_code_base64) {
        setPixQRCode(paymentData.qr_code_base64)
      }
      if (paymentData.qr_code) {
        setPixCode(paymentData.qr_code)
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('currentPayment', JSON.stringify({
          payment_id: paymentData.id,
          mercado_pago_id: paymentData.mercado_pago_id,
          transaction_id: paymentData.transaction_id,
        }))
      }

      if (paymentData.mercado_pago_id) {
        checkPaymentStatus(paymentData.mercado_pago_id)
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento PIX:', error)
      alert('Erro ao processar pagamento PIX: ' + error.message)
      setPixModalOpen(false)
    }
  }

  const processCardPayment = async () => {
    try {
      setCardError('')
      setCardLoading(true)

      const cardNumber = cardData.cardNumber.replace(/\s/g, '')
      const cpf = cardData.cpf.replace(/\D/g, '')

      if (!cardNumber || !cardData.cardholderName || !cardData.cardExpirationDate || !cardData.securityCode || !cpf) {
        setCardError('Por favor, preencha todos os campos')
        setCardLoading(false)
        return
      }

      if (cardNumber.length < 13 || cardNumber.length > 16) {
        setCardError('Número do cartão inválido')
        setCardLoading(false)
        return
      }

      if (cpf.length !== 11) {
        setCardError('CPF inválido')
        setCardLoading(false)
        return
      }

      if (!mpRef.current) {
        throw new Error('SDK do Mercado Pago não carregado')
      }

      const [month, year] = cardData.cardExpirationDate.split('/')
      const tokenResponse = await mpRef.current.fields.createCardToken({
        cardNumber: cardNumber,
        cardholderName: cardData.cardholderName,
        cardExpirationMonth: month,
        cardExpirationYear: '20' + year,
        securityCode: cardData.securityCode,
        identificationType: 'CPF',
        identificationNumber: cpf,
      })

      if (tokenResponse.error) {
        throw new Error(tokenResponse.error.message || 'Erro ao processar cartão')
      }

      const orderData = {
        amount: 149.90,
        description: 'Fritadeira Elétrica Air Fryer WAP Mega Family',
        payment_method: 'CREDIT_CARD',
        payer_email: email,
        payer_name: nome,
        payer_phone: telefone,
        card_token: tokenResponse.id,
        installments: parseInt(cardData.installments)
      }

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erro ao processar pagamento')
      }

      const paymentData = await response.json()

      if (paymentData.status === 'APPROVED' || paymentData.status === 'approved') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastPayment', JSON.stringify({
            transaction_id: paymentData.transaction_id,
            amount: paymentData.amount,
            payment_method: 'CREDIT_CARD',
            status: 'approved'
          }))
        }
        alert('Pagamento aprovado! Redirecionando...')
        router.push('/success')
      } else if (paymentData.status === 'PENDING' || paymentData.status === 'pending') {
        alert('Pagamento pendente. Aguardando confirmação...')
        if (paymentData.mercado_pago_id) {
          checkPaymentStatus(paymentData.mercado_pago_id)
        }
      } else {
        throw new Error(paymentData.error || 'Pagamento rejeitado')
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento com cartão:', error)
      setCardError(error.message || 'Erro ao processar pagamento. Tente novamente.')
      setCardLoading(false)
    }
  }

  const checkPaymentStatus = async (mercadoPagoId: string) => {
    const maxAttempts = 60
    let attempts = 0

    const interval = setInterval(async () => {
      attempts++

      try {
        const response = await fetch(`${API_BASE_URL}/status/${mercadoPagoId}`)
        if (!response.ok) {
          if (attempts >= maxAttempts) {
            clearInterval(interval)
          }
          return
        }

        const data = await response.json()

        if (data.status === 'APPROVED' || data.status === 'approved') {
          clearInterval(interval)
          if (typeof window !== 'undefined') {
            localStorage.setItem('lastPayment', JSON.stringify({
              transaction_id: data.transaction_id,
              amount: data.amount,
              payment_method: 'PIX',
              status: 'approved'
            }))
          }
          alert('Pagamento aprovado! Redirecionando...')
          router.push('/success')
        } else if (data.status === 'REJECTED' || data.status === 'rejected') {
          clearInterval(interval)
          alert('Pagamento rejeitado. Tente novamente.')
          setPixModalOpen(false)
        } else if (attempts >= maxAttempts) {
          clearInterval(interval)
          alert('Tempo de espera esgotado. Verifique o status do pagamento mais tarde.')
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error)
        if (attempts >= maxAttempts) {
          clearInterval(interval)
        }
      }
    }, 5000)
  }

  const copyPixCode = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pixCode).then(() => {
        alert('Código PIX copiado!')
      })
    }
  }

  return (
    <>
      <Script src="https://sdk.mercadopago.com/js/v2" strategy="beforeInteractive" />
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
          padding-bottom: 200px;
        }
        
        .section {
          background-color: #fff;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 12px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: rgba(0,0,0,.9);
          margin-bottom: 16px;
        }
        
        .product-info {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .product-image {
          width: 80px;
          height: 80px;
          background-color: #f5f5f5;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .product-image::before {
          content: '🍟';
          font-size: 40px;
        }
        
        .product-details {
          flex: 1;
        }
        
        .product-name {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
          margin-bottom: 8px;
        }
        
        .product-price {
          font-size: 20px;
          font-weight: 600;
          color: rgba(0,0,0,.9);
          margin-bottom: 4px;
        }
        
        .product-quantity {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0,0,0,.55);
        }
        
        .delivery-address-card {
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          padding: 12px;
          margin-top: 16px;
        }
        
        .delivery-address-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .location-icon {
          width: 16px;
          height: 16px;
          position: relative;
        }
        
        .location-icon::before {
          content: '';
          width: 10px;
          height: 14px;
          border: 2px solid #00a650;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%) rotate(-45deg);
        }
        
        .location-icon::after {
          content: '';
          width: 5px;
          height: 5px;
          background-color: #00a650;
          border-radius: 50%;
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .delivery-address-title {
          font-size: 14px;
          font-weight: 600;
          color: rgba(0,0,0,.9);
        }
        
        .delivery-address-text {
          font-size: 13px;
          font-weight: 400;
          color: rgba(0,0,0,.55);
          line-height: 1.4;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group:last-child {
          margin-bottom: 0;
        }
        
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
          margin-bottom: 8px;
        }
        
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
          background-color: #fff;
          transition: border-color 0.2s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #3483fa;
        }
        
        .form-group input::placeholder {
          color: rgba(0,0,0,.3);
        }
        
        .payment-option {
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: border-color 0.2s;
          background-color: #fff;
        }
        
        .payment-option:last-child {
          margin-bottom: 0;
        }
        
        .payment-option:hover {
          border-color: #3483fa;
        }
        
        .payment-option.selected {
          border-color: #3483fa;
          border-width: 2px;
        }
        
        .payment-option-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        
        .payment-icon {
          width: 32px;
          height: 24px;
          background-color: #e3f2fd;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }
        
        .payment-icon.pix-icon::before {
          content: 'PIX';
          position: absolute;
          font-size: 9px;
          font-weight: 700;
          color: #2196f3;
          letter-spacing: 0.3px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          line-height: 1;
        }
        
        .payment-icon.card-icon::before {
          content: '';
          width: 24px;
          height: 16px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232196f3'%3E%3Cpath d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        
        .payment-info {
          flex: 1;
        }
        
        .payment-name {
          font-size: 16px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
          margin-bottom: 4px;
        }
        
        .payment-subtitle {
          font-size: 13px;
          font-weight: 400;
          color: rgba(0,0,0,.55);
        }
        
        .radio-button {
          width: 20px;
          height: 20px;
          border: 2px solid #e6e6e6;
          border-radius: 50%;
          position: relative;
          flex-shrink: 0;
        }
        
        .payment-option.selected .radio-button {
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
        
        .payment-option.selected .radio-button::after {
          display: block;
        }
        
        .payment-description {
          font-size: 13px;
          font-weight: 400;
          color: rgba(0,0,0,.55);
          line-height: 1.4;
          margin-top: 8px;
          padding-left: 44px;
        }
        
        .order-summary {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e6e6e6;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .summary-row:last-child {
          margin-bottom: 0;
        }
        
        .summary-label {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
        }
        
        .summary-value {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0,0,0,.9);
        }
        
        .summary-value.free {
          color: #00a650;
        }
        
        .summary-row.total .summary-label {
          font-weight: 600;
        }
        
        .summary-row.total .summary-value {
          font-size: 18px;
          font-weight: 600;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          padding: 16px;
        }
        
        .modal-overlay.active {
          display: flex;
        }
        
        .modal {
          background: #fff;
          border-radius: 8px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          position: relative;
        }
        
        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #e6e6e6;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: rgba(0,0,0,.9);
        }
        
        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: rgba(0,0,0,.55);
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-close:hover {
          color: rgba(0,0,0,.9);
        }
        
        .modal-body {
          padding: 20px;
        }
        
        .modal-footer {
          padding: 20px;
          border-top: 1px solid #e6e6e6;
          display: flex;
          gap: 12px;
        }
        
        .pix-qr-container {
          text-align: center;
          margin: 20px 0;
        }
        
        .pix-qr-code {
          width: 250px;
          height: 250px;
          margin: 0 auto 20px;
          border: 1px solid #e6e6e6;
          border-radius: 8px;
          padding: 16px;
          background: #fff;
        }
        
        .pix-qr-code img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .pix-code-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          font-size: 12px;
          font-family: monospace;
          margin-bottom: 12px;
        }
        
        .pix-instructions {
          background: #f5f5f5;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .pix-instructions p {
          font-size: 13px;
          color: rgba(0,0,0,.7);
          margin-bottom: 8px;
        }
        
        .pix-instructions p:last-child {
          margin-bottom: 0;
        }
        
        .card-form-group {
          margin-bottom: 16px;
        }
        
        .card-form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: rgba(0,0,0,.9);
          margin-bottom: 8px;
        }
        
        .card-form-group input,
        .card-form-group select {
          width: 100%;
          padding: 12px;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
        }
        
        .card-form-group input:focus,
        .card-form-group select:focus {
          outline: none;
          border-color: #3483fa;
        }
        
        .card-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        .btn-primary {
          background: #3483fa;
          color: #fff;
          border: none;
          padding: 14px 24px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }
        
        .btn-primary:hover {
          background: #2968c8;
        }
        
        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: #fff;
          color: rgba(0,0,0,.9);
          border: 1px solid #e6e6e6;
          padding: 14px 24px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
        }
        
        .btn-secondary:hover {
          background: #f5f5f5;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .error-message {
          background: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 13px;
        }
        
        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #fff;
          border-top: 1px solid #e6e6e6;
          padding: 16px;
        }
        
        .finalize-button {
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
        
        .finalize-button:hover {
          background-color: #2968c8;
        }
        
        .finalize-button:active {
          background-color: #1f4e96;
        }
      `}</style>
      <header className="nav-header">
        <div className="nav-bounds">
          <button className="back-button" onClick={() => router.back()}>
            <div className="back-arrow"></div>
          </button>
          <h1 className="header-title">Finalizar Compra</h1>
        </div>
      </header>
      
      <main className="main-content">
        <div className="section">
          <h2 className="section-title">Seu Pedido</h2>
          
          <div className="product-info">
            <div className="product-image"></div>
            <div className="product-details">
              <div className="product-name">Fritadeira Elétrica Air Fryer 4L</div>
              <div className="product-price">R$ 149,90</div>
              <div className="product-quantity">Quantidade: 1</div>
            </div>
          </div>
          
          <div className="delivery-address-card">
            <div className="delivery-address-header">
              <div className="location-icon"></div>
              <div className="delivery-address-title">Endereço de Entrega</div>
            </div>
            <div className="delivery-address-text">{deliveryAddress}</div>
          </div>
        </div>
        
        <div className="section">
          <h2 className="section-title">Seus Dados</h2>
          
          <form>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input 
                type="text" 
                id="nome" 
                name="nome" 
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input 
                type="tel" 
                id="telefone" 
                name="telefone" 
                placeholder="(00) 00000-0000" 
                maxLength={15}
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
              />
            </div>
          </form>
        </div>
        
        <div className="section">
          <h2 className="section-title">Forma de Pagamento</h2>
          
          <div 
            className={`payment-option ${selectedPayment === 'PIX' ? 'selected' : ''}`}
            onClick={() => setSelectedPayment('PIX')}
          >
            <div className="payment-option-header">
              <div className="payment-icon pix-icon"></div>
              <div className="payment-info">
                <div className="payment-name">PIX</div>
                <div className="payment-subtitle">Aprovação imediata</div>
              </div>
              <div className="radio-button"></div>
            </div>
            <div className="payment-description">
              Pagamento rápido e seguro. Você receberá o QR Code para pagar após confirmar o pedido.
            </div>
          </div>
          
          <div 
            className={`payment-option ${selectedPayment === 'Cartão de Crédito' ? 'selected' : ''}`}
            onClick={() => setSelectedPayment('Cartão de Crédito')}
          >
            <div className="payment-option-header">
              <div className="payment-icon card-icon"></div>
              <div className="payment-info">
                <div className="payment-name">Cartão de Crédito</div>
                <div className="payment-subtitle">Em até 12x sem juros</div>
              </div>
              <div className="radio-button"></div>
            </div>
          </div>
          
          <div className="order-summary">
            <div className="summary-row">
              <span className="summary-label">Produto</span>
              <span className="summary-value">R$ 149,90</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Frete</span>
              <span className="summary-value free">Grátis</span>
            </div>
            <div className="summary-row total">
              <span className="summary-label">Total</span>
              <span className="summary-value">R$ 149,90</span>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <button className="finalize-button" onClick={handleFinalizePurchase}>Finalizar Compra</button>
      </footer>
      
      {/* Modal PIX */}
      {pixModalOpen && (
        <div className="modal-overlay active" onClick={() => setPixModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Pagamento PIX</h2>
              <button className="modal-close" onClick={() => setPixModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="pix-instructions">
                <p><strong>1.</strong> Escaneie o QR Code com o app do seu banco</p>
                <p><strong>2.</strong> Ou copie o código PIX e cole no app</p>
                <p><strong>3.</strong> O pagamento será confirmado automaticamente</p>
              </div>
              <div className="pix-qr-container">
                <div className="pix-qr-code">
                  {pixQRCode ? (
                    <img src={`data:image/png;base64,${pixQRCode}`} alt="QR Code PIX" />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                </div>
                <input type="text" className="pix-code-input" value={pixCode} readOnly />
                <button className="btn-primary" onClick={copyPixCode}>Copiar código PIX</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Cartão de Crédito */}
      {cardModalOpen && (
        <div className="modal-overlay active" onClick={() => setCardModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Pagamento com Cartão</h2>
              <button className="modal-close" onClick={() => setCardModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {cardError && <div className="error-message">{cardError}</div>}
              <form id="cardForm">
                <div className="card-form-group">
                  <label>Número do Cartão</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    maxLength={19}
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({...cardData, cardNumber: formatCardNumber(e.target.value)})}
                    required
                  />
                </div>
                <div className="card-form-group">
                  <label>Nome no Cartão</label>
                  <input 
                    type="text" 
                    placeholder="Nome como está no cartão" 
                    value={cardData.cardholderName}
                    onChange={(e) => setCardData({...cardData, cardholderName: e.target.value})}
                    required
                  />
                </div>
                <div className="card-form-row">
                  <div className="card-form-group">
                    <label>Validade</label>
                    <input 
                      type="text" 
                      placeholder="MM/AA" 
                      maxLength={5}
                      value={cardData.cardExpirationDate}
                      onChange={(e) => setCardData({...cardData, cardExpirationDate: formatExpiration(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="card-form-group">
                    <label>CVV</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      maxLength={4}
                      value={cardData.securityCode}
                      onChange={(e) => setCardData({...cardData, securityCode: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="card-form-group">
                  <label>CPF do Titular</label>
                  <input 
                    type="text" 
                    placeholder="000.000.000-00" 
                    maxLength={14}
                    value={cardData.cpf}
                    onChange={(e) => setCardData({...cardData, cpf: formatCPF(e.target.value)})}
                    required
                  />
                </div>
                <div className="card-form-group">
                  <label>Parcelas</label>
                  <select 
                    value={cardData.installments}
                    onChange={(e) => setCardData({...cardData, installments: e.target.value})}
                    required
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                      <option key={i} value={i.toString()}>{i}x sem juros</option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setCardModalOpen(false)}>Cancelar</button>
              <button 
                className="btn-primary" 
                onClick={processCardPayment} 
                disabled={cardLoading}
              >
                {cardLoading ? (
                  <>
                    <span className="loading-spinner"></span> Processando...
                  </>
                ) : (
                  'Finalizar Pagamento'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

