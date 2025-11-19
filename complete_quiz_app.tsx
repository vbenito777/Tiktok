import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

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

// Quiz Data
const quizSteps: QuizStep[] = [
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
  {
    id: 5,
    question: "Qual a sua opinião inicial sobre este produto?",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400",
    options: [
      { id: "muito", text: "Muito atrativo", emoji: "🤩" },
      { id: "bonito", text: "Bonito, parece bom", emoji: "👍" },
      { id: "normal", text: "Normal, nada demais", emoji: "😐" },
      { id: "nao", text: "Não me chamou atenção", emoji: "👎" }
    ],
    reward: 74.15
  },
  {
    id: 6,
    question: "Você compraria esse produto para uso pessoal?",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    options: [
      { id: "sim", text: "Sim, com certeza", emoji: "" },
      { id: "talvez", text: "Talvez, dependendo do valor", emoji: "🤔" },
      { id: "nao-sei", text: "Não sei, ainda estou avaliando", emoji: "🤷" },
      { id: "nao", text: "Não, Não me interessou", emoji: "❌" }
    ],
    reward: 55.26
  },
  {
    id: 7,
    question: "Como você avaliaria a aparência visual do produto?",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    options: [
      { id: "muito", text: "Muito", emoji: "🔥" },
      { id: "boa", text: "Boa", emoji: "👍" },
      { id: "regular", text: "Regular", emoji: "😐" },
      { id: "fraca", text: "Fraca", emoji: "👎" }
    ],
    reward: 53.30
  },
  {
    id: 8,
    question: "Esse produto parece útil no dia a dia?",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400",
    options: [
      { id: "sim", text: "Sim, muito útil", emoji: "🎯" },
      { id: "pode", text: "Pode ser útil", emoji: "👍" },
      { id: "nao-sei", text: "Não sei dizer", emoji: "👑" },
      { id: "nao", text: "Não vejo utilidade", emoji: "❌" }
    ],
    reward: 65.61
  },
  {
    id: 9,
    question: "O produto parece ser de boa qualidade?",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400",
    options: [
      { id: "sim", text: "Sim, parece top de linha", emoji: "💅" },
      { id: "razoavel", text: "Parece razoável", emoji: "👌" },
      { id: "nao", text: "Não transmite confiança", emoji: "😬" },
      { id: "ruim", text: "Parece de qualidade ruim", emoji: "💩" }
    ],
    reward: 36.95
  },
  {
    id: 10,
    question: "Você recomendaria esse produto para alguém?",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400",
    options: [
      { id: "sim", text: "Sim, sem dúvidas", emoji: "🙌" },
      { id: "talvez", text: "Talvez", emoji: "👑" },
      { id: "provavelmente", text: "Provavelmente Não", emoji: "😬" },
      { id: "nunca", text: "Nunca", emoji: "🚫" }
    ],
    reward: 38.79
  },
  {
    id: 11,
    question: "A imagem do produto corresponde à expectativa real dele?",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400",
    options: [
      { id: "sim", text: "Sim, exatamente como anunciado", emoji: "🙌" },
      { id: "quase", text: "Quase igual", emoji: "👑" },
      { id: "pouco", text: "Um pouco diferente", emoji: "😬" },
      { id: "totalmente", text: "Totalmente diferente", emoji: "❌" }
    ],
    reward: 66.66
  },
  {
    id: 12,
    question: "Qual sua primeira impressão ao ver esse produto?",
    image: "https://images.unsplash.com/photo-1593642532400-2682810df593?w=400",
    options: [
      { id: "muito", text: "Muito bom", emoji: "🤩" },
      { id: "interessante", text: "Interessante", emoji: "👀" },
      { id: "nada", text: "Nada demais", emoji: "😐" },
      { id: "negativa", text: "Negativa", emoji: "😞" }
    ],
    reward: 41.63
  },
  {
    id: 13,
    question: "Esse produto parece confiável?",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    options: [
      { id: "sim", text: "Sim, totalmente", emoji: "🔒" },
      { id: "mais", text: "Mais ou menos", emoji: "🤔" },
      { id: "pouco", text: "Pouco confiável", emoji: "⚠️" },
      { id: "nada", text: "Nada confiável", emoji: "🚫" }
    ],
    reward: 52.02
  }
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

  const currentStepData = quizSteps[currentStep];
  const isInitialSteps = currentStep < 4;
  const isEmailStep = currentStep === 4;
  const isFinalStep = currentStep === quizSteps.length;

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

    const reward = currentStepData?.reward || 0;

    if (reward > 0) {
      setShowRewardModal(true);
      setTotalEarned(prev => prev + reward);
      setCompletedEvaluations(prev => prev + 1);
      setConfetti(true);
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
    
    if (currentStep === quizSteps.length - 1) {
      setShowFinalModal(true);
    } else {
      goToNextStep();
    }
  };

  const handleWithdraw = () => {
    alert("Redirecionando para página de saque...");
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

        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok Shop" className="h-6" />
          <div className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold">
            GANHE R$ 100,00 DE BÔNUS INICIAL
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-blue-50 rounded-2xl p-8 mb-6 max-w-md w-full">
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok" className="h-8" />
                <div>
                  <h3 className="font-bold text-lg">TikTok Shop</h3>
                  <p className="text-sm text-gray-600">AVALIADOR OFICIAL</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                <p className="font-semibold text-gray-800 mb-2">
                  Ganhe até <span className="text-2xl text-purple-600">R$ 850,00</span>
                </p>
                <p className="text-sm text-gray-700">avaliando produtos no conforto da sua casa</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="font-semibold text-gray-800 mb-4">
                Você foi <strong className="text-purple-600">selecionado</strong> para participar da nossa plataforma de avaliações pagas.
              </p>
              <p className="text-sm text-gray-700 mb-4">
                Ganhe até <strong>R$ 850,00</strong> por dia avaliando produtos da TikTok Shop, direto do seu celular.
              </p>
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={handleContinue}
              disabled={!email}
              className="w-full bg-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
            >
              ENTRAR E LIBERAR AVALIAÇÕES
            </button>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Bônus imediato de R$ 100,00</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Até R$ 850,00 por dia em tarefas</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>100% online, sem vender nada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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

      <div className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-40">
        <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok Shop" className="h-6" />
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-300 px-4 py-1 rounded-lg text-sm font-semibold text-gray-800">
            R${totalEarned.toFixed(2).replace('.', ',')}
          </div>
          <button className="bg-pink-500 text-white px-6 py-1 rounded-lg text-sm font-semibold hover:bg-pink-600 transition-colors">
            SACAR
          </button>
        </div>
      </div>

      {!isInitialSteps && (
        <div className="bg-gray-200 h-1 w-full">
          <div 
            className="bg-pink-500 h-1 transition-all duration-300"
            style={{ width: `${((currentStep - 3) / (quizSteps.length - 4)) * 100}%` }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {isInitialSteps && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <div className="bg-white rounded-xl p-4 text-center mb-4 shadow-sm">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                  P
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok" className="h-5" />
                  <span className="font-bold text-gray-800">TikTok Shop</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">AVALIADOR OFICIAL</p>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      currentStep + 1 === step 
                        ? 'bg-pink-500 text-white' 
                        : currentStep + 1 > step 
                        ? 'bg-pink-200 text-pink-600' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && <div className="w-8 h-0.5 bg-gray-300" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {currentStepData.question}
          </h2>

          {currentStepData.description && (
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 text-base leading-relaxed">
                {currentStepData.description}
              </pre>
            </div>
          )}

          {currentStepData.image && (
            <div className="mb-6 flex justify-center">
              <img 
                src={currentStepData.image} 
                alt="Produto" 
                className="rounded-xl w-48 h-48 object-cover shadow-md"
              />
            </div>
          )}

          <p className="text-gray-600 text-center mb-4 font-medium">
            Selecione uma opção para continuar:
          </p>

          <div className="space-y-3 mb-6">
            {currentStepData.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                  selectedOption === option.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  {option.emoji && <span className="text-2xl">{option.emoji}</span>}
                  <span className="font-medium text-gray-800">{option.text}</span>
                </div>
                {selectedOption === option.id && (
                  <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Voltar
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!selectedOption}
              className="flex-1 bg-pink-500 text-white py-4 rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isInitialSteps ? 'Próximo Passo' : 'Continuar'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-green-600 font-medium text-sm mb-2 bg-green-50 py-2 px-4 rounded-lg inline-block">
              Concorra a um Bônus adicional
            </p>
          </div>

          {!isInitialSteps && (
            <div className="mt-6 space-y-2 text-center">
              <p className="text-sm text-gray-600">
                Avaliação {currentStep - 3} de {quizSteps.length - 4}
              </p>
            </div>
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
    </div>
  );
}