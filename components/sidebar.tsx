'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Topic = {
  id: string;
  name: string;
};

interface SidebarProps {
  subjectName: string;
  topics: Topic[];
  selectedTopic: string | null;
  onSelectTopic: (topicId: string) => void;
}

export default function Sidebar({
  subjectName,
  topics,
  selectedTopic,
  onSelectTopic,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`${isOpen ? 'w-72' : 'w-20'
        } h-full bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {isOpen && (
          <h1 className="text-lg font-bold text-white tracking-wide">
            Security Quiz
          </h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors ml-auto"
          aria-label="Toggle sidebar"
        >
          <ChevronDown
            size={20}
            className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </button>
      </div>

      {/* Topics List */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left whitespace-nowrap overflow-hidden text-ellipsis ${selectedTopic === topic.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              title={topic.name}
            >
              {isOpen ? (
                <span className="block">

                  <span className="font-bold text-blue-400">{topic.id}.</span>{' '}
                  {topic.name}
                </span>
              ) : (
                <span className="block text-center">{topic.id}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
          <p>Total Topics: {topics.length}</p>
        </div>
      )}
    </div>
  );
}
