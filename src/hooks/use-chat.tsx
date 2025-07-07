// src/hooks/use-chat.tsx
'use client';

import { useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: any[];
}

interface UseChatProps {
  formData: any;
  onApplyChanges?: (changes: any[]) => void;
}

export function useChat({ formData, onApplyChanges }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const parseAISuggestions = useCallback((content: string) => {
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
  }, []);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim()) return;

      const newUserMessage = { role: 'user' as const, content: messageText };
      setMessages((prev) => [...prev, newUserMessage]);
      setLoading(true);
      setStreamingContent('');

      try {
        const response = await fetch('/api/chat', {
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

        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  setStreamingContent(fullContent);
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }

        // Parse suggestions from the final content
        const suggestions = parseAISuggestions(fullContent);

        const assistantMessage: Message = {
          role: 'assistant',
          content: fullContent,
          suggestions: suggestions || undefined
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingContent('');
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
    },
    [messages, formData, parseAISuggestions]
  );

  const applyChanges = useCallback(
    (suggestions: any[]) => {
      if (onApplyChanges) {
        onApplyChanges(suggestions);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '✅ Changes have been applied to your resume!'
          }
        ]);
      }
    },
    [onApplyChanges]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingContent('');
  }, []);

  return {
    messages,
    loading,
    streamingContent,
    sendMessage,
    applyChanges,
    clearMessages
  };
}
