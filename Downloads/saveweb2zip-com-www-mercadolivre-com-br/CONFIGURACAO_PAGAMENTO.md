# ✅ Configuração de Pagamento - Mercado Pago

## 🎉 Integração Configurada!

As credenciais do Mercado Pago foram configuradas com sucesso:

### ✅ Frontend
- **Chave Pública:** `APP_USR-cd7983a0-97cb-4ac0-a3e5-737865dad04d`
- **Arquivo:** `frontend/finalizar.html` (linha 966)
- **URL da API:** `http://localhost:8001/api/payments`

### ✅ Backend
- **Access Token:** `APP_USR-6061834737027144-100216-686a6893aafd59eccf38db11db199080-577440377`
- **Arquivo:** `backend/core/config.py`

---

## 🚀 Como Executar

### ⚡ Resumo Rápido

```bash
# 1. Navegue até o backend
cd backend

# 2. (Opcional) Crie ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac

# 3. Instale dependências
pip install -r requirements.txt

# 4. Inicie o servidor
python main.py
# ou
uvicorn main:app --reload --port 8001
```

---

### 📦 Instalação do Backend (Detalhada)

#### Pré-requisitos

1. **Python 3.8 ou superior** instalado
   - Verifique a versão: `python --version` ou `python3 --version`
   - Se não tiver Python, baixe em: https://www.python.org/downloads/

2. **pip** (gerenciador de pacotes Python)
   - Geralmente vem com Python
   - Verifique: `pip --version` ou `pip3 --version`

#### Passo a Passo da Instalação

**1. Navegue até a pasta do backend**

```bash
cd backend
```

**2. (Recomendado) Crie um ambiente virtual**

Isso isola as dependências do projeto e evita conflitos:

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Você saberá que o ambiente virtual está ativo quando ver `(venv)` no início da linha do terminal.

**3. Instale as dependências**

```bash
pip install -r requirements.txt
```

Ou se estiver usando Python 3 explicitamente:

```bash
pip3 install -r requirements.txt
```

**4. Verifique a instalação**

Verifique se as dependências foram instaladas corretamente:

```bash
pip list
```

Você deve ver pacotes como:
- `fastapi`
- `uvicorn`
- `mercadopago`
- `pydantic`
- `sqlalchemy`

**5. Teste se o servidor inicia corretamente**

```bash
python main.py
```

Ou usando uvicorn diretamente:

```bash
uvicorn main:app --reload --port 8001
```

Se tudo estiver correto, você verá uma mensagem como:
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**6. Acesse a API**

Abra no navegador: `http://localhost:8001`

Você deve ver uma resposta JSON com informações da API.

Acesse a documentação interativa: `http://localhost:8001/docs`

---

### 🎯 Iniciar o Servidor Backend

Após a instalação, você pode iniciar o servidor de duas formas:

**Opção 1: Usando o arquivo main.py**
```bash
cd backend
python main.py
```

**Opção 2: Usando uvicorn diretamente (recomendado para desenvolvimento)**
```bash
cd backend
uvicorn main:app --reload --port 8001
```

**Parâmetros úteis:**
- `--reload`: Recarrega automaticamente quando você faz alterações no código
- `--port 8001`: Define a porta (padrão é 8000)
- `--host 0.0.0.0`: Permite acesso de outras máquinas na rede

O servidor estará disponível em: `http://localhost:8001`

### 3. Iniciar o Frontend

Abra o arquivo `frontend/finalizar.html` no navegador ou use um servidor local:

```bash
cd frontend
python -m http.server 8000
```

Acesse: `http://localhost:8000/finalizar.html`

---

## 📋 Endpoints da API

### Criar Pagamento
```
POST /api/payments/create
```

**Body (PIX):**
```json
{
  "amount": 149.90,
  "description": "Fritadeira Elétrica Air Fryer WAP Mega Family",
  "payment_method": "PIX",
  "payer_email": "comprador@example.com",
  "payer_name": "João Silva"
}
```

**Body (Cartão de Crédito):**
```json
{
  "amount": 149.90,
  "description": "Fritadeira Elétrica Air Fryer WAP Mega Family",
  "payment_method": "CREDIT_CARD",
  "payer_email": "comprador@example.com",
  "payer_name": "João Silva",
  "card_token": "token_gerado_pelo_frontend",
  "installments": 1
}
```

### Verificar Status do Pagamento
```
GET /api/payments/status/{mercado_pago_id}
```

### Webhook (para notificações do Mercado Pago)
```
POST /api/payments/webhook
```

---

## 🧪 Testando

### Cartões de Teste (Ambiente de Testes)

**Cartão Aprovado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: Qualquer data futura
- Nome: Qualquer nome
- CPF: Qualquer CPF válido

**Cartão Rejeitado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: Qualquer data futura
- Nome: Qualquer nome
- CPF: Qualquer CPF válido

### PIX de Teste

O Mercado Pago fornecerá um QR Code de teste que pode ser usado para simular pagamentos.

---

## 📝 Próximos Passos

