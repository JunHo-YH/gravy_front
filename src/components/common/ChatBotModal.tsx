import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<string>;
}

export const ChatBotModal: React.FC<ChatBotModalProps> = ({ isOpen, onClose, onSendMessage }) => {
  const { logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! Gravy 챗봇입니다. 궁금한 것이 있으시면 언제든 물어보세요! 🤖',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const botResponse = await onSendMessage(inputText.trim());
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('챗봇 메시지 전송 에러:', error);
      
      // 토큰 만료 에러인 경우 처리
      if (error instanceof ApiError && error.code === 'TOKEN_EXPIRED') {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '세션이 만료되었습니다. 다시 로그인해주세요.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        
        // 모달 닫고 로그아웃 처리
        setTimeout(() => {
          onClose();
          logout();
        }, 2000);
      } else if (error instanceof ApiError && error.code.includes('HTTP_500')) {
        // 서버 내부 에러 (데이터베이스 연결 문제 등)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도하거나 관리자에게 문의해주세요.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && inputText.trim()) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Gravy 챗봇</h3>
              <p className="text-white text-sm opacity-90">언제든 도움을 드릴게요</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 opacity-70 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-yellow-500 to-amber-500">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="border-t bg-gray-50 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputText.trim() || isLoading}
              loading={isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};