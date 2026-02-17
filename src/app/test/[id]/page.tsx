"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import Timer from "@/components/Timer";
import QuestionPalette from "@/components/QuestionPalette";
import QuestionCard from "@/components/QuestionCard";

interface Question {
  _id: string;
  topic: string;
  subtopic: string;
  question: string;
  options: [string, string, string, string];
  difficulty: "easy" | "medium" | "hard";
}

interface TestSession {
  _id: string;
  questions: Question[];
  answers: (number | null)[];
  markedForReview: boolean[];
  remainingTime: number;
  timeExtensions: number;
}

export default function TestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const sessionId = params.id as string;

  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTestSession();
    }
  }, [status, router]);

  const fetchTestSession = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tests/session");
      const data = await response.json();

      if (data.success && data.data) {
        setTestSession(data.data);
      } else {
        toast({
          title: "Error",
          description: "Test session not found",
          variant: "destructive",
        });
        router.push("/test/configure");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load test session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (answer: number) => {
    if (!testSession) return;

    try {
      const response = await fetch("/api/tests/session/answer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: testSession._id,
          questionIndex: currentIndex,
          answer,
        }),
      });

      if (response.ok) {
        const newAnswers = [...testSession.answers];
        newAnswers[currentIndex] = answer;
        setTestSession({ ...testSession, answers: newAnswers });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save answer",
        variant: "destructive",
      });
    }
  };

  const handleMarkToggle = async () => {
    if (!testSession) return;

    try {
      const response = await fetch("/api/tests/session/mark-review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: testSession._id,
          questionIndex: currentIndex,
        }),
      });

      if (response.ok) {
        const newMarked = [...testSession.markedForReview];
        newMarked[currentIndex] = !newMarked[currentIndex];
        setTestSession({ ...testSession, markedForReview: newMarked });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update mark status",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (testSession && currentIndex < testSession.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleTimeUp = useCallback(() => {
    if (!testSession) return;

    if (testSession.timeExtensions < 2) {
      setShowExtensionDialog(true);
    } else {
      // Auto-submit on final time expiry
      handleSubmit();
    }
  }, [testSession]);

  const handleTimeWarning = () => {
    toast({
      title: "Time Warning",
      description: "Only 5 minutes remaining!",
      variant: "destructive",
    });
  };

  const handleExtendTime = async (minutes: 5 | 10) => {
    if (!testSession) return;

    try {
      const response = await fetch("/api/tests/session/extend-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: testSession._id,
          minutes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTestSession({
          ...testSession,
          remainingTime: data.data.remainingTime,
          timeExtensions: data.data.timeExtensions,
        });
        setShowExtensionDialog(false);
        toast({
          title: "Time Extended",
          description: `Added ${minutes} minutes to your test`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extend time",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!testSession) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/tests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: testSession._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Test submitted successfully",
        });
        router.push(`/test/${data.data.testId}/results`);
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit test",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!testSession) {
    return null;
  }

  const currentQuestion = testSession.questions[currentIndex];
  const answeredCount = testSession.answers.filter((a) => a !== null).length;
  const unansweredCount = testSession.questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">UPSC Practice Test</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {testSession.questions.length}
              </p>
            </div>
            <Timer
              initialTime={testSession.remainingTime}
              onTimeUp={handleTimeUp}
              onWarning={handleTimeWarning}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-2 space-y-4">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={testSession.questions.length}
              selectedAnswer={testSession.answers[currentIndex]}
              isMarked={testSession.markedForReview[currentIndex]}
              onAnswerSelect={handleAnswerSelect}
              onMarkToggle={handleMarkToggle}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentIndex === testSession.questions.length - 1 ? (
                <Button onClick={() => setShowSubmitDialog(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  Review & Submit
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Question Palette */}
          <div>
            <QuestionPalette
              totalQuestions={testSession.questions.length}
              currentIndex={currentIndex}
              answers={testSession.answers}
              markedForReview={testSession.markedForReview}
              onQuestionSelect={setCurrentIndex}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2 mt-2">
                <p>Are you sure you want to submit your test?</p>
                <div className="bg-secondary p-3 rounded-lg space-y-1 text-sm">
                  <div>Answered: {answeredCount}</div>
                  <div>Unanswered: {unansweredCount}</div>
                  <div>Marked for Review: {testSession.markedForReview.filter((m) => m).length}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You cannot change your answers after submission.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Test"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Extension Dialog */}
      <AlertDialog open={showExtensionDialog} onOpenChange={setShowExtensionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 mt-2">
                <p>Your time has expired. Would you like to extend the test time?</p>
                <div className="bg-secondary p-3 rounded-lg text-sm">
                  <p>Extensions used: {testSession.timeExtensions} of 2</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {testSession.timeExtensions === 1
                      ? "This is your last extension"
                      : "You can extend twice"}
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSubmit}>Submit Now</AlertDialogCancel>
            <Button onClick={() => handleExtendTime(5)} variant="outline">
              +5 Minutes
            </Button>
            <Button onClick={() => handleExtendTime(10)}>+10 Minutes</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
