'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: any[];
}

interface MessagesProps {
  formData: any;
  onApplyChanges: (changes: any[]) => void;
}

export default function Messages({ formData, onApplyChanges }: MessagesProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const seedPrompts = [
    'Help me write a compelling professional summary',
    'What skills should I highlight for a software engineer role?',
    'How do I make my resume ATS-friendly?',
    'Suggest action verbs for my work experience section',
    'Improve the impact statements in my job descriptions',
    'What keywords should I include for this industry?'
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      const scrollContainer = messagesContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const parseAISuggestions = (content: string) => {
    const regex = /<RESUME_CHANGES>\s*([\s\S]*?)\s*<\/RESUME_CHANGES>/;
    const match = content.match(regex);

    if (match) {
      try {
        const suggestionsText = match[1].trim();
        const suggestions = JSON.parse(suggestionsText);
        return Array.isArray(suggestions) ? suggestions : [suggestions];
      } catch (error) {
        console.error('Error parsing suggestions:', error);
        return null;
      }
    }
    return null;
  };

  const sendMessage = async (messageText?: string) => {
    const userMessage = messageText || input;
    if (!userMessage.trim()) return;

    const newUserMessage = { role: 'user' as const, content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map((msg) => ({
            role: msg.role,
            content: msg.content
          })),
          formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const result = await response.json();

      if (result.success) {
        // Parse suggestions from the response
        const suggestions = parseAISuggestions(result.content);

        const assistantMessage: Message = {
          role: 'assistant',
          content: result.content,
          suggestions: suggestions || undefined
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyChanges = (suggestions: any[]) => {
    onApplyChanges(suggestions);
    // Optionally add a confirmation message
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: '✅ Changes have been applied to your resume!'
      }
    ]);
  };

  const renderMessage = (msg: Message, idx: number) => {
    // Remove the <RESUME_CHANGES> tags from display content
    const displayContent = msg.content
      .replace(/<RESUME_CHANGES>\s*([\s\S]*?)\s*<\/RESUME_CHANGES>/, '')
      .trim();

    return (
      <div
        key={idx}
        className={`animate__animated animate__fast animate__fadeIn mb-3 flex ${
          msg.role === 'user' ? 'justify-end' : 'justify-start'
        }`}
      >
        <div className='flex max-w-[85%] flex-col'>
          <div
            className={`inline-block rounded-t-xl border px-4 py-2 shadow ${
              msg.role === 'user' ? 'rounded-s-xl bg-secondary' : 'rounded-e-xl'
            }`}
          >
            {displayContent}
          </div>

          {/* Show apply changes button if there are suggestions */}
          {msg.suggestions && (
            <div className='mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3'>
              <p className='mb-2 text-sm text-blue-800'>
                I have {msg.suggestions.length} suggestion(s) to improve your
                resume:
              </p>
              {msg.suggestions.map((suggestion, i) => (
                <div key={i} className='mb-1 text-xs text-blue-700'>
                  • {suggestion.explanation}
                </div>
              ))}
              <Button
                onClick={() => handleApplyChanges(msg.suggestions!)}
                size='sm'
                className='mt-2 bg-blue-600 hover:bg-blue-700'
              >
                <CheckCircle className='mr-1 h-4 w-4' />
                Apply Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='relative flex h-screen w-full flex-col p-2'>
      {!messages.length && (
        <div className='p-4'>
          <h1 className='animate__animated animate__slow animate__fadeIn text-2xl font-bold'>
            Hello there!
          </h1>
          <p className='animate__animated animate__delay-1s animate__fadeInDown text-sm'>
            How can I help you improve your resume today?
          </p>
        </div>
      )}

      {/* Scrollable Messages Section */}
      <div
        ref={messagesContainerRef}
        className='flex-grow overflow-y-auto rounded-lg p-4 pb-[120px] scrollbar-hide'
      >
        {messages.map(renderMessage)}

        {loading && <p className='text-sm'>Thinking...</p>}
      </div>

      {/* Input Section */}
      <div className='sticky bottom-0 left-0 w-full p-4'>
        {!messages.length && (
          <div className='animate__animated animate__fadeInUp mb-4 flex flex-wrap justify-center gap-2'>
            {seedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                className='rounded-lg border px-3 py-2 text-xs transition-shadow hover:shadow'
                onClick={() => sendMessage(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className='animate__animated animate__slow animate__fadeIn relative w-full'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                sendMessage();
              }
            }}
            placeholder='Send a message...'
            className='w-full rounded-full border bg-secondary px-4 py-3 pr-20 shadow focus:outline-none'
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary-foreground px-3 py-2 text-sm text-secondary shadow hover:shadow-md focus:outline-none disabled:opacity-50'
          >
            <Send size={15} strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </div>
  );
}
