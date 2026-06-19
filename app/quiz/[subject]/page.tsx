'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import QuizContent from '@/components/quiz-content';
import { SUBJECTS, SubjectKey } from "@/data/subject";
import { useParams } from 'next/navigation';

interface QuizData {
  topic: string;
  total_questions: number;
  questions: Array<{
    id: number;
    difficulty: string;
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
  }>;
}


export default function Page() {
  const params = useParams();
  const subject = params.subject as SubjectKey;

  const [topics, setTopics] = useState<{ name: string; id: string }[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);

  const currentSubject = SUBJECTS[subject];
  useEffect(() => {
    if (!currentSubject) return;
    setTopics([...currentSubject.topics]);

    if (currentSubject.topics.length > 0) {
      setSelectedTopic(currentSubject?.topics[0].id);
    }
  }, [subject]);

  useEffect(() => {
    if (!selectedTopic || !subject) return;

    setLoading(true);

    fetch(`/quizzes/${subject}/Topic_${selectedTopic}.json`)
      .then((res) => res.json())
      .then((data) => {
        setQuizData(data);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [selectedTopic, subject]);

  if (!currentSubject) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Invalid Subject
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
      <Sidebar
        subjectName={currentSubject.name}
        topics={topics}
        selectedTopic={selectedTopic}
        onSelectTopic={setSelectedTopic}
      />
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-300">Loading quiz...</p>
            </div>
          </div>
        ) : quizData ? (
          <QuizContent quizData={quizData} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-slate-300">Select a topic to start</p>
          </div>
        )}
      </div>
    </div>
  );
}
