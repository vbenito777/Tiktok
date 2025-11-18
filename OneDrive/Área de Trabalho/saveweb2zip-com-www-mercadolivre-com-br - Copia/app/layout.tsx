import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mercado Livre',
  description: 'Mercado Livre - Checkout',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://sdk.mercadopago.com" />
      </head>
      <body>{children}</body>
    </html>
  )
}

