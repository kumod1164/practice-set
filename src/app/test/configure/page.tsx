"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Clock, BookOpen, Target, Play } from "lucide-react";

const TOPICS = [
  "History",
  "Geography",
  "Polity",
  "Economy",
  "Science & Technology",
  "Environment",
];

const SUBTOPICS: Record<string, string[]> = {
  History: ["Ancient India", "Medieval India", "Modern India"],
  Geography: ["Physical Geography", "Climate", "Economic Geography"],
  Polity: ["Constitution", "Parliament", "Judiciary"],
  Economy: ["Banking", "Budget", "Economic Development"],
  "Science & Technology": ["Space", "Physics", "Biology"],
  Environment: ["Ecology", "Climate Change", "Conservation"],
};

export default function TestConfigurePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [availableCount, setAvailableCount] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setDurationMinutes(Math.ceil(questionCount * 1.2));
  }, [questionCount]);

  // Check for active session on mount
  useEffect(() => {
    const checkActiveSession = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/tests/session");
          const data = await response.json();
          if (data.success && data.data) {
            setActiveSession(data.data);
          }
        } catch (error) {
          console.error("Failed to check active session:", error);
        } finally {
          setCheckingSession(false);
        }
      }
    };

    checkActiveSession();
  }, [status]);

  const handleAbandonSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tests/session/abandon", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Test session abandoned",
        });
        setActiveSession(null);
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
        description: "Failed to abandon session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSession = () => {
    if (activeSession) {
      router.push(`/test/${activeSession._id}`);
    }
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
    // Clear subtopics when topic is deselected
    if (selectedTopics.includes(topic)) {
      setSelectedSubtopics((prev) =>
        prev.filter((st) => !SUBTOPICS[topic]?.includes(st))
      );
    }
  };

  const handleSubtopicToggle = (subtopic: string) => {
    setSelectedSubtopics((prev) =>
      prev.includes(subtopic) ? prev.filter((st) => st !== subtopic) : [...prev, subtopic]
    );
  };

  const handleValidate = async () => {
    if (selectedTopics.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one topic",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tests/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: selectedTopics,
          subtopics: selectedSubtopics.length > 0 ? selectedSubtopics : undefined,
          difficulty,
          questionCount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAvailableCount(data.data.availableCount);
        toast({
          title: "Configuration Valid",
          description: `${data.data.availableCount} questions available`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        setAvailableCount(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    if (!availableCount) {
      toast({
        title: "Error",
        description: "Please validate configuration first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tests/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: selectedTopics,
          subtopics: selectedSubtopics.length > 0 ? selectedSubtopics : undefined,
          difficulty,
          questionCount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Test started successfully",
        });
        router.push(`/test/${data.data.sessionId}`);
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
        description: "Failed to start test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Configure Your Test</h1>
        <p className="text-muted-foreground">
          Customize your practice test by selecting topics, difficulty, and question count
        </p>
      </div>

      {/* Active Session Warning */}
      {activeSession && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1">
                  You have an ongoing test
                </h3>
                <p className="text-sm text-orange-700 mb-4">
                  You have an active test session with {activeSession.questions?.length || 0} questions.
                  You can resume it or abandon it to start a new test.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleResumeSession}
                    variant="default"
                    size="sm"
                  >
                    Resume Test
                  </Button>
                  <Button
                    onClick={handleAbandonSession}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? "Abandoning..." : "Abandon Test"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topics Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Topics</CardTitle>
              <CardDescription>Choose one or more topics to practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TOPICS.map((topic) => (
                  <div
                    key={topic}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTopics.includes(topic)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleTopicToggle(topic)}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={selectedTopics.includes(topic)} />
                      <span className="font-medium text-sm">{topic}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subtopics Selection */}
          {selectedTopics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Subtopics (Optional)</CardTitle>
                <CardDescription>Narrow down to specific subtopics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTopics.map((topic) => (
                    <div key={topic}>
                      <div className="font-medium mb-2 text-sm text-muted-foreground">{topic}</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {SUBTOPICS[topic]?.map((subtopic) => (
                          <div
                            key={subtopic}
                            className={`p-2 border rounded cursor-pointer text-sm transition-all ${
                              selectedSubtopics.includes(subtopic)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => handleSubtopicToggle(subtopic)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox checked={selectedSubtopics.includes(subtopic)} />
                              <span>{subtopic}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Difficulty & Question Count */}
          <Card>
            <CardHeader>
              <CardTitle>Test Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Difficulty Level</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(["easy", "medium", "hard", "mixed"] as const).map((level) => (
                    <div
                      key={level}
                      className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                        difficulty === level
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setDifficulty(level)}
                    >
                      <span className="font-medium capitalize">{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="questionCount">Number of Questions</Label>
                <Input
                  id="questionCount"
                  type="number"
                  min={1}
                  max={200}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 10-50 questions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Topics</div>
                  <div className="font-semibold">{selectedTopics.length || "None"}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                  <div className="font-semibold">{questionCount}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-semibold">{durationMinutes} minutes</div>
                </div>
              </div>

              {availableCount !== null && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-800">
                    ✓ {availableCount} questions available
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4">
                <Button
                  onClick={handleValidate}
                  disabled={loading || selectedTopics.length === 0 || !!activeSession}
                  className="w-full"
                  variant="outline"
                >
                  {loading ? "Validating..." : "Validate Configuration"}
                </Button>

                <Button
                  onClick={handleStartTest}
                  disabled={loading || !availableCount || !!activeSession}
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {loading ? "Starting..." : "Start Test"}
                </Button>
                
                {activeSession && (
                  <p className="text-xs text-center text-muted-foreground">
                    Resume or abandon your current test to start a new one
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Selected Topics</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTopics.length === 0 ? (
                <p className="text-sm text-muted-foreground">No topics selected</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedTopics.map((topic) => (
                    <Badge key={topic} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
