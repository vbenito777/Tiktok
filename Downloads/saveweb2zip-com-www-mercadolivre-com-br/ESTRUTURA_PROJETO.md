# 📁 Estrutura do Projeto

Projeto organizado separando frontend e backend.

## 📂 Estrutura de Diretórios

```
.
├── frontend/                    # Interface do usuário
│   ├── index.html              # Página do produto
│   ├── loading.html             # Tela de carregamento
│   ├── seguro.html              # Seleção de seguro
│   ├── entrega.html             # Seleção de entrega
│   ├── endereco.html            # Endereço de entrega
│   ├── finalizar.html           # Finalização da compra
│   ├── css/                     # Estilos CSS
│   ├── fonts/                   # Fontes do projeto
│   ├── images/                  # Imagens e assets
│   └── js/                      # Scripts JavaScript
│       └── mercado_pago_integration.js
│
├── backend/                     # API e lógica de negócio
│   ├── api/                     # Rotas da API
│   │   ├── __init__.py
│   │   └── payments_example.py # API de pagamentos
│   └── services/                # Serviços
│       ├── __init__.py
│       └── mercado_pago_service.py # Serviço Mercado Pago
│
└── docs/                        # Documentação
    ├── README.md
    └── INTEGRACAO_MERCADO_PAGO.md
```

## 🎯 Frontend

### Localização
Todos os arquivos HTML, CSS, imagens e scripts estão em `frontend/`

### Páginas
- **index.html** - Página principal do produto
- **loading.html** - Tela de loading após clicar em "Comprar agora"
- **seguro.html** - Seleção de seguro
- **entrega.html** - Seleção de método de entrega
- **endereco.html** - Formulário de endereço
- **finalizar.html** - Finalização com dados pessoais e pagamento

### Assets
- `css/` - Estilos
- `fonts/` - Fontes customizadas
- `images/` - Imagens e ícones
- `js/` - Scripts JavaScript (integração Mercado Pago)

## 🔧 Backend

### Localização
Código Python para API e serviços em `backend/`

### Estrutura
- **api/** - Rotas FastAPI
  - `payments_example.py` - Endpoints de pagamento
- **services/** - Serviços de integração
  - `mercado_pago_service.py` - Integração com Mercado Pago

## 📝 Documentação

- **README.md** - Visão geral do projeto
- **INTEGRACAO_MERCADO_PAGO.md** - Guia de integração Mercado Pago
- **ESTRUTURA_PROJETO.md** - Este arquivo

## 🔄 Fluxo de Navegação

```
index.html → loading.html → seguro.html → entrega.html → endereco.html → finalizar.html
```

## 📦 Próximos Passos

1. ✅ Estrutura organizada
2. ⏳ Integrar código Mercado Pago no backend
3. ⏳ Atualizar referências de caminhos nos HTMLs se necessário
4. ⏳ Configurar variáveis de ambiente
5. ⏳ Testar fluxo completo