1. ✅ Credenciais configuradas
2. ✅ Estrutura do backend criada
3. ✅ Frontend configurado
4. ✅ Página de sucesso criada (`frontend/success.html`)
5. ⚠️ **TESTAR A INTEGRAÇÃO** - Execute o backend e frontend e teste um pagamento
6. ⚠️ **Configurar banco de dados** (opcional) - Atualmente usando armazenamento em memória
7. ⚠️ **Configurar webhook** (opcional) - Para receber notificações do Mercado Pago

> 📌 **Veja o arquivo `PROXIMOS_PASSOS.md` para um guia passo a passo do que fazer agora!**

---

## 🔧 Estrutura Criada

```
backend/
├── core/
│   ├── __init__.py
│   ├── config.py          # Configurações (Access Token)
│   └── database.py        # Configuração do banco (mockado)
├── models/
│   ├── __init__.py
│   ├── payment.py         # Modelo de pagamento
│   └── plan.py            # Modelo de plano (opcional)
├── api/
│   └── payments_example.py # API de pagamentos
├── services/
│   └── mercado_pago_service.py # Serviço Mercado Pago
├── main.py                # Aplicação FastAPI
└── requirements.txt        # Dependências
```

---

## ⚠️ Observações Importantes

1. **Ambiente de Testes:** As credenciais fornecidas são para ambiente de testes. Para produção, você precisará de credenciais de produção.

2. **Banco de Dados:** Atualmente o sistema usa armazenamento em memória. Para produção, configure um banco de dados real (PostgreSQL, MySQL, etc.) e atualize `backend/core/database.py`.

3. **CORS:** O CORS está configurado para permitir todas as origens (`allow_origins=["*"]`). Em produção, especifique os domínios permitidos.

4. **Webhook:** Para receber notificações do Mercado Pago em produção, configure a URL do webhook no painel do Mercado Pago e atualize `WEBHOOK_URL` em `backend/core/config.py`.

---

## 🆘 Suporte e Troubleshooting

### Problemas Comuns

#### ❌ Erro: "python não é reconhecido como comando"

**Solução:**
- Use `python3` em vez de `python`
- Ou adicione Python ao PATH do sistema
- No Windows, reinstale Python marcando "Add Python to PATH"

#### ❌ Erro: "pip não é reconhecido"

**Solução:**
- Use `pip3` em vez de `pip`
- Ou instale pip: `python -m ensurepip --upgrade`

#### ❌ Erro: "ModuleNotFoundError: No module named 'fastapi'"

**Solução:**
- Certifique-se de que está no diretório `backend`
- Verifique se o ambiente virtual está ativado
- Reinstale as dependências: `pip install -r requirements.txt`

#### ❌ Erro: "Address already in use" (porta 8001 ocupada)

**Solução:**
- Feche outros processos usando a porta 8001
- Ou use outra porta: `uvicorn main:app --reload --port 8002`
- Atualize a URL no frontend também

#### ❌ Erro ao importar módulos do backend

**Solução:**
- Certifique-se de que está executando a partir da raiz do projeto
- Verifique se todos os arquivos `__init__.py` existem nas pastas
- Execute: `python -m backend.main` em vez de `python main.py`

#### ❌ Erro de conexão com o Mercado Pago

**Solução:**
- Verifique se o Access Token está correto em `backend/core/config.py`
- Verifique sua conexão com a internet
- Certifique-se de que as credenciais são válidas (teste ou produção)

### Verificações de Diagnóstico

**1. Verificar se o backend está rodando:**
```bash
curl http://localhost:8001
```
Ou abra no navegador: `http://localhost:8001`

**2. Verificar se as credenciais estão corretas:**
```bash
# Windows PowerShell
Get-Content backend\core\config.py | Select-String "MERCADOPAGO_ACCESS_TOKEN"

# Linux/Mac
grep "MERCADOPAGO_ACCESS_TOKEN" backend/core/config.py
```

**3. Verificar logs do backend:**
Os logs aparecem no terminal onde você executou o servidor. Procure por mensagens de erro em vermelho.

**4. Testar endpoint manualmente:**
```bash
curl -X POST http://localhost:8001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{"amount": 10.00, "description": "Teste", "payment_method": "PIX", "payer_email": "test@test.com", "payer_name": "Teste"}'
```

### Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Python 3.8+ está instalado
- [ ] Ambiente virtual está ativado (se estiver usando)
- [ ] Todas as dependências estão instaladas (`pip list`)
- [ ] Backend está rodando na porta 8001
- [ ] Credenciais do Mercado Pago estão configuradas
- [ ] Não há erros nos logs do terminal
- [ ] Firewall não está bloqueando a porta 8001
- [ ] Frontend está apontando para a URL correta da API

### Obter Ajuda

Se ainda tiver problemas:

1. Verifique os logs do backend no terminal
2. Verifique se todas as dependências estão instaladas: `pip list`
3. Tente reinstalar as dependências: `pip install -r requirements.txt --upgrade`
4. Verifique a documentação do FastAPI: https://fastapi.tiangolo.com/
5. Verifique a documentação do Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs

