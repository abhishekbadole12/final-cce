'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: number;
  difficulty: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizContentProps {
  quizData: {
    topic: string;
    total_questions: number;
    questions: Question[];
  };
}

export default function QuizContent({ quizData }: QuizContentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{
    [key: number]: {
      answer: string;
      isCorrect: boolean;
    };
  }>({});

  const question = quizData.questions[currentQuestion];
  const isCorrect =
    selectedAnswer === question.correct_answer && answered;

  const handleAnswerClick = (option: string) => {
    if (answered) return;

    const correct = option === question.correct_answer;

    setSelectedAnswer(option);
    setAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    setAnswers({
      ...answers,
      [question.id]: {
        answer: option,
        isCorrect: correct,
      },
    });
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);

      const prevQuestion = quizData.questions[currentQuestion - 1];

      setSelectedAnswer(
        answers[prevQuestion.id]?.answer || null
      );

      setAnswered(!!answers[prevQuestion.id]);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestion(index);

    const q = quizData.questions[index];

    setSelectedAnswer(
      answers[q.id]?.answer || null
    );

    setAnswered(!!answers[q.id]);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setAnswers({});
  };

  const difficultyColors: { [key: string]: string } = {
    easy: 'bg-emerald-500/20 text-emerald-300',
    medium: 'bg-amber-500/20 text-amber-300',
    hard: 'bg-red-500/20 text-red-300',
  };

  return (
    <div className=" mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 px-24">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {quizData.topic}
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-slate-300">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </p>
              <p className="text-blue-400 font-semibold">
                Score: {score}/{quizData.questions.length}
              </p>
            </div>
            <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex-1 pr-4">
                {question.question}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${difficultyColors[question.difficulty] ||
                  difficultyColors['easy']
                  }`}
              >
                {question.difficulty}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correct_answer;
              const showCorrect = answered && isCorrectOption;
              const showIncorrect = answered && isSelected && !isCorrectOption;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  disabled={answered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${showCorrect
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-100'
                    : showIncorrect
                      ? 'bg-red-500/20 border-red-500 text-red-100'
                      : isSelected
                        ? 'bg-blue-500/20 border-blue-500 text-blue-100'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-700'
                    } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showCorrect && <CheckCircle size={20} className="flex-shrink-0" />}
                    {showIncorrect && <XCircle size={20} className="flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div
              className={`p-4 rounded-lg mb-8 border ${isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                : 'bg-red-500/10 border-red-500/30 text-red-100'
                }`}
            >
              <h4 className="font-semibold mb-2">Explanation</h4>
              <p className="text-sm leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentQuestion === quizData.questions.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Reset Button */}
          {currentQuestion === quizData.questions.length - 1 && answered && (
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
            >
              Reset Quiz
            </button>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-slate-800 rounded-lg border border-slate-700 p-4">
            <h3 className="text-white font-semibold mb-4">
              Questions
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {quizData.questions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionSelect(index)}
                  className={`aspect-square rounded-lg font-semibold text-sm transition-all duration-200 ${index === currentQuestion
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                      : answers[q.id]
                        ? answers[q.id].isCorrect
                          ? 'bg-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/20 border border-red-500 text-red-100'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 text-sm text-slate-400">
              <p>✓ Correct: {Object.values(answers).filter(a => a.isCorrect).length}</p>
              <p>✗ Wrong: {Object.values(answers).filter(a => !a.isCorrect).length}</p>
              <p>Remaining: {quizData.questions.length - Object.keys(answers).length}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
