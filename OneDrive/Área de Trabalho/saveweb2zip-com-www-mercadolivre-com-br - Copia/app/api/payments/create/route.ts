import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Se você quiser manter o backend Python, pode fazer um proxy aqui
    // Por enquanto, retornamos um mock para manter funcionando
    
    const { amount, payment_method, payer_email, payer_name, card_token, installments } = body
    
    // Em produção, você deve chamar a API do Mercado Pago aqui
    // Por enquanto, retornamos dados mockados
    
    if (payment_method === 'PIX') {
      return NextResponse.json({
        id: Math.random().toString(36).substring(7),
        mercado_pago_id: Math.random().toString(36).substring(7),
        transaction_id: Math.random().toString(36).substring(7),
        qr_code: '00020126360014BR.GOV.BCB.PIX0114+55119999999990204000053039865802BR5909MERCADO LIVRE6009SAO PAULO62070503***6304',
        qr_code_base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        status: 'pending'
      })
    } else if (payment_method === 'CREDIT_CARD') {
      return NextResponse.json({
        id: Math.random().toString(36).substring(7),
        mercado_pago_id: Math.random().toString(36).substring(7),
        transaction_id: Math.random().toString(36).substring(7),
        status: 'APPROVED',
        amount: amount
      })
    }
    
    return NextResponse.json({ error: 'Método de pagamento não suportado' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}

