# Mercado Livre Checkout - Next.js

Projeto de checkout convertido para Next.js mantendo 100% do design original.

## Estrutura do Projeto

### Arquivos Necessários (Next.js)
- `/app` - Páginas e rotas do Next.js
- `/public` - Assets estáticos (imagens, fontes)
- `package.json` - Dependências Node.js
- `next.config.js` - Configuração do Next.js
- `tsconfig.json` - Configuração TypeScript
- `vercel.json` - Configuração Vercel (opcional)

### Arquivos Opcionais
- `/backend` - Backend Python (opcional, pode ser usado separadamente)
- `requirements.txt` - Dependências Python (só se usar o backend Python)

## Páginas

- `/` - Página inicial (redireciona para seguro)
- `/seguro` - Página de seguro
- `/entrega` - Escolha de entrega
- `/endereco` - Endereço de entrega
- `/finalizar` - Finalização da compra
- `/success` - Página de sucesso
- `/loading` - Página de loading

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## API Routes

- `POST /api/payments/create` - Criar pagamento
- `GET /api/payments/status/[id]` - Verificar status do pagamento

## Notas

- O design foi mantido 100% fiel ao original
- Os estilos CSS foram preservados exatamente como estavam
- O backend Python pode ser mantido separadamente ou integrado via API routes do Next.js

