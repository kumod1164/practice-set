"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answers: (number | null)[];
  markedForReview: boolean[];
  onQuestionSelect: (index: number) => void;
}

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answers,
  markedForReview,
  onQuestionSelect,
}: QuestionPaletteProps) {
  const getQuestionStatus = (index: number) => {
    if (markedForReview[index]) return "marked";
    if (answers[index] !== null) return "answered";
    return "unanswered";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "marked":
        return "bg-orange-500 hover:bg-orange-600 text-white";
      default:
        return "bg-gray-200 hover:bg-gray-300 text-gray-700";
    }
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const markedCount = markedForReview.filter((m) => m).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Question Palette</CardTitle>
        <div className="flex gap-2 text-xs mt-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Answered: {answeredCount}
          </Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Marked: {markedCount}
          </Badge>
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Unanswered: {unansweredCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const status = getQuestionStatus(index);
            const isCurrent = index === currentIndex;

            return (
              <Button
                key={index}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                className={`h-10 w-full ${
                  !isCurrent ? getStatusColor(status) : ""
                } ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}
                onClick={() => onQuestionSelect(index)}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>

        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Not Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded ring-2 ring-primary ring-offset-2"></div>
            <span>Current Question</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
