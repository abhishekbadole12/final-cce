'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

interface QuizQuestion {
  id: number;
  difficulty?: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizData {
  topic: string;
  total_questions: number;
  questions: QuizQuestion[];
}

interface AnsweredQuestion {
  [key: number]: {
    selected: string;
    isCorrect: boolean;
  };
}

interface Topic {
  name: string;
  file: string;
}

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [answered, setAnswered] = useState<AnsweredQuestion>({});
  const [error, setError] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTopic, setCurrentTopic] = useState<string>('');

  useEffect(() => {
    // Fetch available quiz files
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      // List of quiz files in the public/quizzes directory
      const quizFiles = [
        { name: 'Information Security', file: 'information-security.json' },
        { name: 'Security Basics', file: 'security-basics.json' },
        { name: 'Cryptography', file: 'cryptography.json' }
      ];
      setTopics(quizFiles);
    } catch (err) {
      console.error('Error fetching topics:', err);
    }
  };

  const loadTopicQuiz = async (topicFile: string, topicName: string) => {
    try {
      const response = await fetch(`/quizzes/${topicFile}`);
      if (!response.ok) throw new Error('Failed to load quiz');
      const data = await response.json() as QuizData;
      
      if (!data.topic || !data.questions || !Array.isArray(data.questions)) {
        setError('Invalid JSON format in quiz file.');
        return;
      }

      setQuizData(data);
      setCurrentTopic(topicName);
      setAnswered({});
      setError('');
    } catch (err) {
      setError('Failed to load quiz file. Please try again.');
    }
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content) as QuizData;
        
        if (!data.topic || !data.questions || !Array.isArray(data.questions)) {
          setError('Invalid JSON format. Make sure your file contains "topic" and "questions" fields.');
          return;
        }

        if (data.questions.length === 0) {
          setError('No questions found in the JSON file.');
          return;
        }

        setQuizData(data);
        setCurrentTopic('Custom Upload');
        setAnswered({});
        setError('');
      } catch (err) {
        setError('Invalid JSON file format. Please check your file.');
      }
    };
    reader.readAsText(file);
  };

  const handleAnswer = (questionId: number, selectedOption: string) => {
    if (answered[questionId]) return; // Already answered

    const question = quizData?.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = selectedOption === question.correct_answer;
    setAnswered({
      ...answered,
      [questionId]: { selected: selectedOption, isCorrect }
    });
  };

  const handleReset = () => {
    setQuizData(null);
    setAnswered({});
    setError('');
    setCurrentTopic('');
  };
console.log(topics);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white shadow-lg transition-all duration-300 overflow-hidden flex flex-col`}>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Quiz Topics</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {topics.map((topic) => (
              <button
                key={topic.file}
                onClick={() => loadTopicQuiz(topic.file, topic.name)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentTopic === topic.name
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>

          {/* <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-3">Or upload your own:</div>
            <label className="block text-gray-700 text-sm font-semibold cursor-pointer">
              <span className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-center">
                Upload JSON
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div> */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white shadow-md p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Quiz Master</h1>
            <div className="w-10"></div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {!quizData ? (
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Quiz Master</h2>
                  <p className="text-gray-600 text-lg mb-8">Select a topic from the sidebar to begin, or upload your own JSON quiz file.</p>
                  <div className="flex justify-center">
                    <svg className="w-20 h-20 text-blue-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{quizData.topic}</h1>
                  <p className="text-gray-600">Total Questions: {quizData.total_questions || quizData.questions.length}</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                {/* Questions */}
                <div className="space-y-6 pb-8">
                  {quizData.questions.map((question, index) => {
                    const userAnswer = answered[question.id];
                    const isAnswered = !!userAnswer;

                    return (
                      <div key={question.id} className="bg-white rounded-lg shadow-lg p-8">
                        {/* Question Text */}
                        <div className="mb-6">
                          <div className="flex items-start gap-4">
                            <span className="inline-block bg-blue-600 text-white font-bold w-8 h-8 rounded-full text-center pt-1 flex-shrink-0">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800">{question.question}</h3>
                              {question.difficulty && (
                                <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                                  question.difficulty.toLowerCase() === 'easy' ? 'bg-green-100 text-green-800' :
                                  question.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {question.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-4">
                          {question.options.map((option) => {
                            const isSelected = userAnswer?.selected === option;
                            const isCorrectOption = option === question.correct_answer;
                            let buttonClass = 'w-full text-left p-4 rounded-lg border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800';

                            if (isAnswered) {
                              if (isCorrectOption) {
                                buttonClass = 'w-full text-left p-4 rounded-lg border-2 bg-green-100 border-green-500 text-green-900 font-medium';
                              } else if (isSelected && !userAnswer.isCorrect) {
                                buttonClass = 'w-full text-left p-4 rounded-lg border-2 bg-red-100 border-red-500 text-red-900 font-medium';
                              }
                            }

                            return (
                              <button
                                key={option}
                                disabled={isAnswered}
                                onClick={() => handleAnswer(question.id, option)}
                                className={buttonClass}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {/* Feedback */}
                        {isAnswered && (
                          <div className={`mt-4 p-4 rounded-lg border-l-4 ${
                            userAnswer.isCorrect
                              ? 'bg-green-100 border-green-600 text-green-900'
                              : 'bg-red-100 border-red-600 text-red-900'
                          }`}>
                            <div className="font-bold text-lg mb-2">
                              {userAnswer.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                            </div>
                            {!userAnswer.isCorrect && (
                              <>
                                <p className="mb-3"><strong>Your Answer:</strong> {userAnswer.selected}</p>
                                <p className="mb-3"><strong>Correct Answer:</strong> <span className="font-semibold">{question.correct_answer}</span></p>
                              </>
                            )}
                            <p><strong>Explanation:</strong> {question.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Reset Button */}
                <div className="flex gap-4 pb-8">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                  >
                    Load Different Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </div>
  );
}
