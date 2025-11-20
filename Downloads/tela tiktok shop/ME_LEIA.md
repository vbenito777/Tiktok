# 📖 ME LEIA - Guia de Configuração e Alterações

Este documento explica como fazer alterações no projeto e configurar integrações.

---

## 🎨 COMO FAZER ALTERAÇÕES NA TELA

### 1. Alterar Textos e Perguntas

**Localização:** `src/complete_quiz_app.tsx` - Array `quizSteps` (linha ~116)

**Para alterar perguntas:**
```typescript
{
  id: 5,
  question: "SUA PERGUNTA AQUI", // Altere aqui
  image: "URL_DA_IMAGEM", // Altere aqui
  options: [
    { id: "opcao1", text: "Opção 1", emoji: "🤩" },
    // Adicione mais opções se necessário
  ],
  reward: 74.15 // Valor da recompensa
}
```

**Para adicionar novos produtos:**
1. Copie um quiz de produto existente (id: 5 em diante)
2. Altere o `id` para o próximo número
3. Altere `question`, `image` e `reward`
4. Opcional: personalize as `options`

### 2. Alterar Cores e Estilos

O projeto usa **Tailwind CSS**. Para alterar cores:

- **Rosa principal:** Procure por `bg-pink-500` e substitua por outra cor
- **Verde (recompensas):** Procure por `bg-green-500`
- **Roxo:** Procure por `bg-purple-600`

**Exemplo:** Para mudar a cor rosa para azul:
```typescript
// Antes
className="bg-pink-500 text-white"

// Depois
className="bg-blue-500 text-white"
```

### 3. Alterar Valores de Recompensas

**Localização:** `src/complete_quiz_app.tsx` - Array `quizSteps`

Procure por `reward:` e altere o valor:
```typescript
reward: 74.15 // Altere este valor
```

### 4. Alterar Saldo Inicial

**Localização:** `src/complete_quiz_app.tsx` - linha ~1089

```typescript
const [totalEarned, setTotalEarned] = useState(100.0); // Altere aqui
```

### 5. Alterar Taxa de Cadastro

**Localização:** `src/complete_quiz_app.tsx` - linha ~1109

```typescript
const registrationFeeAmount = 19.98; // Altere aqui
```

---

## 🔧 CONFIGURAÇÕES IMPORTANTES

### 1. Configurar Chave PIX

**Localização:** `src/complete_quiz_app.tsx` - linha ~6

```typescript
const PIX_CONFIG = {
  pixCode: "SEU_CODIGO_PIX_AQUI", // Cole seu código PIX completo
  nome: "Nome do Recebedor",
  cidade: "Cidade",
  chave: "",
  useDynamicPix: true
};
```

**Para usar chave PIX estática:**
```typescript
const PIX_CONFIG = {
  chave: "sua-chave-pix@email.com", // Sua chave PIX
  nome: "Seu Nome",
  cidade: "Sua Cidade",
  useDynamicPix: false // Mude para false
};
```

### 2. Configurar Meta Pixel

**Passo 1:** Obter o Pixel ID
1. Acesse [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Crie um Pixel ou use um existente
3. Copie o ID do Pixel (número de 15-16 dígitos)

**Passo 2:** Configurar no código
**Localização:** `src/complete_quiz_app.tsx` - linha ~17

```typescript
const WEBHOOK_CONFIG = {
  utmifyUrl: "", // Deixe vazio se não usar UTMify
  metaPixelId: "1234567890123456", // COLE SEU PIXEL ID AQUI
  enabled: true
};
```

**Passo 3:** Atualizar o HTML (opcional)
**Localização:** `index.html` - linha ~12

Se quiser inicializar o Pixel diretamente no HTML, descomente e configure:
```html
<script>
  // Descomente e adicione seu Pixel ID:
  // fbq('init', 'SEU_PIXEL_ID_AQUI');
  // fbq('track', 'PageView');
</script>
```

### 3. Configurar Webhook UTMify (Opcional)

**Localização:** `src/complete_quiz_app.tsx` - linha ~17

```typescript
const WEBHOOK_CONFIG = {
  utmifyUrl: "https://webhook.utmify.com/seu-endpoint", // COLE A URL AQUI
  metaPixelId: "1234567890123456",
  enabled: true
};
```

**Para desativar webhooks:**
```typescript
enabled: false
```

---

## 📹 CONFIGURAR VÍDEO VSL

**Localização:** Pasta `public/vsl/`

1. Coloque seu vídeo na pasta `public/vsl/`
2. Nomeie o arquivo como: `vsl.mp4`
3. O vídeo será carregado automaticamente

**Para alterar o tempo de espera:**
**Localização:** `src/complete_quiz_app.tsx` - linha ~698

```typescript
const [timeRemaining, setTimeRemaining] = useState(10); // Altere os 10 segundos aqui
```

E na linha do `useEffect`:
```typescript
const timer = setInterval(() => {
  setTimeRemaining((prev) => {
    if (prev <= 1) { // Este é o tempo final
      setVideoWatched(true);
      clearInterval(timer);
      return 0;
    }
    return prev - 1;
  });
}, 1000); // 1000 = 1 segundo (não altere)
```

---

## 🎯 EVENTOS ENVIADOS PARA WEBHOOKS

O sistema envia automaticamente estes eventos:

- **email_captured** - Quando email é confirmado
- **reward_earned** - Quando ganha recompensa
- **withdraw_initiated** - Quando clica em "SACAR"
- **withdraw_data_submitted** - Quando preenche dados de saque
- **balance_unlocked** - Quando desbloqueia saldo
- **payment_completed** - Quando confirma pagamento

---

## 🚀 COMO RODAR O PROJETO

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse no navegador:
```
http://localhost:5173
```

---

## 📱 RESPONSIVIDADE

O projeto já está otimizado para mobile usando Tailwind CSS com classes responsivas:

- `sm:` - Telas pequenas (640px+)
- `md:` - Telas médias (768px+)
- `lg:` - Telas grandes (1024px+)

**Exemplo:**
```typescript
className="text-sm sm:text-base" // Texto menor no mobile, maior no desktop
```

---

## ⚠️ DICAS IMPORTANTES

1. **Sempre teste após alterações** - Use `npm run dev` para ver as mudanças
2. **Backup antes de alterar** - Faça backup do arquivo antes de grandes mudanças
3. **Console do navegador** - Use F12 para ver erros e logs
4. **Meta Pixel Helper** - Use a extensão do Chrome para testar o Pixel

---

## 🐛 PROBLEMAS COMUNS

**Pixel não funciona:**
- Verifique se o Pixel ID está correto
- Verifique se não há bloqueadores de anúncios
- Use a extensão "Facebook Pixel Helper"

**Vídeo não carrega:**
- Verifique se o arquivo está em `public/vsl/vsl.mp4`
- Verifique o console do navegador para erros

**Webhooks não enviam:**
- Verifique se `enabled: true`
- Verifique o console do navegador
- Verifique se as URLs estão corretas

---

## 📞 ESTRUTURA DO PROJETO

```
tela tiktok shop/
├── src/
│   └── complete_quiz_app.tsx  ← ARQUIVO PRINCIPAL (faça alterações aqui)
├── public/
│   └── vsl/
│       └── vsl.mp4            ← Coloque seu vídeo aqui
├── index.html                 ← HTML principal
└── package.json               ← Dependências
```

---

**Última atualização:** 2024
**Versão:** 1.0


