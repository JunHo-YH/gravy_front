import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './Button';

interface ChatBotButtonProps {
  onClick?: () => void;
}

export const ChatBotButton: React.FC<ChatBotButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        className="w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        variant="primary"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};