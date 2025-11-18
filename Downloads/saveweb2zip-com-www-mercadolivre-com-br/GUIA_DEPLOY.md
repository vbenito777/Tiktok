# 🚀 Guia de Deploy - Hospedagem do Projeto

## 📌 Importante: Entendendo a Arquitetura

Este projeto tem **2 partes** que precisam ser hospedadas separadamente:

1. **Frontend** (HTML/CSS/JS) - Pode ir na **Vercel** ✅
2. **Backend** (FastAPI/Python) - Precisa de hospedagem Python (NÃO Vercel) ⚠️

---

## 🎯 Opções de Hospedagem

### Frontend (Vercel, Netlify, GitHub Pages)

✅ **Vercel** - Recomendado para frontend
✅ **Netlify** - Alternativa fácil
✅ **GitHub Pages** - Grátis, mas limitado

### Backend (Precisa suportar Python/FastAPI)

✅ **Railway** - Fácil e grátis (recomendado)
✅ **Render** - Grátis com limitações
✅ **Heroku** - Pago (não tem mais plano grátis)
✅ **DigitalOcean** - Pago, mas barato
✅ **Fly.io** - Grátis com limites

---

## 📋 Passo a Passo Completo

### 1️⃣ Deploy do Backend (FastAPI)

#### Opção A: Railway (Recomendado - Mais Fácil)

1. **Crie conta em:** https://railway.app
2. **Conecte seu repositório GitHub** (ou faça upload)
3. **Crie novo projeto** → "Deploy from GitHub repo"
4. **Selecione o repositório** e a pasta `backend`
5. **Configure as variáveis de ambiente:**
   ```
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-6061834737027144-100216-686a6893aafd59eccf38db11db199080-577440377
   ```
6. **Railway detecta automaticamente** que é Python e instala dependências
7. **Configure a porta:** Railway usa variável `PORT` automaticamente
8. **Anote a URL gerada:** `https://seu-projeto.railway.app`

**Ajuste no `main.py` para Railway:**
```python
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

#### Opção B: Render

1. **Crie conta em:** https://render.com
2. **New → Web Service**
3. **Conecte repositório GitHub**
4. **Configure:**
   - **Name:** `seu-backend-pagamentos`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Adicione variável de ambiente:**
   - `MERCADOPAGO_ACCESS_TOKEN` = seu token
6. **Deploy!**
7. **Anote a URL:** `https://seu-backend-pagamentos.onrender.com`

---

### 2️⃣ Deploy do Frontend (Vercel)

#### Passo a Passo na Vercel:

1. **Crie conta em:** https://vercel.com
2. **Conecte seu repositório GitHub**
3. **Import Project** → Selecione seu repositório
4. **Configure:**
   - **Framework Preset:** Other (ou Static HTML)
   - **Root Directory:** `frontend`
   - **Build Command:** (deixe vazio ou `echo "No build needed"`)
   - **Output Directory:** `frontend`
5. **Deploy!**
6. **Anote a URL:** `https://seu-projeto.vercel.app`

#### ⚠️ IMPORTANTE: Atualizar URL do Backend no Frontend

Após fazer deploy do backend, você precisa atualizar a URL da API no frontend:

**Arquivo:** `frontend/finalizar.html` (linha ~967)

**Antes:**
```javascript
const API_BASE_URL = 'http://localhost:8001/api/payments';
```

**Depois (com URL do backend hospedado):**
```javascript
const API_BASE_URL = 'https://seu-backend.railway.app/api/payments';
// ou
const API_BASE_URL = 'https://seu-backend-pagamentos.onrender.com/api/payments';
```

**Depois de alterar, faça commit e push:**
```bash
git add frontend/finalizar.html
git commit -m "Atualizar URL da API para produção"
git push
```

A Vercel vai fazer redeploy automaticamente.

---

## 🔧 Configurações Necessárias

### Backend - Variáveis de Ambiente

Configure estas variáveis no painel da sua hospedagem:

```
MERCADOPAGO_ACCESS_TOKEN=APP_USR-6061834737027144-100216-686a6893aafd59eccf38db11db199080-577440377
```

### Frontend - Ajustes Finais

1. ✅ URL da API atualizada para produção
2. ✅ Chave pública do Mercado Pago já está configurada
3. ✅ CORS no backend já permite todas as origens (ajuste se necessário)

---

## 🧪 Testando em Produção

### 1. Teste o Backend

Acesse a URL do backend:
- `https://seu-backend.railway.app` ou similar
- Deve mostrar JSON com informações da API
- Acesse: `https://seu-backend.railway.app/docs` para documentação

### 2. Teste o Frontend

Acesse a URL do frontend:
- `https://seu-projeto.vercel.app/finalizar.html`
- Preencha os dados
- Teste um pagamento (use dados de teste do Mercado Pago)

### 3. Verifique CORS

Se der erro de CORS, ajuste no `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://seu-projeto.vercel.app",
        "http://localhost:8000",  # Para desenvolvimento local
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## ⚠️ Problemas Comuns

### ❌ Erro: "CORS policy"

**Solução:** Adicione a URL do frontend nas origens permitidas no backend

### ❌ Erro: "Connection refused"

**Solução:** Verifique se a URL da API no frontend está correta

### ❌ Erro: "Module not found" no backend

**Solução:** Verifique se o `requirements.txt` está na pasta `backend` e tem todas as dependências

### ❌ Backend não inicia

**Solução:** 
- Verifique os logs na plataforma de hospedagem
- Certifique-se de que o comando de start está correto
- Verifique se a porta está configurada corretamente

---

## 📝 Checklist de Deploy

### Backend:
- [ ] Conta criada na plataforma (Railway/Render/etc)
- [ ] Repositório conectado
- [ ] Variável `MERCADOPAGO_ACCESS_TOKEN` configurada
- [ ] Deploy realizado com sucesso
- [ ] URL do backend anotada
- [ ] Teste: `https://seu-backend.railway.app` funciona
- [ ] Teste: `https://seu-backend.railway.app/docs` funciona

### Frontend:
- [ ] Conta criada na Vercel
- [ ] Repositório conectado
- [ ] URL da API atualizada no `finalizar.html`
- [ ] Deploy realizado com sucesso
- [ ] Teste: Acessa a página sem erros
- [ ] Teste: Consegue fazer requisições para o backend

### Teste Final:
- [ ] Frontend consegue se comunicar com backend
- [ ] Pagamento PIX funciona
- [ ] Pagamento com cartão funciona
- [ ] QR Code é exibido corretamente
- [ ] Redirecionamento para sucesso funciona

---

## 💡 Dicas

1. **Use Railway para backend** - É o mais fácil e tem plano grátis generoso
2. **Use Vercel para frontend** - Integração perfeita com GitHub
3. **Teste localmente primeiro** - Certifique-se de que tudo funciona antes de fazer deploy
4. **Monitore os logs** - Ambas plataformas mostram logs em tempo real
5. **Use variáveis de ambiente** - Nunca commite tokens ou senhas no código

---

## 🆘 Precisa de Ajuda?

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **FastAPI Deploy:** https://fastapi.tiangolo.com/deployment/

---

## 🎯 Resumo Rápido

1. **Backend:** Railway ou Render (gratuito)
2. **Frontend:** Vercel (gratuito)
3. **Atualizar:** URL da API no frontend
4. **Testar:** Tudo funcionando em produção

**Tempo estimado:** 15-30 minutos para fazer deploy completo

