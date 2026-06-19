'use client';

import Link from 'next/link';
import { SUBJECTS } from '@/data/subject';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Cyber Security Quiz Portal
          </h1>

          <p className="text-slate-400 text-lg">
            Choose a subject and start practicing MCQs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(SUBJECTS).map(([key, subject]) => (
            <Link
              key={key}
              href={`/quiz/${key}`}
            >
              <div className="group bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-blue-500 hover:scale-[1.02] transition-all cursor-pointer">

                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">
                    {subject.name}
                  </h2>

                  <span className="text-blue-400 text-xl">
                    →
                  </span>
                </div>

                <p className="text-slate-400 mb-4">
                  {subject.topics.length} Topics Available
                </p>

                <div className="flex flex-wrap gap-2">
                  {subject.topics.slice(0, 4).map((topic) => (
                    <span
                      key={topic.id}
                      className="text-xs bg-slate-700 px-2 py-1 rounded"
                    >
                      {topic.name}
                    </span>
                  ))}
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}