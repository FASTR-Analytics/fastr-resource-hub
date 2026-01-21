import { useState, useRef, useEffect } from 'react'
import { useWorkshopStore } from '../stores/workshop'
import ReactMarkdown from 'react-markdown'
import {
  Sparkles,
  Send,
  Trash2,
  Loader2,
  User,
  Bot,
  Lightbulb,
  CheckCircle2
} from 'lucide-react'

const QUICK_PROMPTS = [
  "Add all Data Analysis content to Day 1",
  "Build a full day agenda with DQA and breaks",
  "Add the Introduction module to start my workshop",
  "Set the start time to 08:30 and add a morning session",
]

export function AIAssistant() {
  const { aiMessages, aiLoading, sendAIMessage, clearAIMessages, currentConfig } = useWorkshopStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages])

  const handleSend = () => {
    if (!input.trim() || aiLoading) return
    sendAIMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    sendAIMessage(prompt)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-fastr-accent" />
          <h2 className="font-semibold text-gray-800">AI Assistant</h2>
        </div>
        {aiMessages.length > 0 && (
          <button
            onClick={clearAIMessages}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {aiMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Bot className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="font-medium text-gray-700 mb-1">How can I help?</h3>
            <p className="text-sm text-gray-500 mb-4">
              I can add modules, breaks, and sessions to your deck
            </p>

            {/* Quick prompts */}
            <div className="w-full space-y-2">
              <p className="text-xs text-gray-400 flex items-center gap-1 justify-center">
                <Lightbulb className="w-3 h-3" />
                Try asking:
              </p>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="w-full text-left text-sm px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {aiMessages.map((message, i) => (
              <div
                key={i}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-fastr-light flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-fastr-primary" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-fastr-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="space-y-2">
                      {/* Show actions taken */}
                      {message.actionsTaken && message.actionsTaken.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-2 mb-2">
                          <div className="flex items-center gap-1.5 text-green-700 text-xs font-medium mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Actions completed:
                          </div>
                          <ul className="text-xs text-green-600 space-y-0.5">
                            {message.actionsTaken.map((action, j) => (
                              <li key={j}>• {action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {message.content && (
                        <div className="markdown-preview text-sm">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-fastr-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {aiLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-fastr-light flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-fastr-primary" />
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {/* Context indicator */}
        {currentConfig && (
          <div className="text-xs text-gray-400 mb-2">
            Context: {currentConfig.workshop.name} ({currentConfig.schedule.days} days)
          </div>
        )}

        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || aiLoading}
            className="px-3 py-2 bg-fastr-primary text-white rounded-md hover:bg-fastr-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
