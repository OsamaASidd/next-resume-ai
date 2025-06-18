import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

export default function Messages() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  // Reference to scroll to the bottom of messages
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      // Use scrollTo instead of scrollIntoView to keep it contained
      const scrollContainer = messagesContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const data = 'Hello, this is a mock response from Samba!';
      const aiMessage = { role: 'assistant', content: data };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className='relative flex h-screen w-full flex-col p-2'>
      {!messages.length && (
        <div className='p-4'>
          <h1 className='animate__animated animate__slow animate__fadeIn text-2xl font-bold'>
            Hello there!
          </h1>
          <p className='animate__animated animate__delay-1s animate__fadeInDown text-sm'>
            How can I help you today?
          </p>
        </div>
      )}
      {/* Scrollable Messages Section */}
      <div
        ref={messagesContainerRef}
        className='flex-grow overflow-y-auto rounded-lg p-4 pb-[90px] scrollbar-hide'
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`animate__animated animate__fast animate__fadeIn mb-3 flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`inline-block max-w-[70%] rounded-t-xl border px-4 py-2 shadow ${
                msg.role === 'user'
                  ? 'rounded-s-xl bg-secondary'
                  : 'rounded-e-xl'
              }`}
            >
              {/* <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>{' '} */}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <p className='text-sm'>Thinking...</p>}
      </div>

      {/* Input Section */}
      <div className='sticky bottom-0 left-0 w-full p-4'>
        {!messages.length && (
          <div className='animate__animated animate__fadeInUp mb-4 flex justify-center gap-4'>
            <button className='rounded-lg border px-4 py-2 text-sm hover:shadow'>
              What are the advantages of using Next.js?
            </button>
            <button className='rounded-lg border px-4 py-2 text-sm hover:shadow'>
              Help me write an essay about Silicon Valley
            </button>
            <button className='rounded-lg border px-4 py-2 text-sm hover:shadow'>
              Write code to demonstrate Dijkstra's algorithm
            </button>
            <button className='rounded-lg border px-4 py-2 text-sm hover:shadow'>
              What is the weather in San Francisco?
            </button>
          </div>
        )}
        <div className='animate__animated animate__slow animate__fadeIn relative w-full'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            placeholder='Send a message...'
            className='w-full rounded-full border bg-secondary px-4 py-3 pr-20 shadow focus:outline-none'
          />
          <button
            onClick={sendMessage}
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary-foreground px-3 py-2 text-sm text-secondary shadow hover:shadow-md focus:outline-none'
          >
            <Send size={15} strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </div>
  );
}
