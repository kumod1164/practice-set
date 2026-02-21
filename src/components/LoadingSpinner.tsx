"use client";

import { useEffect, useState } from "react";
import { BookOpen, Brain, Target, Sparkles, Trophy, Zap } from "lucide-react";

const defaultMessages = [
  "Preparing your results...",
  "Analyzing your performance...",
  "Almost there...",
  "Calculating scores...",
  "Just a moment...",
  "Getting everything ready...",
];

const icons = [BookOpen, Brain, Target, Sparkles, Trophy, Zap];

interface LoadingSpinnerProps {
  messages?: string[];
}

export default function LoadingSpinner({ messages = defaultMessages }: LoadingSpinnerProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);

  const loadingMessages = messages.length > 0 ? messages : defaultMessages;

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    const iconInterval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 1500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(iconInterval);
    };
  }, [loadingMessages.length]);

  const CurrentIcon = icons[iconIndex];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          {/* Spinning outer ring */}
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
          
          {/* Animated icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CurrentIcon className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>
        
        {/* Rotating messages */}
        <p className="text-lg font-medium text-foreground animate-pulse">
          {loadingMessages[messageIndex]}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This won't take long
        </p>
      </div>
    </div>
  );
}
