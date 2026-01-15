import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, Trophy, Coins } from 'lucide-react';
import { quizzes, markQuizPlayed, canPlayQuiz, getQuizProgress, saveQuizProgress, QuizProgress, incrementCorrectCount, getRemainingCorrectAnswers, isDailyLimitReached } from '@/data/quizData';
import { toast } from 'sonner';
import AdModal from '@/components/AdModal';
import { useGameState } from '@/hooks/useGameState';

const CORRECT_ANSWER_REWARD = 10;

const QuizGame = () => {
  const { addCoins } = useGameState();
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const quiz = quizzes.find(q => q.id === quizId);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [pendingReward, setPendingReward] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  // Load saved progress on mount
  useEffect(() => {
    if (!quiz) {
      navigate('/');
      toast.error('Quiz not found!');
      return;
    }
    
    // Check if daily limit is reached
    if (isDailyLimitReached()) {
      navigate('/');
      toast.error('आज की लिमिट पूरी हो गई!', {
        description: 'कल नए सवालों के साथ वापस आएं'
      });
      return;
    }
    
    // Check if quiz already played today
    if (!canPlayQuiz(quiz.id)) {
      navigate('/');
      toast.error('आज का Quiz पहले ही खेल चुके हैं!', {
        description: 'कल नए सवालों के साथ वापस आएं'
      });
      return;
    }

    // Load saved progress
    const savedProgress = getQuizProgress(quiz.id);
    if (savedProgress) {
      setCurrentQuestion(savedProgress.currentQuestion);
      setScore(savedProgress.score);
      setTotalEarned(savedProgress.totalEarned);
      setAnsweredQuestions(savedProgress.answeredQuestions);
    }
  }, [quiz, navigate]);

  // Save progress whenever it changes
  const saveProgress = useCallback(() => {
    if (quiz && !isFinished) {
      const progress: QuizProgress = {
        currentQuestion,
        score,
        totalEarned,
        answeredQuestions,
      };
      saveQuizProgress(quiz.id, progress);
    }
  }, [quiz, currentQuestion, score, totalEarned, answeredQuestions, isFinished]);

  useEffect(() => {
    saveProgress();
  }, [saveProgress]);

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    const isCorrect = index === question.correct;
    if (isCorrect) {
      // Mark that reward is pending - will be given after ad completes
      setPendingReward(true);
    }
    
    // Mark this question as answered
    if (!answeredQuestions.includes(currentQuestion)) {
      setAnsweredQuestions(prev => [...prev, currentQuestion]);
    }
  };

  const handleNext = () => {
    // Show ad before moving to next question
    setShowAd(true);
  };

  const handleAdComplete = () => {
    setShowAd(false);
    
    // Only give reward after ad completes
    if (pendingReward) {
      // Check if daily limit not reached
      if (getRemainingCorrectAnswers() > 0) {
        setScore(prev => prev + 1);
        addCoins(CORRECT_ANSWER_REWARD);
        setTotalEarned(prev => prev + CORRECT_ANSWER_REWARD);
        incrementCorrectCount(); // Track correct answer for daily limit
        toast.success(`+${CORRECT_ANSWER_REWARD} coins मिले!`);
      } else {
        toast.error('आज की लिमिट पूरी हो गई!');
      }
      setPendingReward(false);
    }
    
    // Check if daily limit reached after this answer
    if (isDailyLimitReached()) {
      markQuizPlayed(quiz.id);
      setIsFinished(true);
      return;
    }
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Mark quiz as played for today
      markQuizPlayed(quiz.id);
      setIsFinished(true);
    }
  };

  const getOptionClass = (index: number) => {
    if (!showResult) {
      return 'bg-muted hover:bg-muted/80 border-border';
    }
    if (index === question.correct) {
      return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
    }
    if (index === selectedAnswer && index !== question.correct) {
      return 'bg-destructive/20 border-destructive text-destructive';
    }
    return 'bg-muted/50 border-border opacity-50';
  };

  if (isFinished) {
    return (
      <div className="min-h-screen py-6 px-4 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 w-full max-w-md text-center animate-scale-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-accent-foreground" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-foreground mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-6">{quiz.name}</p>
          
          <div className="glass-card rounded-xl p-6 mb-6">
            <div className="text-5xl font-extrabold gradient-text mb-2">{score}/{quiz.questions.length}</div>
            <p className="text-muted-foreground">Correct Answers</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-6 text-accent">
            <Coins className="w-6 h-6" />
            <span className="text-2xl font-bold">+{totalEarned} Coins Earned</span>
          </div>
          
          <Button
            onClick={() => navigate('/')}
            className="w-full h-12 btn-primary rounded-xl text-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen py-6 px-4">
        <div className="container max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-foreground"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{quiz.name}</h1>
              <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {quiz.questions.length}</p>
            </div>
            <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="font-bold text-foreground">{score}</span>
            </div>
          </div>

          {/* Reward Info */}
          <div className="glass-card rounded-xl p-3 mb-4 flex items-center justify-center gap-2 text-accent">
            <Coins className="w-4 h-4" />
            <span className="text-sm font-semibold">सही जवाब पर +{CORRECT_ANSWER_REWARD} coins मिलेंगे!</span>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-2 mb-6" />

          {/* Question Card */}
          <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-in">
            <h2 className="text-xl font-bold text-foreground mb-6">{question.question}</h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${getOptionClass(index)}`}
                >
                  <span className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 font-medium">{option}</span>
                  {showResult && index === question.correct && (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  )}
                  {showResult && index === selectedAnswer && index !== question.correct && (
                    <XCircle className="w-6 h-6 text-destructive" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          {showResult && (
            <Button
              onClick={handleNext}
              className="w-full h-14 btn-primary rounded-xl text-lg animate-fade-in"
            >
              {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </div>
      </div>

      {/* Ad Modal - shows after each question, reward given only after completion */}
      <AdModal isOpen={showAd} onComplete={handleAdComplete} />
    </>
  );
};

export default QuizGame;
