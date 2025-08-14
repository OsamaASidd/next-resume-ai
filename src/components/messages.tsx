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
  const [applyingChanges, setApplyingChanges] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const seedPrompts = [
    'Help me write a compelling professional summary',
    'What skills should I highlight for a software engineer role?',
    'How do I make my resume ATS-friendly?',
    'Suggest action verbs for my work experience section',
    'Improve the impact statements in my job descriptions',
    'What keywords should I include for this industry?'
  ];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  /** ---------- Formatting helpers for assistant replies ---------- **/
  function formatAssistantResponse(rawResponse: string): string {
    const lines = rawResponse.split('\n');
    const formattedContent: string[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    const processInlineFormatting = (text: string): string => {
      // fenced inline code ```code```
      text = text.replace(
        /```([^`]+)```/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>'
      );
      // inline code `code`
      text = text.replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>'
      );
      // bold
      text = text.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/__([^_]+?)__/g, '<strong>$1</strong>');
      // italics
      text = text.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
      text = text.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em>$1</em>');
      // strikethrough
      text = text.replace(/~~([^~]+)~~/g, '<del>$1</del>');
      // links
      text = text.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noreferrer">$1</a>'
      );
      return text;
    };

    const closeCurrentList = () => {
      if (!listType) return;
      formattedContent.push(listType === 'ul' ? '</ul>' : '</ol>');
      listType = null;
    };

    const closeCodeBlock = () => {
      if (!inCodeBlock) return;
      formattedContent.push(
        '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto"><code>' +
          codeBlockContent.join('\n') +
          '</code></pre>'
      );
      codeBlockContent = [];
      inCodeBlock = false;
    };

    for (const line of lines) {
      const trimmed = line.trim();

      // code blocks
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          closeCodeBlock();
        } else {
          closeCurrentList();
          inCodeBlock = true;
        }
        continue;
      }
      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // hr
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        closeCurrentList();
        formattedContent.push('<hr class="my-4 border-gray-300">');
        continue;
      }

      // headings
      if (trimmed.startsWith('#')) {
        closeCurrentList();
        const m = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (m) {
          const level = m[1].length;
          const text = processInlineFormatting(m[2]);
          const classes: Record<number, string> = {
            1: 'text-2xl font-bold mt-6 mb-3',
            2: 'text-xl font-bold mt-5 mb-3',
            3: 'text-lg font-bold mt-4 mb-2',
            4: 'text-base font-bold mt-3 mb-2',
            5: 'text-sm font-bold mt-2 mb-1',
            6: 'text-xs font-bold mt-2 mb-1'
          };
          formattedContent.push(
            `<h${level} class="${classes[level]}">${text}</h${level}>`
          );
        }
        continue;
      }

      // unordered list
      if (
        trimmed.startsWith('- ') ||
        trimmed.startsWith('* ') ||
        trimmed.startsWith('+ ')
      ) {
        if (listType !== 'ul') {
          closeCurrentList();
          formattedContent.push(
            '<ul class="list-disc list-inside my-2 space-y-1">'
          );
          listType = 'ul';
        }
        const content = processInlineFormatting(trimmed.slice(2));
        formattedContent.push(`<li class="ml-4">${content}</li>`);
        continue;
      }

      // ordered list
      const ol = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (ol) {
        if (listType !== 'ol') {
          closeCurrentList();
          formattedContent.push(
            '<ol class="list-decimal list-inside my-2 space-y-1">'
          );
          listType = 'ol';
        }
        const content = processInlineFormatting(ol[2]);
        formattedContent.push(`<li class="ml-4">${content}</li>`);
        continue;
      }

      // blockquote
      if (trimmed.startsWith('>')) {
        closeCurrentList();
        const content = processInlineFormatting(trimmed.slice(1).trim());
        formattedContent.push(
          `<blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-2 bg-gray-50 italic">${content}</blockquote>`
        );
        continue;
      }

      // paragraph / empty line
      if (trimmed) {
        closeCurrentList();
        const content = processInlineFormatting(trimmed);
        formattedContent.push(`<p class="my-2">${content}</p>`);
      } else {
        closeCurrentList();
      }
    }

    // cleanup
    closeCurrentList();
    closeCodeBlock();
    return formattedContent.join('');
  }

  /** ---------- Parse <RESUME_CHANGES>…</RESUME_CHANGES> safely ---------- **/
  const parseAISuggestions = (content: string) => {
    const regex = /<RESUME_CHANGES>\s*([\s\S]*?)\s*<\/RESUME_CHANGES>/;
    const match = content.match(regex);
    if (!match) return null;

    try {
      const suggestionsText = match[1].trim();
      let suggestions = JSON.parse(suggestionsText);

      if (!Array.isArray(suggestions)) {
        suggestions = [suggestions];
      }

      const valid = suggestions.filter((s: any) => {
        const ok = s && typeof s === 'object' && s.section && s.action;
        if (!ok) console.warn('Invalid suggestion structure:', s);
        return ok;
      });

      return valid.length ? valid : null;
    } catch (err) {
      console.error('Error parsing suggestions:', err);
      return null;
    }
  };

  /** ---------- Send message to your API ---------- **/
  const sendMessage = async (messageText?: string) => {
    const userMessage = messageText ?? input;
    if (!userMessage.trim()) return;

    const newUserMessage = { role: 'user' as const, content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map((m) => ({
            role: m.role,
            content: m.content
          })),
          formData
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Unknown error');

      const suggestions = parseAISuggestions(result.content);
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.content,
        suggestions: suggestions || undefined
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
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

  /** ---------- Apply parsed changes ---------- **/
  const handleApplyChanges = async (suggestions: any[]) => {
    if (!suggestions || suggestions.length === 0) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ No valid changes to apply.' }
      ]);
      return;
    }

    setApplyingChanges(true);
    try {
      onApplyChanges(suggestions);

      const changesSummary = suggestions
        .map((change: any) => {
          const { section, action, explanation } = change || {};
          const sectionName =
            typeof section === 'string'
              ? section.replace(/_/g, ' ').toUpperCase()
              : 'SECTION';
          const actionName =
            typeof action === 'string' ? action.toUpperCase() : 'UPDATED';
          return `• ${actionName} ${sectionName}: ${explanation || 'Updated successfully'}`;
        })
        .join('\n');

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ Successfully applied ${suggestions.length} change(s) to your resume:\n\n${changesSummary}`
        }
      ]);
    } catch (err) {
      console.error('Error applying changes:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '❌ Failed to apply some changes. Please try again or apply them manually.'
        }
      ]);
    } finally {
      setApplyingChanges(false);
    }
  };

  /** ---------- Render helpers ---------- **/
  const renderMessage = (msg: Message, idx: number) => {
    // strip the RESUME_CHANGES payload from visible content
    const displayContent = msg.content
      .replace(/<RESUME_CHANGES>\s*([\s\S]*?)\s*<\/RESUME_CHANGES>/, '')
      .trim();

    const formattedContent =
      msg.role === 'assistant'
        ? formatAssistantResponse(displayContent)
        : displayContent;

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
            {msg.role === 'assistant' ? (
              <div
                dangerouslySetInnerHTML={{ __html: formattedContent }}
                className='prose prose-sm max-w-none [&>li]:my-1 [&>ol]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>p]:my-1 [&>ul]:my-2'
              />
            ) : (
              <div>{formattedContent}</div>
            )}
          </div>

          {/* Suggestions block with improved details + loading state */}
          {msg.suggestions && (
            <div className='mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3'>
              <p className='mb-2 text-sm text-blue-800'>
                I have {msg.suggestions.length} suggestion(s) to improve your
                resume:
              </p>
              <div className='mb-3 space-y-1'>
                {msg.suggestions.map((s, i) => (
                  <div key={i} className='text-xs text-blue-700'>
                    •{' '}
                    <span className='font-medium'>
                      {s?.action?.toUpperCase?.() || 'UPDATE'}
                    </span>{' '}
                    {(s?.section || '').toString().replace(/_/g, ' ')}:{' '}
                    {s?.explanation || 'No explanation provided'}
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handleApplyChanges(msg.suggestions!)}
                size='sm'
                className='bg-blue-600 hover:bg-blue-700'
                disabled={applyingChanges}
              >
                {applyingChanges ? (
                  <>
                    <div className='mr-1 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    Applying Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle className='mr-1 h-4 w-4' />
                    Apply Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  /** ---------- UI ---------- **/
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

      {/* Scrollable Messages */}
      <div
        ref={messagesContainerRef}
        className='flex-grow overflow-y-auto rounded-lg p-4 pb-[120px] scrollbar-hide'
      >
        {messages.map(renderMessage)}
        {loading && <p className='text-sm'>Thinking...</p>}
      </div>

      {/* Input */}
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
              if (e.key === 'Enter' && !loading) sendMessage();
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
