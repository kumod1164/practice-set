"use client";

import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { formatTime } from "@/lib/services/test-service";

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  onWarning?: () => void;
}

export default function Timer({ initialTime, onTimeUp, onWarning }: TimerProps) {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {
    setRemainingTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  useEffect(() => {
    // Show warning at 5 minutes (300 seconds)
    if (remainingTime === 300 && !warningShown && onWarning) {
      setWarningShown(true);
      onWarning();
    }
  }, [remainingTime, warningShown, onWarning]);

  const isWarning = remainingTime <= 300; // 5 minutes
  const isCritical = remainingTime <= 60; // 1 minute

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold transition-colors ${
        isCritical
          ? "bg-red-100 text-red-700 border-2 border-red-500 animate-pulse"
          : isWarning
          ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-500"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {isCritical && <AlertCircle className="h-5 w-5 animate-bounce" />}
      <Clock className="h-5 w-5" />
      <span>{formatTime(remainingTime)}</span>
    </div>
  );
}
