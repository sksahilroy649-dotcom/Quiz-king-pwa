import { Button } from '@/components/ui/button';
import { Book, Trophy, Beaker, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { canPlayQuiz, getQuizProgress, getRemainingCorrectAnswers, DAILY_CORRECT_LIMIT, isDailyLimitReached } from '@/data/quizData';
import { toast } from 'sonner';

const quizCategories = [
  { id: 'gk', icon: Book, label: 'GK Quiz', subtitle: 'सामान्य ज्ञान', color: 'from-blue-500 to-cyan-500' },
  { id: 'sports', icon: Trophy, label: 'Sports Quiz', subtitle: 'खेल', color: 'from-green-500 to-emerald-500' },
  { id: 'science', icon: Beaker, label: 'Science Quiz', subtitle: 'विज्ञान', color: 'from-purple-500 to-pink-500' },
];

const QuizSelector = () => {
  const navigate = useNavigate();
  const remainingCorrect = getRemainingCorrectAnswers();
  const dailyLimitReached = isDailyLimitReached();

  const handleSelectQuiz = (quizId: string) => {
    if (dailyLimitReached) {
      toast.error('आज की लिमिट पूरी!', {
        description: '36 सही जवाब दे चुके हैं, कल वापस आएं'
      });
      return;
    }
    if (!canPlayQuiz(quizId)) {
      toast.error('आज का Quiz खत्म!', {
        description: 'कल नए सवालों के साथ वापस आएं'
      });
      return;
    }
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-xl font-bold text-foreground mb-2">Select Quiz</h3>
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground text-sm">सही जवाब पर 10 coins</p>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${dailyLimitReached ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          बाकी: {remainingCorrect}/{DAILY_CORRECT_LIMIT}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {quizCategories.map((quiz) => {
          const Icon = quiz.icon;
          const quizAvailable = canPlayQuiz(quiz.id);
          const isAvailable = quizAvailable && !dailyLimitReached;
          const progress = getQuizProgress(quiz.id);
          const hasProgress = progress && progress.currentQuestion > 0;
          
          return (
            <Button
              key={quiz.id}
              onClick={() => handleSelectQuiz(quiz.id)}
              disabled={!isAvailable}
              className={`h-28 flex-col gap-1 bg-gradient-to-br ${quiz.color} hover:opacity-90 border-0 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative p-2`}
            >
              {!isAvailable && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-white/80" />
                </div>
              )}
              {hasProgress && isAvailable && (
                <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[10px] px-1 rounded font-bold">
                  {progress.currentQuestion}/12
                </div>
              )}
              <Icon className="w-8 h-8 text-white" />
              <div className="text-center">
                <span className="font-bold text-white block text-sm">{quiz.label}</span>
                <span className="text-[10px] text-white/80">{quiz.subtitle}</span>
              </div>
              {!isAvailable && (
                <span className="text-[10px] text-white/60 absolute bottom-1">
                  {dailyLimitReached ? 'लिमिट पूरी' : 'कल आएं'}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizSelector;
