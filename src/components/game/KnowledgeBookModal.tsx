import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Award, 
  HelpCircle, 
  Check, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { KNOWLEDGE_CARDS, EDUCATIONAL_QUIZ } from '@/src/lib/game/gameData';
import { sound } from '@/src/lib/game/soundEffects';

interface KnowledgeBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedCardIds: string[];
  onCompleteQuiz: (score: number) => void;
}

export const KnowledgeBookModal: React.FC<KnowledgeBookModalProps> = ({
  isOpen,
  onClose,
  unlockedCardIds,
  onCompleteQuiz
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedCardId, setSelectedCardId] = useState<string>(KNOWLEDGE_CARDS[0].id);

  // Quiz state
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  if (!isOpen) return null;

  const categories = ['ALL', 'CROPS', 'NASA', 'SOIL', 'WATER', 'WEATHER', 'SUSTAINABILITY'];

  const filteredCards = KNOWLEDGE_CARDS.filter(c => 
    activeCategory === 'ALL' || c.category === activeCategory
  );

  const selectedCard = KNOWLEDGE_CARDS.find(c => c.id === selectedCardId) || KNOWLEDGE_CARDS[0];

  const handleOptionSelect = (idx: number) => {
    if (quizAnswered) return;
    setSelectedOption(idx);
    setQuizAnswered(true);

    const isCorrect = idx === EDUCATIONAL_QUIZ[currentQuizIdx].correctIndex;
    if (isCorrect) {
      sound.playCoin();
      setQuizScore(prev => prev + 1);
    } else {
      sound.playBlip();
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx < EDUCATIONAL_QUIZ.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
      setSelectedOption(null);
      setQuizAnswered(false);
    } else {
      // Completed
      onCompleteQuiz(quizScore);
      setIsQuizMode(false);
      setCurrentQuizIdx(0);
      setSelectedOption(null);
      setQuizAnswered(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs select-none font-mono">
      <div className="relative w-full max-w-4xl bg-[#0B1220] rounded-3xl border-2 border-[#29B6F6] shadow-2xl flex flex-col max-h-[90vh] text-white overflow-hidden">
        {/* Header */}
        <div className="bg-[#111C2D] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#01579B] border border-[#29B6F6] flex items-center justify-center text-xl">
              📖
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#81D4FA] tracking-wide">
                FARMER'S FIELD GUIDE & KNOWLEDGE ARCHIVE
              </h3>
              <p className="text-[11px] text-white/60">
                Unlock cards as you explore, experiment, and analyze real Earth science
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsQuizMode(!isQuizMode)}
              className="px-3.5 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-xs font-bold text-white shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>🎓</span>
              <span>{isQuizMode ? 'BACK TO FIELD GUIDE' : 'TAKE QUIZ'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isQuizMode ? (
          <>
            {/* Category Filter Pills */}
            <div className="bg-[#0e1724] px-6 py-2.5 border-b border-white/10 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer shrink-0 ${
                    activeCategory === cat
                      ? 'bg-[#29B6F6] text-[#0B1220]'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Split View: Left List, Right Card */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 min-h-0">
              <div className="md:col-span-5 p-4 border-r border-white/10 space-y-2 bg-[#0e1724]">
                {filteredCards.map((card) => {
                  const isSelected = card.id === selectedCardId;
                  const isUnlocked = unlockedCardIds.includes(card.id) || card.unlocked;

                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        sound.playBlip();
                        setSelectedCardId(card.id);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#29B6F6] bg-[#122b40]'
                          : 'border-white/10 bg-[#121B2A] hover:bg-[#182436]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{isUnlocked ? card.icon : '🔒'}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{card.title}</div>
                          <div className="text-[10px] text-white/50">{card.category}</div>
                        </div>
                      </div>
                      {isUnlocked && <Check className="w-4 h-4 text-[#81C784]" />}
                    </button>
                  );
                })}
              </div>

              {/* Right Deep Reading Panel */}
              <div className="md:col-span-7 p-6 space-y-5 bg-[#0B1220]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCard.icon}</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#81D4FA] tracking-wider">
                      {selectedCard.category}
                    </span>
                    <h3 className="text-lg font-bold text-white">{selectedCard.title}</h3>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <strong>Summary:</strong> {selectedCard.summary}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD54F]">
                    Agronomic & Environmental Science
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-4 border-l-2 border-[#FFD54F]">
                    {selectedCard.details}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Educational Quiz Mode */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col justify-between max-w-2xl mx-auto w-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>QUESTION {currentQuizIdx + 1} OF {EDUCATIONAL_QUIZ.length}</span>
                <span className="text-[#64FFDA]">Score: {quizScore}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white">
                {EDUCATIONAL_QUIZ[currentQuizIdx].question}
              </h3>

              <div className="space-y-2.5 pt-2">
                {EDUCATIONAL_QUIZ[currentQuizIdx].options.map((opt, i) => {
                  const isCorrect = i === EDUCATIONAL_QUIZ[currentQuizIdx].correctIndex;
                  const isChosen = selectedOption === i;

                  let style = 'border-white/15 bg-white/5 hover:bg-white/10 text-white';
                  if (quizAnswered) {
                    if (isCorrect) {
                      style = 'border-[#4CAF50] bg-[#1B5E20] text-white font-bold';
                    } else if (isChosen) {
                      style = 'border-[#E53935] bg-[#B71C1C] text-white';
                    }
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={quizAnswered}
                      onClick={() => handleOptionSelect(i)}
                      className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {quizAnswered && isCorrect && <Check className="w-4 h-4 text-[#A5D6A7]" />}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div className="p-4 rounded-2xl bg-[#121E2F] border border-white/20 text-xs text-slate-200 leading-relaxed animate-in fade-in">
                  <span className="font-bold text-[#81D4FA]">Explanation: </span>
                  {EDUCATIONAL_QUIZ[currentQuizIdx].explanation}
                </div>
              )}
            </div>

            {quizAnswered && (
              <button
                type="button"
                onClick={handleNextQuiz}
                className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold tracking-wider cursor-pointer shadow-xl transition-all"
              >
                {currentQuizIdx < EDUCATIONAL_QUIZ.length - 1 ? 'NEXT QUESTION →' : 'FINISH QUIZ & CLAIM REWARD! 🏆'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
