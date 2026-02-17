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
  MinusCircle,
  TrendingUp,
  BookOpen,
  Home,
  Sparkles,
} from "lucide-react";
import { formatTime } from "@/lib/services/test-service";
import { getMotivationalMessage } from "@/lib/motivational";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const testId = params.id as string;

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  const percentage = ((test.score / test.totalQuestions) * 100).toFixed(2);
  const motivational = getMotivationalMessage(parseFloat(percentage));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Test Results</h1>
          <p className="text-muted-foreground">Here's how you performed</p>
        </div>

        {!showReview ? (
          <>
            {/* Score Card */}
            <Card className="mb-6 border-2 border-primary">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <div className="text-6xl font-bold mb-2">{percentage}%</div>
                  <div className="text-xl text-muted-foreground">
                    {test.score} out of {test.totalQuestions} correct
                  </div>
                </div>

                <Progress value={parseFloat(percentage)} className="h-3 mb-6" />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{test.correctAnswers}</div>
                    <div className="text-sm text-green-700">Correct</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{test.incorrectAnswers}</div>
                    <div className="text-sm text-red-700">Incorrect</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <MinusCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-600">{test.unansweredQuestions}</div>
                    <div className="text-sm text-gray-700">Unanswered</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-secondary rounded-lg flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Time Taken</div>
                    <div className="font-semibold">{formatTime(test.timeTaken)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Motivational Message */}
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Sparkles className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="text-xl font-semibold mb-2 text-blue-900">
                      {motivational.message}
                    </div>
                    <div className="text-sm italic text-blue-700 mb-3">"{motivational.quote}"</div>
                    {motivational.improvementMessage && (
                      <div className="text-sm font-medium text-green-700 bg-green-50 p-3 rounded-lg">
                        {motivational.improvementMessage}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Topic-wise Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Topic-wise Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {test.topicWisePerformance.map((topic) => (
                    <div key={topic.topic}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{topic.topic}</span>
                        <span className="text-sm text-muted-foreground">
                          {topic.correct}/{topic.total} ({topic.accuracy.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={topic.accuracy} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Difficulty-wise Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Difficulty-wise Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {test.difficultyWisePerformance.map((diff) => (
                    <div key={diff.difficulty}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium capitalize">{diff.difficulty}</span>
                        <span className="text-sm text-muted-foreground">
                          {diff.correct}/{diff.total} ({diff.accuracy.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={diff.accuracy} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
              <Button onClick={() => setShowReview(true)}>
                View Detailed Review
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Question Review */}
            <div className="mb-6">
              <Button variant="outline" onClick={() => setShowReview(false)} className="mb-4">
                ← Back to Summary
              </Button>
            </div>

            <div className="space-y-6">
              {test.questions.map((question, index) => {
                const userAnswer = test.answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                const isUnanswered = userAnswer === null;

                return (
                  <Card
                    key={question._id}
                    className={`border-2 ${
                      isUnanswered
                        ? "border-gray-300"
                        : isCorrect
                        ? "border-green-500"
                        : "border-red-500"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Question {index + 1}</Badge>
                            <Badge
                              variant="secondary"
                              className={
                                question.difficulty === "easy"
                                  ? "bg-green-100 text-green-800"
                                  : question.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {question.difficulty}
                            </Badge>
                            {isCorrect && (
                              <Badge className="bg-green-500">✓ Correct</Badge>
                            )}
                            {!isCorrect && !isUnanswered && (
                              <Badge className="bg-red-500">✗ Incorrect</Badge>
                            )}
                            {isUnanswered && (
                              <Badge variant="secondary">Not Answered</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {question.topic} › {question.subtopic}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-lg font-medium">{question.question}</div>

                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex;
                          const isCorrectAnswer = question.correctAnswer === optIndex;

                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border-2 ${
                                isCorrectAnswer
                                  ? "bg-green-50 border-green-500"
                                  : isUserAnswer && !isCorrect
                                  ? "bg-red-50 border-red-500"
                                  : "border-border"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="font-semibold">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span className="flex-1">{option}</span>
                                {isCorrectAnswer && (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="font-semibold text-blue-900 mb-2">Explanation:</div>
                        <div className="text-blue-800">{question.explanation}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <Button onClick={() => router.push("/dashboard")}>
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
