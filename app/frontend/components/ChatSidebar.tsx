'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, AgentStep, WebSocketMessage, DeploymentPlan } from '@/lib/types';

const WEBSOCKET_URL = 'ws://localhost:8000/ws/chat';
const STORAGE_KEY = 'atlas-chat-messages';

const getInitialMessages = (): ChatMessage[] => {
  if (typeof window === 'undefined') return getDefaultMessages();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      const messagesWithDates = parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      return messagesWithDates.length > 0 ? messagesWithDates : getDefaultMessages();
    }
  } catch (error) {
    console.error('Error loading chat messages:', error);
  }

  return getDefaultMessages();
};

const getDefaultMessages = (): ChatMessage[] => [
  {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm your WiFi planning assistant powered by multi-agent AI. I analyze Census demographics, FCC broadband data, and civic assets to recommend optimal deployment sites. Ask me anything!",
    timestamp: new Date()
  }
];

export default function ChatSidebar({
  isOpen,
  onClose,
  cityName,
  onRecommendationsReceived,
  onTractGeometriesReceived
}: {
  isOpen: boolean;
  onClose: () => void;
  cityName?: string;
  onRecommendationsReceived?: (plan: DeploymentPlan) => void;
  onTractGeometriesReceived?: (geojson: any) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [typingStep, setTypingStep] = useState<AgentStep | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [messages, typingStep]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat messages:', error);
      }
    }
  }, [messages]);

  const connectWebSocket = (userMessage: string) => {
    const ws = new WebSocket(WEBSOCKET_URL);
    wsRef.current = ws;
    const processingMessageId = `processing-${Date.now()}`;

    ws.onopen = () => {
      console.log('WebSocket connected');

      // Create ONE processing message that will accumulate all steps
      const thinkingMessage: ChatMessage = {
        id: processingMessageId,
        role: 'assistant',
        content: '🤔 Analyzing your request...',
        timestamp: new Date(),
        type: 'processing',
        agentSteps: []  // Initialize empty array for accumulation
      };
      setMessages(prev => [...prev, thinkingMessage]);

      // Send user message to backend
      ws.send(JSON.stringify({
        message: userMessage,
        city: cityName || 'Atlanta'
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        console.log('DEBUG: Received websocket message type:', data.type);

        if (data.type === 'agent_step') {
        const agentStep: AgentStep = {
          agent: data.agent || '',
          action: data.action || '',
          status: data.status || 'in_progress',
          data: data.data
        };

        // UPDATE the existing processing message by accumulating steps
        setMessages(prev => prev.map(msg => {
          if (msg.id === processingMessageId) {
            const existingSteps = msg.agentSteps || [];
            return {
              ...msg,
              agentSteps: [...existingSteps, agentStep],
              content: `processing-${Date.now()}`,  // Change content to force re-render
              timestamp: new Date()  // Update timestamp to force re-render
            };
          }
          return msg;
        }));

        // Show typing indicator for current agent
        setTypingStep({
          agent: agentStep.agent,
          action: agentStep.action,
          status: agentStep.status
        });
      } else if (data.type === 'final_response') {
        // Clear typing indicator
        setTypingStep(null);

        // Replace processing message with final response
        setMessages(prev => prev.map(msg =>
          msg.id === processingMessageId
            ? {
                ...msg,
                content: data.explanation || 'Analysis complete.',
                type: 'final_response',
                deploymentPlan: data.deployment_plan
              }
            : msg
        ));

        setIsProcessing(false);

        // Notify parent component of recommendations
        if (data.deployment_plan && onRecommendationsReceived) {
          onRecommendationsReceived(data.deployment_plan);
        }

        // Notify parent component of tract geometries from map_event
        if (data.map_event?.payload && onTractGeometriesReceived) {
          console.log('DEBUG: Received map_event with', data.map_event.payload.features?.length, 'tract features');
          onTractGeometriesReceived(data.map_event.payload);
        }
        // Also check for geojson field directly
        else if (data.geojson && onTractGeometriesReceived) {
          console.log('DEBUG: Received geojson with', data.geojson.features?.length, 'tract features');
          onTractGeometriesReceived(data.geojson);
        }
        else {
          console.log('DEBUG: No map data in response', Object.keys(data));
        }

        ws.close();
      } else if (data.type === 'error') {
        // Clear typing indicator
        setTypingStep(null);

        // Replace processing message with error
        setMessages(prev => prev.map(msg =>
          msg.id === processingMessageId
            ? {
                ...msg,
                content: `⚠️ Error: ${data.message || 'An error occurred'}`,
                type: 'error'
              }
            : msg
        ));

        setIsProcessing(false);
        ws.close();
      }
      } catch (error) {
        console.error('ERROR: Failed to process websocket message:', error);
        setTypingStep(null);
        setIsProcessing(false);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setTypingStep(null);

      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⚠️ Connection error. Please make sure the backend server is running on port 8000.',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
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

    // Connect to WebSocket and send message
    connectWebSocket(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    if (confirm('Are you sure you want to clear the conversation history?')) {
      const defaultMessages = getDefaultMessages();
      setMessages(defaultMessages);
      setShowSuggestions(true);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const getAgentIcon = (agentName: string): string => {
    if (agentName.includes('Query Parser')) return '🔍';
    if (agentName.includes('Census')) return '📊';
    if (agentName.includes('FCC')) return '📡';
    if (agentName.includes('Assets')) return '🏛️';
    if (agentName.includes('Synthesis')) return '🧠';
    if (agentName.includes('Ranking')) return '⚖️';
    if (agentName.includes('Explainer')) return '✨';
    return '🤖';
  };

  const isOrchestratorThinking = (step: AgentStep): boolean => {
    return step.agent.includes('Orchestrator') && step.status === 'completed';
  };

  const isProcessRunning = (step: AgentStep): boolean => {
    return step.status === 'in_progress' && !step.agent.includes('Orchestrator');
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearConversation}
                className="p-1 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
                title="Clear conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
                title="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
                      : message.type === 'agent_step'
                      ? 'bg-surface-hover border border-border'
                      : 'bg-surface-hover text-foreground border border-border'
                  }`}
                >
                  {/* Processing Message - Shows all accumulated agent steps */}
                  {message.type === 'processing' && message.agentSteps && (
                    <div className="text-xs space-y-2">
                      <div className="font-semibold text-muted mb-2">🤔 Analyzing your request...</div>
                      {message.agentSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 pl-2 border-l-2 border-civic-blue/30">
                          <span className="flex-shrink-0 mt-0.5">{getAgentIcon(step.agent)}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-foreground flex items-center gap-2">
                              {step.agent}
                              {step.status === 'in_progress' && (
                                <svg className="w-3 h-3 animate-spin text-civic-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              )}
                              {step.status === 'completed' && (
                                <span className="text-civic-green">✓</span>
                              )}
                            </div>
                            <div className="text-accent mt-0.5">{step.action}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Agent Step Message */}
                  {message.type === 'agent_step' && message.agentSteps?.[0] && (
                    <div className="text-xs flex items-start gap-2">
                      <span className="flex-shrink-0 mt-0.5">{getAgentIcon(message.agentSteps[0].agent)}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {message.agentSteps[0].agent}
                          {isProcessRunning(message.agentSteps[0]) && (
                            <svg className="w-3 h-3 animate-spin text-civic-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          {message.agentSteps[0].status === 'completed' && !isOrchestratorThinking(message.agentSteps[0]) && (
                            <span className="text-civic-green">✓</span>
                          )}
                        </div>
                        <div className="text-accent mt-1">
                          {message.content}
                          {isOrchestratorThinking(message.agentSteps[0]) && (
                            <span className="inline-flex ml-1">
                              <span className="animate-[bounce_1s_infinite_0ms]">.</span>
                              <span className="animate-[bounce_1s_infinite_200ms]">.</span>
                              <span className="animate-[bounce_1s_infinite_400ms]">.</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Regular Message */}
                  {message.type !== "agent_step" && message.type !== "processing" && (
                    <>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                      <span className={`text-xs mt-2 block ${
                        message.role === 'user' ? 'text-white/70' : 'text-muted'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isProcessing && typingStep && (
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-surface-hover border border-border rounded-2xl px-4 py-3">
                  <div className="text-xs flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5">{getAgentIcon(typingStep.agent)}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{typingStep.agent}</div>
                      <div className="text-accent mt-1">
                        <span className="inline-flex gap-0.5">
                          <span className="animate-[bounce_1s_infinite_0ms]">.</span>
                          <span className="animate-[bounce_1s_infinite_200ms]">.</span>
                          <span className="animate-[bounce_1s_infinite_400ms]">.</span>
                        </span>
                      </div>
                    </div>
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
