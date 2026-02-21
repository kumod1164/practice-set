"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  BookOpen,
  Sparkles,
  Eye,
} from "lucide-react";
import { formatTime } from "@/lib/services/test-service";
import { getMotivationalMessage } from "@/lib/motivational";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Question {
  _id: string;
  topic: string;
  subtopic: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  difficulty: string;
  explanation: string;
}

interface Test {
  _id: string;
  questions: Question[];
  answers: (number | null)[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  timeTaken: number;
  topicWisePerformance: {
    topic: string;
    correct: number;
    total: number;
    accuracy: number;
  }[];
  difficultyWisePerformance: {
    difficulty: string;
    correct: number;
    total: number;
    accuracy: number;
  }[];
}

export default function ResultsPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const testId = params.id as string;

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "skipped">("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTestResults();
    }
  }, [status, router]);

  const fetchTestResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tests/${testId}`);
      const data = await response.json();

      if (data.success) {
        setTest(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load test results",
          variant: "destructive",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load test results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!test) {
    return <div>Test not found</div>;
  }

  // Recalculate counts based on actual questions and answers
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  test.questions.forEach((question, index) => {
    const userAnswer = test.answers[index];
    if (userAnswer === null) {
      skippedCount++;
    } else if (userAnswer === question.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  // Recalculate percentage based on actual correct count
  const percentage = ((correctCount / test.totalQuestions) * 100).toFixed(2);
  const motivational = getMotivationalMessage(parseFloat(percentage));

  const filteredQuestions = test.questions.filter((question, index) => {
    const userAnswer = test.answers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    const isUnanswered = userAnswer === null;

    if (filter === "correct") return isCorrect;
    if (filter === "wrong") return !isCorrect && !isUnanswered;
    if (filter === "skipped") return isUnanswered;
    return true; // "all"
  });

  return (
    <>
      {!showReview ? (
        <>
          {/* Score Overview - Compact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Main Score Card */}
            <Card className="lg:col-span-2 border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold">{percentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {correctCount}/{test.totalQuestions} correct
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div 
                      className="text-center px-4 py-2 bg-green-50 dark:bg-green-950 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                      onClick={() => {
                        setShowReview(true);
                        setFilter("correct");
                      }}
                    >
                      <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                      <div className="text-xs text-green-700 dark:text-green-400">Correct</div>
                    </div>
                    <div 
                      className="text-center px-4 py-2 bg-red-50 dark:bg-red-950 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                      onClick={() => {
                        setShowReview(true);
                        setFilter("wrong");
                      }}
                    >
                      <div className="text-2xl font-bold text-red-600">{wrongCount}</div>
                      <div className="text-xs text-red-700 dark:text-red-400">Wrong</div>
                    </div>
                    <div 
                      className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => {
                        setShowReview(true);
                        setFilter("skipped");
                      }}
                    >
                      <div className="text-2xl font-bold text-gray-600">{skippedCount}</div>
                      <div className="text-xs text-gray-700 dark:text-gray-400">Skipped</div>
                    </div>
                  </div>
                </div>
                
                <Progress value={parseFloat(percentage)} className="h-2 mt-4" />
              </CardContent>
            </Card>

            {/* Time & Action Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Time Taken</div>
                    <div className="text-lg font-semibold">{formatTime(test.timeTaken)}</div>
                  </div>
                </div>
                <Button onClick={() => setShowReview(true)} className="w-full" size="lg">
                  <Eye className="mr-2 h-4 w-4" />
                  Review Answers
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Motivational Message - Compact */}
          <Card className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">{motivational.message}</span>
                  <span className="text-sm italic text-blue-700 dark:text-blue-300 ml-2">"{motivational.quote}"</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Analysis - Compact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Topic-wise Performance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Topic Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {test.topicWisePerformance.map((topic) => (
                  <div key={topic.topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{topic.topic}</span>
                      <span className="text-muted-foreground">
                        {topic.correct}/{topic.total} ({topic.accuracy.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={topic.accuracy} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Difficulty-wise Performance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Difficulty Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {test.difficultyWisePerformance.map((diff) => (
                  <div key={diff.difficulty}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium capitalize">{diff.difficulty}</span>
                      <span className="text-muted-foreground">
                        {diff.correct}/{diff.total} ({diff.accuracy.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={diff.accuracy} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Question Review */}
          <div className="mb-4 flex items-center justify-between">
            <Button variant="outline" onClick={() => {
              setShowReview(false);
              setFilter("all");
            }} size="sm">
              ← Back to Summary
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("all")}
              >
                All ({test.totalQuestions})
              </Button>
              <Button 
                variant={filter === "correct" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("correct")}
                className={filter === "correct" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Correct ({correctCount})
              </Button>
              <Button 
                variant={filter === "wrong" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("wrong")}
                className={filter === "wrong" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                Wrong ({wrongCount})
              </Button>
              <Button 
                variant={filter === "skipped" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("skipped")}
                className={filter === "skipped" ? "bg-gray-600 hover:bg-gray-700" : ""}
              >
                Skipped ({skippedCount})
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((question, filteredIndex) => {
              const originalIndex = test.questions.indexOf(question);
              const userAnswer = test.answers[originalIndex];
              const isCorrect = userAnswer === question.correctAnswer;
              const isUnanswered = userAnswer === null;

              return (
                <Card
                  key={question._id}
                  className={`border-l-4 ${
                    isUnanswered
                      ? "border-l-gray-400"
                      : isCorrect
                      ? "border-l-green-500"
                      : "border-l-red-500"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">Q{originalIndex + 1}</Badge>
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
                        <span className="text-xs text-muted-foreground">
                          {question.topic} › {question.subtopic}
                        </span>
                      </div>
                      {isCorrect && <Badge className="bg-green-500">✓ Correct</Badge>}
                      {!isCorrect && !isUnanswered && <Badge className="bg-red-500">✗ Wrong</Badge>}
                      {isUnanswered && <Badge variant="secondary">Skipped</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="font-medium">{question.question}</div>

                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isUserAnswer = userAnswer === optIndex;
                        const isCorrectAnswer = question.correctAnswer === optIndex;

                        return (
                          <div
                            key={optIndex}
                            className={`p-2 rounded-lg border text-sm ${
                              isCorrectAnswer
                                ? "bg-green-50 border-green-500 dark:bg-green-950"
                                : isUserAnswer && !isCorrect
                                ? "bg-red-50 border-red-500 dark:bg-red-950"
                                : "border-border"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="font-semibold min-w-[20px]">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <span className="flex-1">{option}</span>
                              {isCorrectAnswer && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />}
                              {isUserAnswer && !isCorrect && <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
                      <div className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">Explanation</div>
                      <div className="text-sm text-blue-800 dark:text-blue-200">{question.explanation}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
