import { useState, useRef, useEffect } from 'react'
import { useWorkshopStore } from '../stores/workshop'
import { Send, Trash2, Sparkles, CheckCircle } from 'lucide-react'

export function AIAssistant() {
  const { aiMessages, aiLoading, sendAIMessage, clearAIMessages, currentWorkshopId } = useWorkshopStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || aiLoading) return

    sendAIMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (!currentWorkshopId) {
    return (
      <div className="h-full flex items-center justify-center p-4 text-gray-500 text-center">
        <div>
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Select a workshop to use the AI assistant</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {aiMessages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            <Sparkles className="w-6 h-6 mx-auto mb-2" />
            <p>Ask me to help with your workshop:</p>
            <ul className="mt-2 text-xs space-y-1">
              <li>"Add Module 4 to Day 2"</li>
              <li>"Move the tea break after Data Quality"</li>
              <li>"Generate objectives for this workshop"</li>
            </ul>
          </div>
        ) : (
          aiMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-fastr-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Show actions taken */}
                {msg.actionsTaken && msg.actionsTaken.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                    {msg.actionsTaken.map((action, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {aiLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Clear button */}
      {aiMessages.length > 0 && (
        <div className="px-3 py-1 border-t border-gray-100">
          <button
            onClick={clearAIMessages}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            <Trash2 className="w-3 h-3" />
            Clear chat
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to help..."
            rows={2}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary"
          />
          <button
            type="submit"
            disabled={!input.trim() || aiLoading}
            aria-label="Send message"
            className="px-3 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
