"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface Question {
  _id?: string;
  topic: string;
  subtopic: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  tags: string[];
}

interface AdminQuestionFormProps {
  question?: Question | null;
  onClose: () => void;
}

export default function AdminQuestionForm({ question, onClose }: AdminQuestionFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Question>({
    topic: "",
    subtopic: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "",
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (question) {
      setFormData(question);
      setTagsInput(question.tags.join(", "));
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse tags
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      const payload = { ...formData, tags };

      const url = question?._id
        ? `/api/admin/questions/${question._id}`
        : "/api/admin/questions";
      const method = question?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: question?._id
            ? "Question updated successfully"
            : "Question created successfully",
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save question",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options] as [string, string, string, string];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {question?._id ? "Edit Question" : "Create New Question"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                  placeholder="e.g., History"
                />
              </div>

              <div>
                <Label htmlFor="subtopic">Subtopic *</Label>
                <Input
                  id="subtopic"
                  value={formData.subtopic}
                  onChange={(e) => setFormData({ ...formData, subtopic: e.target.value })}
                  required
                  placeholder="e.g., Ancient India"
                />
              </div>

              <div>
                <Label htmlFor="question">Question *</Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  rows={4}
                  placeholder="Enter the question text..."
                />
              </div>

              <div className="space-y-2">
                <Label>Options *</Label>
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8">{index + 1}.</span>
                    <Input
                      value={formData.options[index]}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      required
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="correctAnswer">Correct Answer *</Label>
                <Select
                  value={formData.correctAnswer.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, correctAnswer: parseInt(value) as 0 | 1 | 2 | 3 })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Option 1</SelectItem>
                    <SelectItem value="1">Option 2</SelectItem>
                    <SelectItem value="2">Option 3</SelectItem>
                    <SelectItem value="3">Option 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") =>
                    setFormData({ ...formData, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="explanation">Explanation *</Label>
                <Textarea
                  id="explanation"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  required
                  rows={4}
                  placeholder="Explain the correct answer..."
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g., maurya, ancient-india, empire"
                />
              </div>
            </div>

            {/* Right Column - Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {formData.topic} › {formData.subtopic}
                    </div>
                    <div className="text-sm font-medium mb-2">{formData.question || "Question will appear here..."}</div>
                  </div>

                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border transition-colors ${
                          index === formData.correctAnswer
                            ? "bg-green-500/10 border-green-500 dark:bg-green-500/20 dark:border-green-400"
                            : "bg-secondary/50 border-border"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-medium">{index + 1}.</span>
                          <span className="flex-1">{option || `Option ${index + 1}`}</span>
                          {index === formData.correctAnswer && (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                              ✓ Correct
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {formData.explanation && (
                    <div className="mt-4 p-3 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Explanation:</div>
                      <div className="text-sm text-blue-800 dark:text-blue-200">{formData.explanation}</div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-1 rounded font-medium ${
                        formData.difficulty === "easy"
                          ? "bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30"
                          : formData.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30"
                      }`}
                    >
                      {formData.difficulty}
                    </span>
                    {tagsInput && (
                      <div className="flex flex-wrap gap-1">
                        {tagsInput.split(",").map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 rounded bg-secondary border border-border text-foreground">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : question?._id ? "Update Question" : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
