# Projeto E-commerce - Mercado Livre Clone

Projeto de e-commerce com checkout completo, separado em frontend e backend.

## 📁 Estrutura do Projeto

```
.
├── frontend/          # Interface do usuário
│   ├── *.html        # Páginas HTML
│   ├── css/          # Estilos
│   ├── fonts/        # Fontes
│   ├── images/       # Imagens
│   └── js/           # Scripts JavaScript
│
├── backend/          # API e lógica de negócio
│   ├── api/         # Rotas da API
│   └── services/    # Serviços (Mercado Pago, etc)
│
└── docs/            # Documentação
```

## 🚀 Frontend

### Páginas

- `index.html` - Página do produto
- `loading.html` - Tela de carregamento
- `seguro.html` - Seleção de seguro
- `entrega.html` - Seleção de entrega
- `endereco.html` - Endereço de entrega
- `finalizar.html` - Finalização da compra

### Como executar

Abra os arquivos HTML diretamente no navegador ou use um servidor local:

```bash
# Com Python
python -m http.server 8000

# Com Node.js
npx http-server -p 8000
```

## 🔧 Backend

### Estrutura

- `api/payments_example.py` - API de pagamentos com integração Mercado Pago
- `services/mercado_pago_service.py` - Serviço de integração Mercado Pago

### Configuração

1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Configure o `.env`:
```env
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
```

3. Execute o servidor:
```bash
uvicorn main:app --reload
```

## 💳 Integração Mercado Pago

Veja o arquivo `INTEGRACAO_MERCADO_PAGO.md` para instruções detalhadas de integração.

### Métodos suportados

- ✅ PIX
- ✅ Cartão de Crédito

## 📝 Fluxo de Compra

1. **Produto** (`index.html`) → Clique em "Comprar agora"
2. **Loading** (`loading.html`) → Tela de carregamento
3. **Seguro** (`seguro.html`) → Seleção de seguro
4. **Entrega** (`entrega.html`) → Seleção de método de entrega
5. **Endereço** (`endereco.html`) → Preenchimento do endereço
6. **Finalizar** (`finalizar.html`) → Dados pessoais e pagamento

## 🔐 Segurança

- Tokens do Mercado Pago devem ser mantidos no backend
- Nunca exponha chaves secretas no frontend
- Use HTTPS em produção

## 📚 Documentação

- `INTEGRACAO_MERCADO_PAGO.md` - Guia de integração Mercado Pago




