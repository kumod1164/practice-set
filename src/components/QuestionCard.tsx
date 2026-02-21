"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flag, FlagOff } from "lucide-react";

interface Question {
  _id: string;
  topic: string;
  subtopic: string;
  question: string;
  options: [string, string, string, string];
  difficulty: "easy" | "medium" | "hard";
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  isMarked: boolean;
  onAnswerSelect: (answer: number) => void;
  onMarkToggle: () => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isMarked,
  onAnswerSelect,
  onMarkToggle,
}: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                Question {questionNumber} of {totalQuestions}
              </Badge>
              <Badge
                variant="secondary"
                className={
                  question.difficulty === "easy"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : question.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }
              >
                {question.difficulty}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {question.topic} › {question.subtopic}
            </div>
          </div>
          <Button
            variant={isMarked ? "default" : "outline"}
            size="sm"
            onClick={onMarkToggle}
            className={isMarked ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {isMarked ? (
              <>
                <FlagOff className="h-4 w-4 mr-1" />
                Unmark
              </>
            ) : (
              <>
                <Flag className="h-4 w-4 mr-1" />
                Mark for Review
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium leading-relaxed">{question.question}</div>

        <RadioGroup
          value={selectedAnswer?.toString() ?? ""}
          onValueChange={(value) => onAnswerSelect(parseInt(value))}
        >
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedAnswer === index
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                }`}
                onClick={() => onAnswerSelect(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer font-normal"
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
