'use client';

import { useState } from 'react';
import { content } from '@/lib/content';

export default function GoalInput() {
  const [goal, setGoal] = useState('');
  const [showExamples, setShowExamples] = useState(true);

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="civic-card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {content.goalInput.heading}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {content.goalInput.helpText}
          </p>

          {/* Text Input */}
          <textarea
            value={goal}
            onChange={(e) => {
              setGoal(e.target.value);
              setShowExamples(false);
            }}
            placeholder={content.goalInput.placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-civic-blue focus:border-transparent resize-none"
            rows={4}
            style={{ fontFamily: 'var(--font-montserrat)' }}
          />

          {/* Example Prompts */}
          {showExamples && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Example goals:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {content.goalInput.examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setGoal(example);
                      setShowExamples(false);
                    }}
                    className="text-left px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-4 flex justify-end">
            <button
              disabled={!goal.trim()}
              className="px-6 py-2 font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: goal.trim() ? 'var(--civic-blue-500)' : '#D1D5DB',
              }}
            >
              Generate Recommendations
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
