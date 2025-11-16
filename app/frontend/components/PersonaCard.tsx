'use client';

import { motion } from 'framer-motion';
import type { Persona } from '@/lib/types';

interface PersonaCardProps {
  persona: Persona;
  index: number;
}

export default function PersonaCard({ persona, index }: PersonaCardProps) {
  // Determine color based on sentiment
  const getSentimentColor = () => {
    switch (persona.reaction.sentiment) {
      case 'very_positive':
        return 'border-civic-blue';
      case 'positive':
        return 'border-civic-green';
      default:
        return 'border-border';
    }
  };

  const getSentimentLabel = () => {
    switch (persona.reaction.sentiment) {
      case 'very_positive':
        return 'Very Positive';
      case 'positive':
        return 'Positive';
      default:
        return 'Neutral';
    }
  };

  const getSentimentBadgeColor = () => {
    switch (persona.reaction.sentiment) {
      case 'very_positive':
        return 'bg-civic-blue/20 text-civic-blue';
      case 'positive':
        return 'bg-civic-green/20 text-civic-green';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-surface-hover rounded-lg p-5 border-l-4 ${getSentimentColor()} hover:shadow-lg transition-all`}
    >
      {/* Header with Avatar and Name */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-civic-blue/20 flex items-center justify-center text-civic-blue font-bold flex-shrink-0">
          {getInitials(persona.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {persona.name}
          </h3>
          <p className="text-sm text-accent">
            {persona.age} years old • {persona.occupation}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${getSentimentBadgeColor()}`}>
            {getSentimentLabel()}
          </span>
        </div>
      </div>

      {/* Living Situation */}
      <div className="mb-3">
        <p className="text-sm text-foreground">
          <span className="text-accent">Living situation:</span> {persona.living_situation}
        </p>
      </div>

      {/* Daily Routine */}
      <div className="mb-4 p-3 bg-surface rounded-md">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
          Daily Life
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          {persona.daily_routine}
        </p>
      </div>

      {/* Internet Needs */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Internet Needs
        </p>
        <ul className="space-y-1">
          {persona.internet_needs.map((need, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-civic-blue mt-0.5">•</span>
              <span className="text-foreground">{need}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Reaction Quote */}
      <div className="mb-4 p-3 bg-surface rounded-md border-l-2 border-civic-green/50">
        <p className="text-sm text-foreground italic">
          "{persona.reaction.quote}"
        </p>
      </div>

      {/* Why They're Positive */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-civic-green uppercase tracking-wider mb-2">
          Why They're Excited
        </p>
        <ul className="space-y-1">
          {persona.reaction.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-civic-green mt-0.5">✓</span>
              <span className="text-accent">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Life Impact */}
      <div className="pt-3 border-t border-border">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Expected Life Impact
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          {persona.life_impact}
        </p>
      </div>
    </motion.div>
  );
}
