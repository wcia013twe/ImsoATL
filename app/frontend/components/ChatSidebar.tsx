'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, AgentStep, WebSocketMessage, DeploymentPlan } from '@/lib/types';

const WEBSOCKET_URL = 'ws://localhost:8000/ws/chat';

export default function ChatSidebar({
  isOpen,
  onClose,
  cityName,
  onRecommendationsReceived
}: {
  isOpen: boolean;
  onClose: () => void;
  cityName?: string;
  onRecommendationsReceived?: (plan: DeploymentPlan) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your WiFi planning assistant powered by multi-agent AI. I analyze Census demographics, FCC broadband data, and civic assets to recommend optimal deployment sites. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAgentSteps, setCurrentAgentSteps] = useState<AgentStep[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const suggestions = [
    "Where should we deploy WiFi for underserved students?",
    "Which areas have the worst broadband coverage gaps?",
    "Show me high-poverty neighborhoods without internet access",
    "Find the best sites near libraries and community centers"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAgentSteps]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const connectWebSocket = (userMessage: string) => {
    const ws = new WebSocket(WEBSOCKET_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Send user message to backend
      ws.send(JSON.stringify({
        message: userMessage,
        city: cityName || 'Atlanta'
      }));
    };

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);

      if (data.type === 'agent_step') {
        // Update agent steps in real-time
        setCurrentAgentSteps(prev => {
          const newSteps = [...prev];
          const existingIndex = newSteps.findIndex(s => s.agent === data.agent);

          const agentStep: AgentStep = {
            agent: data.agent || '',
            action: data.action || '',
            status: data.status || 'in_progress',
            data: data.data
          };

          if (existingIndex >= 0) {
            newSteps[existingIndex] = agentStep;
          } else {
            newSteps.push(agentStep);
          }

          return newSteps;
        });
      } else if (data.type === 'final_response') {
        // Create assistant message with final response
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.explanation || 'Analysis complete.',
          timestamp: new Date(),
          type: 'final_response',
          agentSteps: currentAgentSteps,
          deploymentPlan: data.deployment_plan
        };

        setMessages(prev => [...prev, assistantMessage]);
        setCurrentAgentSteps([]);
        setIsProcessing(false);

        // Notify parent component of recommendations
        if (data.deployment_plan && onRecommendationsReceived) {
          onRecommendationsReceived(data.deployment_plan);
        }

        ws.close();
      } else if (data.type === 'error') {
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `⚠️ Error: ${data.message || 'An error occurred'}`,
          timestamp: new Date(),
          type: 'error'
        };

        setMessages(prev => [...prev, errorMessage]);
        setCurrentAgentSteps([]);
        setIsProcessing(false);
        ws.close();
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⚠️ Connection error. Please make sure the backend server is running on port 8000.',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
      setCurrentAgentSteps([]);
      setIsProcessing(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      wsRef.current = null;
    };
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isProcessing) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsProcessing(true);
    setCurrentAgentSteps([]);

    // Connect to WebSocket and send message
    connectWebSocket(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAgentIcon = (agentName: string): string => {
    if (agentName.includes('Query Parser')) return '🔍';
    if (agentName.includes('Census')) return '📊';
    if (agentName.includes('FCC')) return '📡';
    if (agentName.includes('Assets')) return '🏛️';
    if (agentName.includes('Ranking')) return '⚖️';
    if (agentName.includes('Explainer')) return '✨';
    return '🤖';
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[32rem] bg-surface border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-civic-green animate-pulse" />
              <h2 className="text-lg font-semibold text-foreground">Multi-Agent AI Assistant</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-civic-blue text-white'
                      : 'bg-surface-hover text-foreground border border-border'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                  {/* Show agent steps if present */}
                  {message.agentSteps && message.agentSteps.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                      <div className="text-xs font-semibold text-muted uppercase tracking-wider">
                        Reasoning Process
                      </div>
                      {message.agentSteps.map((step, idx) => (
                        <div key={idx} className="text-xs text-accent flex items-start gap-2">
                          <span className="flex-shrink-0">{getAgentIcon(step.agent)}</span>
                          <div>
                            <div className="font-semibold text-foreground">{step.agent}</div>
                            <div>{step.action}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className={`text-xs mt-2 block ${
                    message.role === 'user' ? 'text-white/70' : 'text-muted'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Live Agent Steps */}
            {isProcessing && currentAgentSteps.length > 0 && (
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-surface-hover border border-border rounded-2xl px-4 py-3">
                  <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    Analyzing...
                  </div>
                  <div className="space-y-2">
                    {currentAgentSteps.map((step, idx) => (
                      <div key={idx} className="text-xs flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5">{getAgentIcon(step.agent)}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            {step.agent}
                            {step.status === 'in_progress' && (
                              <div className="w-1.5 h-1.5 bg-civic-blue rounded-full animate-pulse" />
                            )}
                            {step.status === 'completed' && (
                              <span className="text-civic-green">✓</span>
                            )}
                          </div>
                          <div className="text-accent">{step.action}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {showSuggestions && messages.length === 1 && (
            <div className="px-6 pb-4">
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Suggested Questions
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-border text-sm text-accent hover:bg-surface-hover hover:text-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-6 py-4 border-t border-border">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about WiFi deployment..."
                disabled={isProcessing}
                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-civic-blue focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isProcessing}
                className="px-4 py-3 rounded-xl bg-civic-blue text-white font-semibold hover:bg-civic-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
